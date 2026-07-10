import type { IngestionConfig } from "../types";
import { createQdrantClient, ensureCollection, upsertPoints } from "../vectorstore";
import { embedDocuments } from "../embeddings";
import { chunkDocument, type Chunk } from "./chunker";
import { INDIA_DOCUMENTS } from "./india";
import { UK_DOCUMENTS } from "./uk";
import { CANADA_DOCUMENTS } from "./canada";
import { AUSTRALIA_DOCUMENTS } from "./australia";

export { INDIA_DOCUMENTS, UK_DOCUMENTS, CANADA_DOCUMENTS, AUSTRALIA_DOCUMENTS };

export type IngestProgress = {
  jurisdiction: string;
  total: number;
  embedded: number;
  upserted: number;
};

export async function ingestAll(
  config: IngestionConfig,
  onProgress?: (p: IngestProgress) => void
): Promise<void> {
  const client = createQdrantClient(config.qdrantUrl, config.qdrantApiKey);
  await ensureCollection(client);

  const allDocs = [
    ...INDIA_DOCUMENTS,
    ...UK_DOCUMENTS,
    ...CANADA_DOCUMENTS,
    ...AUSTRALIA_DOCUMENTS,
  ];

  // Chunk all documents
  const allChunks: Chunk[] = allDocs.flatMap((doc) => chunkDocument(doc));

  // Group by jurisdiction for progress tracking
  const byJurisdiction = new Map<string, Chunk[]>();
  for (const chunk of allChunks) {
    const list = byJurisdiction.get(chunk.jurisdiction) ?? [];
    list.push(chunk);
    byJurisdiction.set(chunk.jurisdiction, list);
  }

  for (const [jurisdiction, chunks] of byJurisdiction) {
    const texts = chunks.map((c) => c.text);
    onProgress?.({ jurisdiction, total: chunks.length, embedded: 0, upserted: 0 });

    const embeddings = await embedDocuments(texts, config.voyageApiKey);
    onProgress?.({ jurisdiction, total: chunks.length, embedded: chunks.length, upserted: 0 });

    const points = chunks.map((chunk, i) => ({
      id: deterministicId(chunk.id),
      vector: embeddings[i]!,
      payload: {
        text: chunk.text,
        source: chunk.source,
        act: chunk.act,
        section: chunk.section,
        title: chunk.title,
        jurisdiction: chunk.jurisdiction,
        url: chunk.url,
        year: chunk.year,
        topics: chunk.topics,
        chunkIndex: chunk.chunkIndex,
        totalChunks: chunk.totalChunks,
      },
    }));

    await upsertPoints(client, points);
    onProgress?.({ jurisdiction, total: chunks.length, embedded: chunks.length, upserted: chunks.length });
  }
}

export async function ingestJurisdiction(
  jurisdiction: "india" | "uk" | "canada" | "australia",
  config: IngestionConfig,
  onProgress?: (p: IngestProgress) => void
): Promise<void> {
  const docMap = {
    india: INDIA_DOCUMENTS,
    uk: UK_DOCUMENTS,
    canada: CANADA_DOCUMENTS,
    australia: AUSTRALIA_DOCUMENTS,
  };

  const docs = docMap[jurisdiction];
  const client = createQdrantClient(config.qdrantUrl, config.qdrantApiKey);
  await ensureCollection(client);

  const chunks: Chunk[] = docs.flatMap((doc) => chunkDocument(doc));
  onProgress?.({ jurisdiction, total: chunks.length, embedded: 0, upserted: 0 });

  const texts = chunks.map((c) => c.text);
  const embeddings = await embedDocuments(texts, config.voyageApiKey);
  onProgress?.({ jurisdiction, total: chunks.length, embedded: chunks.length, upserted: 0 });

  const points = chunks.map((chunk, i) => ({
    id: deterministicId(chunk.id),
    vector: embeddings[i]!,
    payload: {
      text: chunk.text,
      source: chunk.source,
      act: chunk.act,
      section: chunk.section,
      title: chunk.title,
      jurisdiction: chunk.jurisdiction,
      url: chunk.url,
      year: chunk.year,
      topics: chunk.topics,
    },
  }));

  await upsertPoints(client, points);
  onProgress?.({ jurisdiction, total: chunks.length, embedded: chunks.length, upserted: chunks.length });
}

// Convert a string ID to a valid Qdrant unsigned integer ID
function deterministicId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Ensure positive and within safe integer range
  return Math.abs(hash) + 1;
}
