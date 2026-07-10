"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText } from "lucide-react";
import { useChatStore } from "@/stores/chat.store";
import { getConfidenceLevel } from "types";

function ConfidenceGauge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const level = getConfidenceLevel(score);
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const color =
    level === "high" ? "#10b981"
    : level === "medium" ? "#d4af7a"
    : level === "low" ? "#f97316"
    : "#ef4444";
  const label =
    level === "high" ? "High Confidence"
    : level === "medium" ? "Medium Confidence"
    : level === "low" ? "Low Confidence"
    : "Insufficient";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.25rem 1rem" }}>
      <div style={{ position: "relative", width: 88, height: 88, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
        <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <motion.circle
            cx="44" cy="44" r={radius} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f0ede8", lineHeight: 1 }}>{pct}%</div>
        </div>
      </div>
      <p style={{ fontSize: "0.75rem", fontWeight: 600, color, marginBottom: "0.2rem" }}>{label}</p>
      <p style={{ fontSize: "0.65rem", color: "rgba(240,237,232,0.25)" }}>from official sources</p>
    </div>
  );
}

export function LegalInsightPanel() {
  const { lastAnswer, isStreaming } = useChatStore();

  const panelStyle = {
    borderRadius: "0.875rem",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(12,12,18,0.8)",
    overflow: "hidden" as const,
  };

  const headerStyle = {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em",
    textTransform: "uppercase" as const, color: "#d4af7a",
  };

  return (
    <div style={{ padding: "1rem 0.875rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {/* Confidence */}
      <div style={panelStyle}>
        <div style={headerStyle}>Confidence Score</div>
        <AnimatePresence mode="wait">
          {isStreaming ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem", gap: "0.75rem" }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: "2px solid rgba(212,175,122,0.15)",
                borderTopColor: "#d4af7a",
                animation: "spin 1s linear infinite",
              }} />
              <p style={{ fontSize: "0.7rem", color: "rgba(240,237,232,0.25)" }}>Analyzing…</p>
            </motion.div>
          ) : lastAnswer ? (
            <motion.div key="score" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ConfidenceGauge score={lastAnswer.confidenceScore} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "1.75rem 1rem" }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", color: "rgba(240,237,232,0.1)",
                marginBottom: "0.75rem",
              }}>—</div>
              <p style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.22)", textAlign: "center", lineHeight: 1.6 }}>
                Ask a question to see the confidence score
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Citations */}
      <div style={{ ...panelStyle, flex: 1 }}>
        <div style={headerStyle}>Top Citations</div>
        <div style={{ padding: "0.75rem" }}>
          <AnimatePresence>
            {lastAnswer?.citations && lastAnswer.citations.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {lastAnswer.citations.slice(0, 5).map((cit, i) => (
                  <motion.div
                    key={cit.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      padding: "0.6rem 0.75rem", borderRadius: "0.6rem",
                      border: "1px solid rgba(255,255,255,0.05)",
                      background: "rgba(255,255,255,0.02)",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", marginBottom: cit.url ? "0.4rem" : 0 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "0.35rem", flexShrink: 0,
                        background: "rgba(212,175,122,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <FileText size={10} style={{ color: "#d4af7a" }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(240,237,232,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {cit.section || "Section"}
                        </p>
                        <p style={{ fontSize: "0.65rem", color: "rgba(240,237,232,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {cit.source}
                        </p>
                      </div>
                    </div>
                    {cit.url && (
                      <a href={cit.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.65rem", color: "rgba(212,175,122,0.5)", textDecoration: "none" }}
                      >
                        View Source <ExternalLink size={9} />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.22)", textAlign: "center", padding: "1.5rem 0.5rem", lineHeight: 1.6 }}>
                Citations will appear after your first question
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
