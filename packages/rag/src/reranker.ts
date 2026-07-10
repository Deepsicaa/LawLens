import type { RetrievedChunk } from "./types";

const COHERE_RERANK_URL = "https://api.cohere.ai/v2/rerank";

interface CohereRerankResponse {
  results: Array<{ index: number; relevance_score: number }>;
}

export async function rerank(
  query: string,
  chunks: RetrievedChunk[],
  apiKey: string,
  topN = 5
): Promise<RetrievedChunk[]> {
  if (chunks.length === 0) return [];
  if (chunks.length <= topN) return chunks;

  const response = await fetch(COHERE_RERANK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "rerank-v3.5",
      query,
      documents: chunks.map((c) => c.text),
      top_n: Math.min(topN, chunks.length),
      return_documents: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cohere rerank [${response.status}]: ${await response.text()}`);
  }

  const data = (await response.json()) as CohereRerankResponse;

  return data.results.map((r) => ({
    ...chunks[r.index]!,
    score: r.relevance_score,
  }));
}
