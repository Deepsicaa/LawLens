"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Jurisdiction Detection",
    body: "Your question is routed to the correct legal system — India, UK, Canada, or Australia — before any retrieval begins.",
    color: "#3b82f6",
    icon: "⟁",
  },
  {
    n: "02",
    title: "Hybrid Retrieval",
    body: "Dense vector search + BM25 keyword search scan official legislation simultaneously. RRF fusion combines results.",
    color: "#7c3aed",
    icon: "◈",
  },
  {
    n: "03",
    title: "Neural Reranking",
    body: "Cohere rerank-v3.5 cross-encoder evaluates the top 30 passages and surfaces only the 5 most relevant statutes.",
    color: "#d4af7a",
    icon: "◉",
  },
  {
    n: "04",
    title: "Evidence-Grounded Generation",
    body: "Claude reads the retrieved statutes and constructs an answer. If evidence is insufficient — it says so.",
    color: "#10b981",
    icon: "◎",
  },
  {
    n: "05",
    title: "Citation Generation",
    body: "Every factual claim is traced to its source statute. Exact section, act, and jurisdiction — always visible.",
    color: "#d4af7a",
    icon: "§",
  },
];

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function ScenePipeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      id="pipeline"
      className="scene"
      style={{ padding: "8rem 5rem", position: "relative", overflow: "hidden" }}
    >
      {/* Background architectural text */}
      <div style={{
        position: "absolute", top: "50%", right: "-2%", transform: "translateY(-50%)",
        fontSize: "18vw", fontWeight: 900, color: "rgba(255,255,255,0.015)",
        lineHeight: 1, pointerEvents: "none", userSelect: "none", fontFamily: "var(--font-serif)",
        letterSpacing: "-0.05em",
      }}>
        RAG
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: E }}
          style={{ marginBottom: "6rem", maxWidth: 600 }}
        >
          <span className="eyebrow" style={{ display: "block", marginBottom: "1.2rem" }}>How LawLens Thinks</span>
          <h2 style={{
            fontSize: "clamp(2.2rem, 4vw, 5rem)", fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.025em", color: "#f0ede8", marginBottom: "1.2rem"
          }}>
            Retrieve first.<br />
            <em className="font-serif" style={{ color: "#d4af7a", fontStyle: "italic", fontWeight: 400 }}>
              Generate second.
            </em>
          </h2>
          <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "rgba(240,237,232,0.38)" }}>
            Unlike LLMs that generate from memory, every LawLens answer is built on retrieved official legislation.
            The pipeline is deterministic, auditable, and always traceable.
          </p>
        </motion.div>

        {/* Steps */}
        <div style={{ position: "relative" }}>
          {/* Vertical connector line */}
          <div style={{
            position: "absolute", left: 31, top: 48, bottom: 0, width: 1,
            background: "linear-gradient(to bottom, rgba(212,175,122,0.15), rgba(212,175,122,0.0))",
          }} />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: E }}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: "2.5rem",
                alignItems: "flex-start",
                marginBottom: i < STEPS.length - 1 ? "3.5rem" : 0,
              }}
            >
              {/* Node */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: `${step.color}12`,
                border: `1px solid ${step.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.4rem", color: step.color, flexShrink: 0,
                boxShadow: `0 0 20px ${step.color}20`,
              }}>
                {step.icon}
              </div>

              {/* Content */}
              <div style={{ paddingTop: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: step.color, letterSpacing: "0.2em" }}>
                    {step.n}
                  </span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#f0ede8", letterSpacing: "-0.01em" }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(240,237,232,0.36)", maxWidth: 540 }}>
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.7 }}
          style={{
            marginTop: "6rem",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: "3rem",
          }}
        >
          {[
            { val: "< 800ms", label: "End-to-end response time" },
            { val: "voyage-law-2", label: "Legal-specific embedding model" },
            { val: "Cohere v3.5", label: "Neural reranker" },
          ].map(({ val, label }) => (
            <div key={label} style={{ padding: "0 2rem 0 0" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#d4af7a", marginBottom: "0.35rem", letterSpacing: "-0.02em" }}>{val}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(240,237,232,0.3)", letterSpacing: "0.05em" }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
