import type { LegalQuery, ComparisonQuery, LegalResponse, Conversation, Message, Citation, ApiResponse } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// CompareQueryResponse and ConversationDetail are backend-specific shapes not yet in the shared types package
export interface JurisdictionResult {
  jurisdiction: string;
  answer: string;
  citations: Citation[];
  confidenceScore: number;
}

export interface CompareQueryResponse {
  results: JurisdictionResult[];
  processingTimeMs: number;
}

export interface ConversationDetail extends Omit<Conversation, "messages"> {
  messages: (Message & { citations?: Citation[] })[];
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const clerk = (window as unknown as Record<string, unknown>)["Clerk"] as
    | { session?: { getToken: () => Promise<string | null> } }
    | undefined;
  return (await clerk?.session?.getToken()) ?? null;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

async function request<T>(
  path: string,
  { method = "GET", body, token }: RequestOptions = {}
): Promise<T> {
  const authToken = token ?? (await getAuthToken());
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;
    try {
      const errorData = (await res.json()) as { detail?: string; error?: string };
      errorMessage = errorData.detail ?? errorData.error ?? errorMessage;
    } catch {
      // leave default
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<T>;
}

// ─── Legal ───────────────────────────────────────────────────────────────────

export async function queryLegal(payload: LegalQuery, token?: string): Promise<Response> {
  const authToken = token ?? (await getAuthToken());
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return fetch(`${API_BASE}/api/v1/legal/query`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

export async function compareLegal(payload: ComparisonQuery): Promise<CompareQueryResponse> {
  return request<CompareQueryResponse>("/api/v1/legal/compare", {
    method: "POST",
    body: payload,
  });
}

// ─── Conversations ────────────────────────────────────────────────────────────

export async function listConversations(): Promise<Conversation[]> {
  return request<Conversation[]>("/api/v1/conversations");
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  return request<ConversationDetail>(`/api/v1/conversations/${id}`);
}

export async function deleteConversation(id: string): Promise<void> {
  return request<void>(`/api/v1/conversations/${id}`, { method: "DELETE" });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminStats(token: string): Promise<ApiResponse<unknown>> {
  return request<ApiResponse<unknown>>("/api/v1/admin/stats", { token });
}

// Re-export for convenience
export type { LegalQuery, LegalResponse, ComparisonQuery, Conversation };
