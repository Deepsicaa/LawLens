import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ─── RAG Pipeline ─────────────────────────────────────────────────────────────
// Uses Voyage AI (voyage-law-2) + Qdrant hybrid retrieval + Cohere reranking.
// Falls back to LLM-only when Qdrant is not available or has no documents.

function getRAGConfig() {
  const qdrantApiKey = process.env["QDRANT_API_KEY"];
  return {
    voyageApiKey: process.env["VOYAGE_API_KEY"] ?? "",
    qdrantUrl: process.env["QDRANT_URL"] ?? "http://localhost:6333",
    ...(qdrantApiKey ? { qdrantApiKey } : {}),
    cohereApiKey: process.env["COHERE_API_KEY"] ?? "",
    openRouterApiKey: process.env["OPENROUTER_API_KEY"] ?? "",
    topK: 30,
    rerankTopN: 5,
  };
}

function isRAGEnabled(): boolean {
  // RAG requires an explicitly configured Qdrant URL (not the localhost default).
  // On Vercel and other cloud hosts, localhost:6333 is unreachable, so we only
  // enable the RAG path when QDRANT_URL is explicitly set in the environment.
  const qdrantConfigured = !!process.env["QDRANT_URL"];
  return !!(process.env["OPENROUTER_API_KEY"] && qdrantConfigured);
}

// ─── Fallback System Prompt (LLM-only mode) ───────────────────────────────────
const JURISDICTION_CONTEXT: Record<string, string> = {
  india:
    "You are answering questions about Indian law. Reference the Indian Penal Code (IPC/BNS), Constitution of India, and other Indian statutes where relevant.",
  uk: "You are answering questions about United Kingdom law. Reference Acts of Parliament, the UK Constitution, and relevant UK legislation.",
  canada:
    "You are answering questions about Canadian law. Reference the Criminal Code of Canada, Canadian Charter of Rights and Freedoms, and federal/provincial statutes.",
  australia:
    "You are answering questions about Australian law. Reference Commonwealth legislation, the Australian Constitution, and relevant state/territory laws.",
};

const FALLBACK_SYSTEM_PROMPT = (jurisdiction: string) => `You are LawLens, an AI legal research assistant specializing in ${jurisdiction} law.

${JURISDICTION_CONTEXT[jurisdiction] ?? ""}

CRITICAL RULES:
1. Base your answer on well-established ${jurisdiction} law and legislation.
2. Always cite the specific Act, Section, or legal provision you are referencing.
3. Use the citation format: Act Name, Section Number (Year) — e.g., "Indian Penal Code, Section 379 (1860)"
4. If you are uncertain, explicitly say so rather than guessing.
5. Never fabricate laws, sections, or cases.
6. End your response with a disclaimer: "Always consult a qualified lawyer for advice specific to your situation."

Format your response clearly with:
- A direct answer to the question
- The relevant legal provisions cited inline
- Key points in plain English`;

// ─── Jurisdiction Auto-Detection ─────────────────────────────────────────────
type Jurisdiction = "india" | "uk" | "canada" | "australia";

const JURISDICTION_SIGNALS: Array<[Jurisdiction, RegExp]> = [
  // UK — must come before Canada to avoid "British Columbia" ambiguity
  ["uk",        /\b(uk|u\.k\.|united kingdom|england|england and wales|scotland|scottish|wales|welsh|northern ireland|british law|british landlord|uk law|uk landlord|english law|english court|high court of england)\b/i],
  ["canada",    /\b(canada|canadian|ontario|qu[eé]bec|alberta|british columbia|nova scotia|manitoba|saskatchewan|new brunswick|newfoundland|canada labour|criminal code of canada|canadian charter)\b/i],
  ["australia", /\b(australia|australian|nsw|new south wales|victoria|queensland|south australia|western australia|tasmania|northern territory|fair work australia|australian consumer law)\b/i],
  ["india",     /\b(india|indian|bharat|delhi|mumbai|bangalore|bengaluru|hyderabad|kolkata|chennai|ipc|bns|indian penal|constitution of india)\b/i],
];

function detectJurisdiction(question: string): Jurisdiction | null {
  for (const [jurisdiction, pattern] of JURISDICTION_SIGNALS) {
    if (pattern.test(question)) return jurisdiction;
  }
  return null;
}

interface QueryBody {
  question: string;
  jurisdiction?: string;
  conversationId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QueryBody;
    const { question, jurisdiction: clientJurisdiction = "india" } = body;

    // Auto-detect jurisdiction from question text; falls back to client selection
    const detected = detectJurisdiction(question);
    const jurisdiction = detected ?? (clientJurisdiction as Jurisdiction);

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env["OPENROUTER_API_KEY"];
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const startTime = Date.now();
    const encoder = new TextEncoder();

    // ── RAG Mode ────────────────────────────────────────────────────────────
    if (isRAGEnabled()) {
      const config = getRAGConfig();
      // cancelled is shared between start() and cancel() via closure
      let cancelled = false;

      const readable = new ReadableStream({
        async start(ctrl) {
          // Safe helpers — no-ops if the stream was already cancelled/closed
          const send = (data: Uint8Array) => {
            if (cancelled) return;
            try { ctrl.enqueue(data); } catch { cancelled = true; }
          };
          const closeStream = () => {
            if (cancelled) return;
            cancelled = true;
            try { ctrl.close(); } catch { /* already closed */ }
          };

          try {
            const { runRAGPipeline } = await import("@lawlens/rag");

            await runRAGPipeline(question, jurisdiction as "india" | "uk" | "canada" | "australia", config, {
              onChunk(chunk) {
                send(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
              },
              onDone(result) {
                const finalPayload = {
                  final: {
                    answer: result.answer,
                    citations: result.citations,
                    confidenceScore: result.confidenceScore,
                    jurisdiction: result.jurisdiction,
                    retrievedDocuments: result.retrievedDocuments,
                    processingTimeMs: result.processingTimeMs,
                    hasUnsupportedClaims: result.hasUnsupportedClaims,
                    mode: "rag",
                  },
                };
                send(encoder.encode(`data: ${JSON.stringify(finalPayload)}\n\n`));
                send(encoder.encode("data: [DONE]\n\n"));
                closeStream();
              },
              onError(error) {
                console.error("[RAG] Pipeline error:", error);
                send(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
                closeStream();
              },
            });
          } catch (err) {
            console.warn("[RAG] Pipeline exception:", err);
            // closeStream is in scope via closure
            if (!cancelled) {
              cancelled = true;
              try { ctrl.close(); } catch { /* already closed */ }
            }
          }
        },
        cancel() {
          cancelled = true;
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // ── LLM-only Fallback Mode ──────────────────────────────────────────────
    const client = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
        "X-Title": "LawLens",
      },
    });

    const stream = await client.chat.completions.create({
      model: "anthropic/claude-sonnet-4-6",
      max_tokens: 1500,
      temperature: 0.1,
      stream: true,
      messages: [
        { role: "system", content: FALLBACK_SYSTEM_PROMPT(jurisdiction) },
        { role: "user", content: question },
      ],
    });

    let fullAnswer = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              fullAnswer += delta;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ chunk: delta })}\n\n`)
              );
            }
          }

          const citations = extractCitations(fullAnswer, jurisdiction);
          const finalPayload = {
            final: {
              answer: fullAnswer,
              citations,
              confidenceScore: citations.length > 0 ? 0.65 : 0.45,
              jurisdiction,
              retrievedDocuments: 0,
              processingTimeMs: Date.now() - startTime,
              hasUnsupportedClaims: false,
              mode: "llm-only",
            },
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(finalPayload)}\n\n`)
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── Citation Extraction (LLM-only fallback) ──────────────────────────────────
function extractCitations(
  text: string,
  jurisdiction: string
): Array<{
  id: string;
  source: string;
  section: string;
  text: string;
  url?: string;
  jurisdiction: string;
  relevanceScore: number;
}> {
  const citations: ReturnType<typeof extractCitations> = [];
  const seen = new Set<string>();

  const patterns = [
    /([A-Z][A-Za-z\s]+(?:Act|Code|Charter|Constitution|Ordinance|Regulation)[^,]*),\s*(?:Section|s\.|Art(?:icle)?\.?)\s*(\d+[A-Za-z]?(?:\(\d+\))?)/g,
    /(?:Section|s\.)\s*(\d+[A-Za-z]?)\s+of\s+(?:the\s+)?([A-Z][A-Za-z\s]+(?:Act|Code|Charter|Constitution))/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const source = (match[1] ?? match[2] ?? "").trim();
      const section = `Section ${(match[2] ?? match[1] ?? "").trim()}`;
      const key = `${source}:${section}`;

      if (!seen.has(key) && source.length > 3) {
        seen.add(key);
        const url = getSourceUrl(source, jurisdiction);
        citations.push({
          id: crypto.randomUUID(),
          source,
          section,
          text: extractSentenceAround(text, match.index),
          jurisdiction,
          relevanceScore: 0.75,
          ...(url !== undefined ? { url } : {}),
        });
      }
    }
  }

  return citations.slice(0, 5);
}

function extractSentenceAround(text: string, index: number): string {
  const start = Math.max(0, text.lastIndexOf(".", index - 100) + 1);
  const end =
    Math.min(text.length, text.indexOf(".", index + 50) + 1) || text.length;
  return text.slice(start, end).trim().slice(0, 300);
}

function getSourceUrl(source: string, jurisdiction: string): string | undefined {
  const s = source.toLowerCase();
  if (jurisdiction === "india") {
    if (s.includes("penal code") || s.includes("ipc") || s.includes("bns"))
      return "https://indiacode.nic.in";
    return "https://indiacode.nic.in";
  }
  if (jurisdiction === "uk") return "https://www.legislation.gov.uk";
  if (jurisdiction === "canada") return "https://laws-lois.justice.gc.ca";
  if (jurisdiction === "australia") return "https://www.legislation.gov.au";
  return undefined;
}
