import type { LegalDocument } from "../types";

export interface Chunk {
  id: string;
  text: string;
  source: string;
  act: string;
  section: string;
  title: string;
  jurisdiction: string;
  url: string;
  year: number;
  topics: string[];
  chunkIndex: number;
  totalChunks: number;
}

const MAX_CHUNK_CHARS = 1500;
const OVERLAP_CHARS = 200;

export function chunkDocument(doc: LegalDocument): Chunk[] {
  const text = doc.text.trim();

  if (text.length <= MAX_CHUNK_CHARS) {
    return [makeChunk(doc, text, 0, 1)];
  }

  // Split at sentence boundaries
  const sentences = splitSentences(text);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHUNK_CHARS && current.length > 0) {
      chunks.push(current.trim());
      // Overlap: keep last OVERLAP_CHARS of previous chunk
      current = current.slice(-OVERLAP_CHARS) + sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim().length > 0) chunks.push(current.trim());

  return chunks.map((text, i) => makeChunk(doc, text, i, chunks.length));
}

function makeChunk(doc: LegalDocument, text: string, idx: number, total: number): Chunk {
  return {
    id: total === 1 ? doc.id : `${doc.id}-chunk${idx}`,
    text: addMetadataHeader(doc, text),
    source: doc.source,
    act: doc.act,
    section: doc.section,
    title: doc.title,
    jurisdiction: doc.jurisdiction,
    url: doc.url,
    year: doc.year,
    topics: doc.topics,
    chunkIndex: idx,
    totalChunks: total,
  };
}

function addMetadataHeader(doc: LegalDocument, text: string): string {
  const header = `[${doc.source} — ${doc.section} — ${doc.title}]\n`;
  // Don't double-add if text already starts with the statute name
  if (text.startsWith(doc.source) || text.startsWith(doc.act)) return text;
  return header + text;
}

function splitSentences(text: string): string[] {
  // Split at newlines first, then at sentence endings
  const lines = text.split(/\n/);
  const sentences: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      sentences.push("\n\n");
      continue;
    }
    // Split on ". " or "; " or "(x)" section markers
    const parts = trimmed.split(/(?<=\.|\;)\s+(?=[A-Z(])/);
    for (const part of parts) {
      sentences.push(part + " ");
    }
    sentences.push("\n");
  }

  return sentences;
}
