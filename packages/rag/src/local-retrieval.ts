import { BM25 } from "./bm25";
import { chunkDocument } from "./ingestion/chunker";
import { INDIA_DOCUMENTS } from "./ingestion/india";
import { UK_DOCUMENTS } from "./ingestion/uk";
import { CANADA_DOCUMENTS } from "./ingestion/canada";
import { AUSTRALIA_DOCUMENTS } from "./ingestion/australia";
import type { Jurisdiction, RetrievedChunk } from "./types";

const documents = {
  india: INDIA_DOCUMENTS,
  uk: UK_DOCUMENTS,
  canada: CANADA_DOCUMENTS,
  australia: AUSTRALIA_DOCUMENTS,
};

export function searchBundledCorpus(
  question: string,
  jurisdiction: Jurisdiction,
  limit: number
): RetrievedChunk[] {
  const chunks = documents[jurisdiction].flatMap(chunkDocument);
  const byId = new Map(chunks.map((chunk) => [chunk.id, chunk]));
  return new BM25(chunks).search(question, limit).map(({ id, score }) => {
    const chunk = byId.get(id)!;
    return { ...chunk, jurisdiction, score: score / (1 + score) };
  });
}
