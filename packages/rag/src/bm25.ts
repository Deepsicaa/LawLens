const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "with", "by", "from", "as", "is", "was", "are", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "not", "no", "that", "this",
  "these", "those", "it", "its", "he", "she", "they", "their", "we", "you",
  "any", "all", "each", "every", "both", "if", "when", "where", "which",
  "who", "whom", "such", "than", "then", "so", "also", "about", "into",
]);

export class BM25 {
  private readonly k1 = 1.5;
  private readonly b = 0.75;
  private readonly corpus: string[][];
  private readonly docIds: string[];
  private readonly idf: Map<string, number>;
  private readonly avgdl: number;

  constructor(documents: Array<{ id: string; text: string }>) {
    this.docIds = documents.map((d) => d.id);
    this.corpus = documents.map((d) => this.tokenize(d.text));
    this.avgdl =
      this.corpus.reduce((sum, doc) => sum + doc.length, 0) /
      Math.max(1, this.corpus.length);
    this.idf = this.computeIDF();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  }

  private computeIDF(): Map<string, number> {
    const df = new Map<string, number>();
    const N = this.corpus.length;

    for (const doc of this.corpus) {
      for (const term of new Set(doc)) {
        df.set(term, (df.get(term) ?? 0) + 1);
      }
    }

    const idf = new Map<string, number>();
    for (const [term, n] of df) {
      idf.set(term, Math.log((N - n + 0.5) / (n + 0.5) + 1));
    }
    return idf;
  }

  search(query: string, topK: number): Array<{ id: string; score: number }> {
    if (this.corpus.length === 0) return [];

    const queryTerms = this.tokenize(query);
    if (queryTerms.length === 0) return [];

    const scores = this.corpus.map((doc, i) => {
      const dl = doc.length;
      const tf = new Map<string, number>();
      for (const term of doc) tf.set(term, (tf.get(term) ?? 0) + 1);

      let score = 0;
      for (const term of queryTerms) {
        const termIdf = this.idf.get(term) ?? 0;
        const termFreq = tf.get(term) ?? 0;
        if (termFreq === 0) continue;
        const norm = termFreq + this.k1 * (1 - this.b + (this.b * dl) / this.avgdl);
        score += termIdf * (termFreq * (this.k1 + 1)) / norm;
      }

      return { id: this.docIds[i]!, score };
    });

    return scores
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}
