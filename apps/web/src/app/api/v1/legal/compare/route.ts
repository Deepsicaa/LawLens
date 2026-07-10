import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ─── Compare endpoint — queries multiple jurisdictions in parallel ─────────────
// Uses RAG pipeline when available, falls back to LLM-only.

function getRAGConfig() {
  const qdrantApiKey = process.env["QDRANT_API_KEY"];
  return {
    voyageApiKey: process.env["VOYAGE_API_KEY"] ?? "",
    qdrantUrl: process.env["QDRANT_URL"] ?? "http://localhost:6333",
    ...(qdrantApiKey ? { qdrantApiKey } : {}),
    cohereApiKey: process.env["COHERE_API_KEY"] ?? "",
    openRouterApiKey: process.env["OPENROUTER_API_KEY"] ?? "",
    topK: 20,
    rerankTopN: 4,
  };
}

function isRAGEnabled(): boolean {
  const cfg = getRAGConfig();
  return !!(cfg.openRouterApiKey && cfg.qdrantUrl);
}

const JURISDICTION_CONTEXT: Record<string, string> = {
  india:
    "Indian law — reference the Indian Penal Code (IPC/BNS), Constitution of India, Indian Contract Act, Consumer Protection Act, and other Indian statutes. Cite as: Act Name, Section X (Year).",
  uk: "United Kingdom law — reference Acts of Parliament, the UK Human Rights Act, Equality Act, and relevant UK legislation. Cite as: Act Name, Section X (Year).",
  canada:
    "Canadian law — reference the Criminal Code of Canada, Canadian Charter of Rights and Freedoms, PIPEDA, and federal/provincial statutes. Cite as: Act Name, Section X (Year).",
  australia:
    "Australian law — reference Commonwealth legislation, the Australian Constitution, Fair Work Act, Privacy Act, and relevant state laws. Cite as: Act Name, Section X (Year).",
};

const COMPARE_PROMPT = (jurisdiction: string, question: string) =>
  `You are LawLens, a legal research AI. Answer the following legal question under ${JURISDICTION_CONTEXT[jurisdiction] ?? jurisdiction}

Question: ${question}

Rules:
1. Answer concisely (150-200 words max).
2. Cite the specific Act and Section for every claim.
3. Be factual. Do not fabricate laws.
4. Structure: one paragraph answer + bullet-pointed key provisions.

Do NOT add a disclaimer at the end.`;

interface CompareBody {
  question: string;
  jurisdictions: string[];
}

interface JurisdictionResult {
  jurisdiction: string;
  answer: string;
  citations: Array<{
    id: string;
    source: string;
    section: string;
    text: string;
    url?: string;
    jurisdiction: string;
    relevanceScore: number;
  }>;
  confidenceScore: number;
  retrievedDocuments: number;
  mode?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CompareBody;
    const { question, jurisdictions } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    if (!jurisdictions || jurisdictions.length < 2) {
      return NextResponse.json(
        { error: "At least 2 jurisdictions required" },
        { status: 400 }
      );
    }

    const apiKey = process.env["OPENROUTER_API_KEY"];
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const startTime = Date.now();
    const config = getRAGConfig();
    const ragEnabled = isRAGEnabled();

    const results = await Promise.all(
      jurisdictions.map(async (jurisdiction): Promise<JurisdictionResult> => {
        // ── RAG Mode ──────────────────────────────────────────────────────
        if (ragEnabled) {
          try {
            const { runRAGPipeline } = await import("@lawlens/rag");
            let answer = "";
            let citations: JurisdictionResult["citations"] = [];
            let confidenceScore = 0.5;
            let retrievedDocuments = 0;

            await new Promise<void>((resolve, reject) => {
              runRAGPipeline(
                question,
                jurisdiction as "india" | "uk" | "canada" | "australia",
                config,
                {
                  onChunk(chunk) {
                    answer += chunk;
                  },
                  onDone(result) {
                    answer = result.answer;
                    citations = result.citations;
                    confidenceScore = result.confidenceScore;
                    retrievedDocuments = result.retrievedDocuments;
                    resolve();
                  },
                  onError: reject,
                }
              ).catch(reject);
            });

            return { jurisdiction, answer, citations, confidenceScore, retrievedDocuments, mode: "rag" };
          } catch (err) {
            console.warn(`[RAG] Compare fallback for ${jurisdiction}:`, err);
            // Fall through to LLM-only
          }
        }

        // ── LLM-only Fallback ─────────────────────────────────────────────
        try {
          const client = new OpenAI({
            apiKey,
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
              "HTTP-Referer":
                process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
              "X-Title": "LawLens Compare",
            },
          });

          const completion = await client.chat.completions.create({
            model: "anthropic/claude-haiku-4-5",
            max_tokens: 600,
            temperature: 0.1,
            messages: [
              {
                role: "user",
                content: COMPARE_PROMPT(jurisdiction, question),
              },
            ],
          });

          const answer = completion.choices[0]?.message?.content ?? "No answer generated.";
          const citations = extractCitations(answer, jurisdiction);

          return {
            jurisdiction,
            answer,
            citations,
            confidenceScore: citations.length > 0 ? 0.65 : 0.45,
            retrievedDocuments: 0,
            mode: "llm-only",
          };
        } catch {
          return {
            jurisdiction,
            answer: `Unable to retrieve information for ${jurisdiction} at this time.`,
            citations: [],
            confidenceScore: 0,
            retrievedDocuments: 0,
            mode: "error",
          };
        }
      })
    );

    return NextResponse.json({
      results,
      processingTimeMs: Date.now() - startTime,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractCitations(
  text: string,
  jurisdiction: string
): JurisdictionResult["citations"] {
  const citations: JurisdictionResult["citations"] = [];
  const seen = new Set<string>();

  const patterns = [
    /([A-Z][A-Za-z\s]+(?:Act|Code|Charter|Constitution|Ordinance|Regulation)[^,.\n]*),\s*(?:Section|s\.|Art(?:icle)?\.?)\s*(\d+[A-Za-z]?(?:\(\d+\))?)/g,
    /(?:Section|s\.)\s*(\d+[A-Za-z]?)\s+of\s+(?:the\s+)?([A-Z][A-Za-z\s]+(?:Act|Code|Charter|Constitution))/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const source = (match[1] ?? match[2] ?? "").trim();
      const section = `Section ${(match[2] ?? match[1] ?? "").trim()}`;
      const key = `${source}:${section}`;
      if (!seen.has(key) && source.length > 4) {
        seen.add(key);
        citations.push({
          id: crypto.randomUUID(),
          source,
          section,
          text: text.slice(Math.max(0, match.index - 60), match.index + 120).trim(),
          jurisdiction,
          relevanceScore: 0.75,
          url: getSourceUrl(jurisdiction),
        });
      }
    }
  }

  return citations.slice(0, 4);
}

function getSourceUrl(jurisdiction: string): string {
  const urls: Record<string, string> = {
    india: "https://indiacode.nic.in",
    uk: "https://www.legislation.gov.uk",
    canada: "https://laws-lois.justice.gc.ca",
    australia: "https://www.legislation.gov.au",
  };
  return urls[jurisdiction] ?? "#";
}
