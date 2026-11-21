import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

function getRAGConfig() {
  const qdrantApiKey = process.env["QDRANT_API_KEY"];
  return {
    voyageApiKey: process.env["VOYAGE_API_KEY"] ?? "",
    qdrantUrl: process.env["QDRANT_URL"] ?? "",
    ...(qdrantApiKey ? { qdrantApiKey } : {}),
    cohereApiKey: process.env["COHERE_API_KEY"] ?? "",
    openRouterApiKey: process.env["OPENROUTER_API_KEY"] ?? "",
    topK: 30,
    rerankTopN: 5,
  };
}

// ─── Jurisdiction Auto-Detection ─────────────────────────────────────────────
type Jurisdiction = "india" | "uk" | "canada" | "australia";

const JURISDICTION_SIGNALS: Array<[Jurisdiction, RegExp]> = [
  // UK — must come before Canada to avoid "British Columbia" ambiguity
  [
    "uk",
    /\b(uk|u\.k\.|united kingdom|england|england and wales|scotland|scottish|wales|welsh|northern ireland|british law|british landlord|uk law|uk landlord|english law|english court|high court of england)\b/i,
  ],
  [
    "canada",
    /\b(canada|canadian|ontario|qu[eé]bec|alberta|british columbia|nova scotia|manitoba|saskatchewan|new brunswick|newfoundland|canada labour|criminal code of canada|canadian charter)\b/i,
  ],
  [
    "australia",
    /\b(australia|australian|nsw|new south wales|victoria|queensland|south australia|western australia|tasmania|northern territory|fair work australia|australian consumer law)\b/i,
  ],
  [
    "india",
    /\b(india|indian|bharat|delhi|mumbai|bangalore|bengaluru|hyderabad|kolkata|chennai|ipc|bns|indian penal|constitution of india)\b/i,
  ],
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
    if (!(await auth()).userId)
      return NextResponse.json({ error: "Sign in to use legal research" }, { status: 401 });
    const body = (await req.json()) as QueryBody;
    const { question, jurisdiction: clientJurisdiction = "india" } = body;

    // Auto-detect jurisdiction from question text; falls back to client selection
    const detected = detectJurisdiction(question);
    const jurisdiction = detected ?? (clientJurisdiction as Jurisdiction);

    if (typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    if (!["india", "uk", "canada", "australia"].includes(jurisdiction))
      return NextResponse.json({ error: "Unsupported jurisdiction" }, { status: 400 });

    const apiKey = process.env["OPENROUTER_API_KEY"];
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const encoder = new TextEncoder();

    const config = getRAGConfig();
    // cancelled is shared between start() and cancel() via closure
    let cancelled = false;

    const readable = new ReadableStream({
      async start(ctrl) {
        // Safe helpers — no-ops if the stream was already cancelled/closed
        const send = (data: Uint8Array) => {
          if (cancelled) return;
          try {
            ctrl.enqueue(data);
          } catch {
            cancelled = true;
          }
        };
        const closeStream = () => {
          if (cancelled) return;
          cancelled = true;
          try {
            ctrl.close();
          } catch {
            /* already closed */
          }
        };

        try {
          const { runRAGPipeline } = await import("@lawlens/rag");

          await runRAGPipeline(
            question,
            jurisdiction as "india" | "uk" | "canada" | "australia",
            config,
            {
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
            }
          );
        } catch (err) {
          console.warn("[RAG] Pipeline exception:", err);
          // closeStream is in scope via closure
          if (!cancelled) {
            cancelled = true;
            try {
              ctrl.close();
            } catch {
              /* already closed */
            }
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
