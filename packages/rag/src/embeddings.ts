// Embedding backend: Ollama (local, free) preferred; falls back to Voyage AI if key is set.

const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const VOYAGE_MODEL = "voyage-law-2";

const OLLAMA_URL = process.env["OLLAMA_URL"] ?? "http://localhost:11434";
const OLLAMA_MODEL = process.env["OLLAMA_EMBED_MODEL"] ?? "nomic-embed-text";

// voyage-law-2 = 1024 dims, nomic-embed-text = 768 dims
export const DIMENSIONS = process.env["VOYAGE_API_KEY"] ? 1024 : 768;

interface VoyageResponse {
  data: Array<{ embedding: number[]; index: number }>;
}

interface OllamaEmbedResponse {
  embeddings: number[][];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function embedQuery(text: string, apiKey?: string): Promise<number[]> {
  if (apiKey) return voyageEmbed([text], apiKey, "query").then((e) => e[0]!);
  return ollamaEmbed([text]).then((e) => e[0]!);
}

export async function embedDocuments(texts: string[], apiKey?: string): Promise<number[][]> {
  if (apiKey) return voyageEmbed(texts, apiKey, "document");
  return ollamaEmbed(texts);
}

// ─── Voyage AI ───────────────────────────────────────────────────────────────

const VOYAGE_BATCH = 3; // free tier: 3 RPM / 10K TPM — small batches to stay within TPM

async function voyageEmbed(
  texts: string[],
  apiKey: string,
  inputType: "query" | "document"
): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += VOYAGE_BATCH) {
    const batch = texts.slice(i, i + VOYAGE_BATCH);
    const response = await fetch(VOYAGE_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ input: batch, model: VOYAGE_MODEL, input_type: inputType }),
    });

    if (!response.ok) {
      throw new Error(`Voyage AI [${response.status}]: ${await response.text()}`);
    }

    const data = (await response.json()) as VoyageResponse;
    const sorted = [...data.data].sort((a, b) => a.index - b.index);
    embeddings.push(...sorted.map((d) => d.embedding));

    if (i + VOYAGE_BATCH < texts.length) {
      // Free tier = 3 RPM → wait 22s between requests to avoid 429
      await new Promise((r) => setTimeout(r, 22_000));
    }
  }

  return embeddings;
}

// ─── Ollama ───────────────────────────────────────────────────────────────────

const OLLAMA_BATCH = 16; // Ollama can handle larger batches locally

async function ollamaEmbed(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += OLLAMA_BATCH) {
    const batch = texts.slice(i, i + OLLAMA_BATCH);
    const response = await fetch(`${OLLAMA_URL}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: OLLAMA_MODEL, input: batch }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embed [${response.status}]: ${await response.text()}`);
    }

    const data = (await response.json()) as OllamaEmbedResponse;
    embeddings.push(...data.embeddings);
  }

  return embeddings;
}
