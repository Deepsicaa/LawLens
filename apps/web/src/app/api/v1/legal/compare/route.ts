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
    topK: 20,
    rerankTopN: 4,
  };
}

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
    if (!(await auth()).userId)
      return NextResponse.json({ error: "Sign in to use legal research" }, { status: 401 });
    const body = (await req.json()) as CompareBody;
    const { question, jurisdictions } = body;

    if (typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    if (
      !Array.isArray(jurisdictions) ||
      jurisdictions.length < 2 ||
      jurisdictions.length > 4 ||
      new Set(jurisdictions).size !== jurisdictions.length ||
      jurisdictions.some((j) => !["india", "uk", "canada", "australia"].includes(j))
    ) {
      return NextResponse.json(
        { error: "Choose two to four distinct supported jurisdictions" },
        { status: 400 }
      );
    }

    const apiKey = process.env["OPENROUTER_API_KEY"];
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const startTime = Date.now();
    const config = getRAGConfig();

    const results = await Promise.all(
      jurisdictions.map(async (jurisdiction): Promise<JurisdictionResult> => {
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

          return {
            jurisdiction,
            answer,
            citations,
            confidenceScore,
            retrievedDocuments,
            mode: "rag",
          };
        } catch (err) {
          console.warn("Comparison failed", err);
          return {
            jurisdiction,
            answer: "Unable to retrieve an answer at this time.",
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
