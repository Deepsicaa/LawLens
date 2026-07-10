import type { QdrantClient } from "@qdrant/js-client-rest";
import type { Jurisdiction, RetrievedChunk } from "./types";
import { embedQuery } from "./embeddings";
import { denseSearch, scrollAll } from "./vectorstore";
import { BM25 } from "./bm25";

const RRF_K = 60;

export async function hybridRetrieve(
  client: QdrantClient,
  query: string,
  jurisdiction: Jurisdiction,
  voyageApiKey: string | undefined,
  topK = 30
): Promise<RetrievedChunk[]> {
  // Parallelize embedding + corpus fetch
  const [queryVector, corpus] = await Promise.all([
    embedQuery(query, voyageApiKey),
    scrollAll(client, jurisdiction),
  ]);

  if (corpus.length === 0) return [];

  // Dense retrieval from Qdrant
  const denseChunks = await denseSearch(client, queryVector, jurisdiction, topK);

  // Sparse BM25 over full corpus
  const bm25 = new BM25(corpus);
  const sparseHits = bm25.search(query, topK);

  // Build lookup from dense results
  const chunkMap = new Map<string, RetrievedChunk>();
  for (const chunk of denseChunks) chunkMap.set(chunk.id, chunk);

  // RRF fusion
  const rrfScores = new Map<string, number>();
  denseChunks.forEach(({ id }, rank) => {
    rrfScores.set(id, (rrfScores.get(id) ?? 0) + 1 / (RRF_K + rank + 1));
  });
  sparseHits.forEach(({ id }, rank) => {
    rrfScores.set(id, (rrfScores.get(id) ?? 0) + 1 / (RRF_K + rank + 1));
  });

  // Sort and resolve metadata
  return Array.from(rrfScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topK)
    .flatMap(([id, rrfScore]) => {
      const chunk = chunkMap.get(id);
      if (!chunk) return [];
      return [{ ...chunk, score: rrfScore }];
    });
}
