import { QdrantClient } from "@qdrant/js-client-rest";
import type { Jurisdiction, RetrievedChunk } from "./types";
import { DIMENSIONS } from "./embeddings";

export const COLLECTION_NAME = "legal_documents";

export function createQdrantClient(url: string, apiKey?: string): QdrantClient {
  return new QdrantClient({ url, ...(apiKey ? { apiKey } : {}) });
}

export async function ensureCollection(client: QdrantClient): Promise<void> {
  const collections = await client.getCollections();
  const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

  if (!exists) {
    await client.createCollection(COLLECTION_NAME, {
      vectors: { size: DIMENSIONS, distance: "Cosine" },
      optimizers_config: { default_segment_number: 2 },
      replication_factor: 1,
    });

    await client.createPayloadIndex(COLLECTION_NAME, {
      field_name: "jurisdiction",
      field_schema: "keyword",
    });

    await client.createPayloadIndex(COLLECTION_NAME, {
      field_name: "act",
      field_schema: "keyword",
    });
  }
}

export async function upsertPoints(
  client: QdrantClient,
  points: Array<{
    id: string | number;
    vector: number[];
    payload: Record<string, unknown>;
  }>
): Promise<void> {
  const BATCH = 100;
  for (let i = 0; i < points.length; i += BATCH) {
    const batch = points.slice(i, i + BATCH);
    await client.upsert(COLLECTION_NAME, {
      wait: true,
      points: batch,
    });
  }
}

export async function denseSearch(
  client: QdrantClient,
  vector: number[],
  jurisdiction: Jurisdiction,
  topK = 30
): Promise<RetrievedChunk[]> {
  const results = await client.search(COLLECTION_NAME, {
    vector,
    limit: topK,
    with_payload: true,
    filter: {
      must: [{ key: "jurisdiction", match: { value: jurisdiction } }],
    },
    score_threshold: 0.35,
  });

  return results.map((r) => ({
    id: String(r.id),
    text: String(r.payload?.["text"] ?? ""),
    source: String(r.payload?.["source"] ?? ""),
    section: String(r.payload?.["section"] ?? ""),
    title: String(r.payload?.["title"] ?? ""),
    jurisdiction: (r.payload?.["jurisdiction"] ?? jurisdiction) as Jurisdiction,
    url: String(r.payload?.["url"] ?? ""),
    score: r.score,
  }));
}

export async function scrollAll(
  client: QdrantClient,
  jurisdiction: Jurisdiction
): Promise<Array<{ id: string; text: string }>> {
  const results: Array<{ id: string; text: string }> = [];
  let offset: string | number | undefined = undefined;

  for (;;) {
    const response = await client.scroll(COLLECTION_NAME, {
      limit: 250,
      with_payload: ["text"],
      filter: {
        must: [{ key: "jurisdiction", match: { value: jurisdiction } }],
      },
      ...(offset !== undefined ? { offset } : {}),
    });

    for (const point of response.points) {
      results.push({
        id: String(point.id),
        text: String(point.payload?.["text"] ?? ""),
      });
    }

    if (!response.next_page_offset) break;
    offset = response.next_page_offset as string | number;
  }

  return results;
}

export async function collectionExists(client: QdrantClient): Promise<boolean> {
  try {
    const collections = await client.getCollections();
    return collections.collections.some((c) => c.name === COLLECTION_NAME);
  } catch {
    return false;
  }
}

export async function countDocuments(
  client: QdrantClient,
  jurisdiction?: Jurisdiction
): Promise<number> {
  const result = await client.count(
    COLLECTION_NAME,
    jurisdiction
      ? { filter: { must: [{ key: "jurisdiction", match: { value: jurisdiction } }] }, exact: true }
      : { exact: true }
  );
  return result.count;
}
