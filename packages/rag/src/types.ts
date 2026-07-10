export type Jurisdiction = "india" | "uk" | "canada" | "australia";

export interface LegalDocument {
  id: string;
  text: string;
  source: string;
  act: string;
  section: string;
  title: string;
  jurisdiction: Jurisdiction;
  url: string;
  year: number;
  topics: string[];
}

export interface RetrievedChunk {
  id: string;
  text: string;
  source: string;
  section: string;
  title: string;
  jurisdiction: Jurisdiction;
  url: string;
  score: number;
}

export interface Citation {
  id: string;
  source: string;
  section: string;
  text: string;
  url: string;
  jurisdiction: Jurisdiction;
  relevanceScore: number;
}

export interface RAGResult {
  answer: string;
  citations: Citation[];
  retrievedChunks: RetrievedChunk[];
  confidenceScore: number;
  jurisdiction: Jurisdiction;
  retrievedDocuments: number;
  processingTimeMs: number;
  hasUnsupportedClaims: boolean;
}

export interface RAGConfig {
  voyageApiKey?: string;
  qdrantUrl: string;
  qdrantApiKey?: string;
  cohereApiKey?: string;
  openRouterApiKey: string;
  collectionName?: string;
  topK?: number;
  rerankTopN?: number;
}

export interface IngestionConfig {
  voyageApiKey?: string;
  qdrantUrl: string;
  qdrantApiKey?: string;
}
