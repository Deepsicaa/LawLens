import type { Jurisdiction, RetrievedChunk, Citation, RAGResult, RAGConfig } from "./types";
import { createQdrantClient } from "./vectorstore";
import { hybridRetrieve } from "./retriever";
import { rerank } from "./reranker";

const SYSTEM_PROMPT = (jurisdiction: string, context: string) =>
  `You are LawLens, an AI legal research assistant. You answer legal questions using ONLY the official legal documents provided below as context.

JURISDICTION: ${jurisdiction.toUpperCase()}

OFFICIAL LEGAL SOURCES:
${context}

STRICT RULES:
1. Answer solely from the provided legal documents. Never use knowledge not present in the context.
2. Cite every factual claim using the format: [Act Name, Section X (Year)]
3. If the documents do not contain sufficient information, say "The provided legal documents do not contain sufficient information to answer this question."
4. Never fabricate laws, sections, or cases.
5. End with: "Always consult a qualified lawyer for advice specific to your situation."

Format your response:
- A direct, plain-English answer
- Key legal provisions cited inline
- Important conditions or exceptions`;

function buildContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.source}, ${c.section} — ${c.title}\n${c.text}\n(Source: ${c.url})`
    )
    .join("\n\n---\n\n");
}

function chunksToContextCitations(chunks: RetrievedChunk[], jurisdiction: Jurisdiction): Citation[] {
  return chunks.slice(0, 5).map((c) => ({
    id: crypto.randomUUID(),
    source: c.source,
    section: c.section,
    text: c.text.slice(0, 300),
    url: c.url,
    jurisdiction,
    relevanceScore: Number(c.score.toFixed(3)),
  }));
}

function scoreConfidence(chunks: RetrievedChunk[], answer: string): number {
  if (chunks.length === 0) return 0.15;

  // Retrieval quality: average of top-3 reranked scores
  const topScores = chunks.slice(0, 3).map((c) => c.score);
  const avgScore = topScores.reduce((s, v) => s + v, 0) / topScores.length;

  // Coverage: how many chunks are referenced
  const coverageRatio = Math.min(chunks.length / 5, 1);

  // Verification: does the answer cite sources?
  const hasCitations =
    /\[[\w\s,.()\-]+\]/.test(answer) ||
    /Section\s+\d+/i.test(answer) ||
    /Article\s+\d+/i.test(answer);

  return Math.min(
    0.4 * Math.min(avgScore * 2, 1) + 0.4 * coverageRatio + 0.2 * (hasCitations ? 1 : 0),
    0.98
  );
}

export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onDone: (result: RAGResult) => void;
  onError: (error: Error) => void;
}

export async function runRAGPipeline(
  question: string,
  jurisdiction: Jurisdiction,
  config: RAGConfig,
  callbacks: StreamCallbacks
): Promise<void> {
  const start = Date.now();

  const qdrantClient = createQdrantClient(config.qdrantUrl, config.qdrantApiKey);

  // Step 1: Hybrid retrieval (top-30)
  let chunks: RetrievedChunk[] = [];
  try {
    chunks = await hybridRetrieve(
      qdrantClient,
      question,
      jurisdiction,
      config.voyageApiKey,  // undefined → uses Ollama local embeddings
      config.topK ?? 30
    );
  } catch (err) {
    // Retrieval failed — fall back to LLM-only (empty context)
    console.warn("[RAG] Retrieval failed:", err);
  }

  // Step 2: Rerank to top-N
  let rerankedChunks = chunks;
  if (chunks.length > (config.rerankTopN ?? 5) && config.cohereApiKey) {
    try {
      rerankedChunks = await rerank(
        question,
        chunks,
        config.cohereApiKey,
        config.rerankTopN ?? 5
      );
    } catch (err) {
      console.warn("[RAG] Rerank failed, using retrieval order:", err);
      rerankedChunks = chunks.slice(0, config.rerankTopN ?? 5);
    }
  } else {
    rerankedChunks = chunks.slice(0, config.rerankTopN ?? 5);
  }

  // Step 3: Build context
  const context = buildContext(rerankedChunks);

  // Step 4: Stream LLM response
  let fullAnswer = "";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lawlens.app",
        "X-Title": "LawLens",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-6",
        max_tokens: 1500,
        temperature: 0.1,
        stream: true,
        messages: [
          {
            role: "system",
            content:
              rerankedChunks.length > 0
                ? SYSTEM_PROMPT(jurisdiction, context)
                : fallbackSystemPrompt(jurisdiction),
          },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter [${response.status}]: ${await response.text()}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      const lines = decoder.decode(value).split("\n");
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") break;
        try {
          const parsed = JSON.parse(payload) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullAnswer += delta;
            callbacks.onChunk(delta);
          }
        } catch {
          // Malformed SSE line; skip
        }
      }
    }
  } catch (err) {
    callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    return;
  }

  // Step 5: Build citations from retrieved chunks (ground truth)
  const citations = chunksToContextCitations(rerankedChunks, jurisdiction);

  // Step 6: Score confidence
  const confidenceScore = scoreConfidence(rerankedChunks, fullAnswer);

  callbacks.onDone({
    answer: fullAnswer,
    citations,
    retrievedChunks: rerankedChunks,
    confidenceScore,
    jurisdiction,
    retrievedDocuments: rerankedChunks.length,
    processingTimeMs: Date.now() - start,
    hasUnsupportedClaims: confidenceScore < 0.45,
  });
}

function fallbackSystemPrompt(jurisdiction: string): string {
  return `You are LawLens, an AI legal research assistant specializing in ${jurisdiction} law.

Answer the legal question using your knowledge of ${jurisdiction} legislation.
Always cite the specific Act and Section for every legal claim.
Use citation format: [Act Name, Section X (Year)]
Never fabricate laws or cases. If uncertain, say so.
End with: "Always consult a qualified lawyer for advice specific to your situation."`;
}
