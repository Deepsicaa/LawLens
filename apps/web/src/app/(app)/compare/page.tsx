"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, Loader2, Send, ExternalLink } from "lucide-react";
import { JURISDICTIONS } from "types";
import type { Jurisdiction } from "types";

const ALL_JURISDICTIONS = Object.keys(JURISDICTIONS) as Jurisdiction[];

const JURISDICTION_COLORS: Record<string, string> = {
  india: "#f97316",
  uk: "#3b82f6",
  canada: "#ef4444",
  australia: "#10b981",
};

interface CompareResult {
  jurisdiction: string;
  answer: string;
  citations: Array<{
    id: string;
    source: string;
    section: string;
    text: string;
    url?: string;
    jurisdiction: string;
    relevanceScore: number;
  }>;
  confidenceScore: number;
  retrievedDocuments: number;
}

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function ComparePage() {
  const [question, setQuestion] = useState("");
  const [selected, setSelected] = useState<Jurisdiction[]>(["india", "uk"]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CompareResult[] | null>(null);
  const [lastQuestion, setLastQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleJurisdiction = (j: Jurisdiction) => {
    setSelected((prev) =>
      prev.includes(j)
        ? prev.length > 2 ? prev.filter((x) => x !== j) : prev
        : [...prev, j]
    );
  };

  const handleCompare = async () => {
    if (!question.trim() || selected.length < 2 || isLoading) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    setLastQuestion(question.trim());

    try {
      const res = await fetch(`/api/v1/legal/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), jurisdictions: selected }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Comparison failed");
      }

      const data = (await res.json()) as { results: CompareResult[] };
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2.5rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#f0ede8", letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>
          Compare Jurisdictions
        </h1>
        <p style={{ fontSize: "0.82rem", color: "rgba(240,237,232,0.32)", lineHeight: 1.6 }}>
          Ask one question. See how four different countries answer it under their official legislation.
        </p>
      </div>

      {/* Query card */}
      <div style={{
        borderRadius: "1.25rem", border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)", padding: "1.75rem",
        marginBottom: "2rem",
      }}>
        {/* Jurisdiction pills */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p style={{
            fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(240,237,232,0.25)",
            marginBottom: "0.85rem",
          }}>
            Select jurisdictions (min 2)
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {ALL_JURISDICTIONS.map((j) => {
              const meta = JURISDICTIONS[j];
              const active = selected.includes(j);
              const col = JURISDICTION_COLORS[j] ?? "#d4af7a";
              return (
                <button
                  key={j}
                  onClick={() => toggleJurisdiction(j)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.5rem 1rem", borderRadius: "0.65rem", cursor: "pointer",
                    border: `1px solid ${active ? col + "40" : "rgba(255,255,255,0.07)"}`,
                    background: active ? `${col}12` : "transparent",
                    color: active ? col : "rgba(240,237,232,0.38)",
                    fontSize: "0.82rem", fontWeight: active ? 600 : 400,
                    transition: "all 0.18s",
                  }}
                >
                  <span>{meta?.flag}</span>
                  <span>{meta?.name}</span>
                  {selected.length <= 2 && active && (
                    <span style={{ fontSize: "0.6rem", color: col, opacity: 0.6 }}>min</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question input */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleCompare(); }
            }}
            placeholder="Ask a legal question to compare across jurisdictions…"
            rows={2}
            style={{
              flex: 1, resize: "none", padding: "0.85rem 1rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              fontSize: "0.875rem", color: "rgba(240,237,232,0.85)",
              outline: "none", transition: "border-color 0.2s",
              fontFamily: "var(--font-geist, sans-serif)",
            }}
            disabled={isLoading}
            onFocus={(e) => { e.target.style.borderColor = "rgba(212,175,122,0.3)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
          />
          <button
            onClick={() => void handleCompare()}
            disabled={!question.trim() || selected.length < 2 || isLoading}
            style={{
              flexShrink: 0, height: 44, width: 44, borderRadius: "0.75rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none",
              background: question.trim() && selected.length >= 2 && !isLoading
                ? "#d4af7a"
                : "rgba(255,255,255,0.05)",
              color: question.trim() && selected.length >= 2 && !isLoading
                ? "#060608"
                : "rgba(240,237,232,0.2)",
              cursor: question.trim() && selected.length >= 2 && !isLoading ? "pointer" : "default",
              transition: "all 0.18s",
              boxShadow: question.trim() && selected.length >= 2 && !isLoading
                ? "0 0 18px rgba(212,175,122,0.35)" : "none",
            }}
          >
            {isLoading ? <Loader2 size={17} style={{ animation: "spin 1s linear infinite" }} /> : <GitCompare size={17} />}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "4rem 2rem", gap: "1.25rem",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            {selected.map((j, i) => {
              const col = JURISDICTION_COLORS[j] ?? "#d4af7a";
              return (
                <motion.div
                  key={j}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: col }}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -6, 0] }}
                  transition={{ duration: 1.0, delay: i * 0.2, repeat: Infinity }}
                />
              );
            })}
          </div>
          <p style={{ fontSize: "0.85rem", color: "rgba(240,237,232,0.32)" }}>
            Querying official legislation across {selected.length} jurisdictions…
          </p>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: "0.875rem 1.1rem", borderRadius: "0.75rem",
            border: "1px solid rgba(239,68,68,0.2)",
            background: "rgba(239,68,68,0.06)",
            fontSize: "0.82rem", color: "#fca5a5",
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: E }}
          >
            {/* Question summary */}
            <div style={{
              padding: "1rem 1.25rem", borderRadius: "0.875rem",
              border: "1px solid rgba(212,175,122,0.12)",
              background: "rgba(212,175,122,0.04)",
              marginBottom: "1.5rem",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <span style={{ fontSize: "0.65rem", color: "#d4af7a", letterSpacing: "0.15em", textTransform: "uppercase", flexShrink: 0 }}>
                Comparing
              </span>
              <span style={{ fontSize: "0.875rem", color: "rgba(240,237,232,0.7)", flex: 1 }}>{lastQuestion}</span>
            </div>

            {/* Grid of results */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "1rem" }}>
              {results.map((result, i) => {
                const meta = JURISDICTIONS[result.jurisdiction as Jurisdiction];
                const col = JURISDICTION_COLORS[result.jurisdiction] ?? "#d4af7a";
                const pct = Math.round(result.confidenceScore * 100);

                return (
                  <motion.div
                    key={result.jurisdiction}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: E }}
                    style={{
                      borderRadius: "1.1rem", overflow: "hidden",
                      border: `1px solid ${col}18`,
                      background: `linear-gradient(135deg, ${col}06 0%, rgba(8,9,12,0.9) 60%)`,
                    }}
                  >
                    {/* Top accent */}
                    <div style={{ height: 2, background: col, opacity: 0.6 }} />

                    {/* Header */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <span style={{ fontSize: "1.3rem" }}>{meta?.flag}</span>
                        <div>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f0ede8" }}>{meta?.name}</h3>
                          <p style={{ fontSize: "0.65rem", color: "rgba(240,237,232,0.28)" }}>
                            {result.citations.length} source{result.citations.length !== 1 ? "s" : ""} cited
                          </p>
                        </div>
                      </div>
                      {/* Confidence */}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: col, lineHeight: 1 }}>{pct}%</div>
                        <div style={{ fontSize: "0.6rem", color: "rgba(240,237,232,0.28)", marginTop: 1 }}>confidence</div>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div style={{ padding: "0.5rem 1.25rem 0" }}>
                      <div style={{ height: 2, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                          style={{ height: "100%", background: col, borderRadius: 2 }}
                        />
                      </div>
                    </div>

                    {/* Answer */}
                    <div style={{ padding: "1rem 1.25rem", fontSize: "0.84rem", lineHeight: 1.8, color: "rgba(240,237,232,0.62)" }}>
                      {result.answer}
                    </div>

                    {/* Citations */}
                    {result.citations.length > 0 && (
                      <div style={{
                        padding: "0.75rem 1.25rem 1.1rem",
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                        display: "flex", flexDirection: "column", gap: "0.4rem",
                      }}>
                        <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,232,0.2)", marginBottom: "0.3rem" }}>
                          Sources
                        </p>
                        {result.citations.slice(0, 3).map((c) => (
                          <div key={c.id} style={{
                            display: "flex", alignItems: "center", gap: "0.6rem",
                            padding: "0.4rem 0.65rem", borderRadius: "0.5rem",
                            background: `${col}08`, border: `1px solid ${col}18`,
                          }}>
                            <span style={{ fontSize: "0.68rem", color: col, fontWeight: 600, flexShrink: 0 }}>
                              {c.section}
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "rgba(240,237,232,0.35)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {c.source}
                            </span>
                            {c.url && (
                              <a href={c.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                <ExternalLink size={10} style={{ color: col, opacity: 0.6 }} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea::placeholder { color: rgba(240,237,232,0.2); }
      `}</style>
    </div>
  );
}
