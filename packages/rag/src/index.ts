export type {
  Jurisdiction,
  LegalDocument,
  RetrievedChunk,
  Citation,
  RAGResult,
  RAGConfig,
  IngestionConfig,
} from "./types";

export { runRAGPipeline, type StreamCallbacks } from "./pipeline";

export {
  createQdrantClient,
  ensureCollection,
  upsertPoints,
  denseSearch,
  scrollAll,
  collectionExists,
  countDocuments,
  COLLECTION_NAME,
} from "./vectorstore";

export { embedQuery, embedDocuments, DIMENSIONS } from "./embeddings";
export { rerank } from "./reranker";
export { hybridRetrieve } from "./retriever";
export { BM25 } from "./bm25";

export {
  ingestAll,
  ingestJurisdiction,
  INDIA_DOCUMENTS,
  UK_DOCUMENTS,
  CANADA_DOCUMENTS,
  AUSTRALIA_DOCUMENTS,
  type IngestProgress,
} from "./ingestion/index";
