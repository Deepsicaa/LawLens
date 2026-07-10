// ─── Jurisdictions ────────────────────────────────────────────────────────────

export type Jurisdiction = "india" | "uk" | "canada" | "australia";

export interface JurisdictionMeta {
  name: string;
  flag: string;
  /** Qdrant collection name for this jurisdiction */
  collection: string;
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
}

export const JURISDICTIONS: Record<Jurisdiction, JurisdictionMeta> = {
  india: { name: "India", flag: "🇮🇳", collection: "india_legislation", countryCode: "IN" },
  uk: { name: "United Kingdom", flag: "🇬🇧", collection: "uk_legislation", countryCode: "GB" },
  canada: { name: "Canada", flag: "🇨🇦", collection: "canada_legislation", countryCode: "CA" },
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    collection: "australia_legislation",
    countryCode: "AU",
  },
};

// ─── Legal Query & Response ───────────────────────────────────────────────────

export interface LegalQuery {
  question: string;
  jurisdiction: Jurisdiction;
  conversationId?: string;
}

export interface ComparisonQuery {
  question: string;
  jurisdictions: [Jurisdiction, Jurisdiction, ...Jurisdiction[]]; // min 2
}

export interface Citation {
  id: string;
  source: string;        // e.g. "Indian Penal Code"
  section: string;       // e.g. "Section 302"
  text: string;          // Exact text from the legislation
  url?: string;          // Link to official source
  jurisdiction: Jurisdiction;
  relevanceScore: number; // 0.0 – 1.0
}

export interface LegalResponse {
  answer: string;
  citations: Citation[];
  confidenceScore: number;   // 0.0 – 1.0
  jurisdiction: Jurisdiction;
  retrievedDocuments: number;
  processingTimeMs: number;
  hasUnsupportedClaims: boolean;
}

// ─── Conversation & Messages ──────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  confidenceScore?: number;
  createdAt: string; // ISO 8601
}

export interface Conversation {
  id: string;
  title: string;
  jurisdiction: Jurisdiction;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: true;
}

export interface ApiError {
  error: string;
  code: string;
  success: false;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: string;
}

// ─── Confidence Display ───────────────────────────────────────────────────────

export type ConfidenceLevel = "high" | "medium" | "low" | "insufficient";

export function getConfidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.6) return "medium";
  if (score >= 0.4) return "low";
  return "insufficient";
}
