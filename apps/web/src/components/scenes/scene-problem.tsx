"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 2200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const STATS = [
  { value: 73, suffix: "%", label: "of legal AI answers contain factual errors", color: "#ef4444" },
  { value: 96, suffix: "%", label: "of lawsuits involve a misunderstood statute", color: "#f97316" },
  { value: 0, suffix: "", label: "official sources cited in most AI legal tools", color: "#eab308" },
];

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function SceneProblem() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      ref={ref}
      id="problem"
      className="scene"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8rem 5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Red scan line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.3) 50%, transparent)",
        animation: "scan 8s linear infinite", pointerEvents: "none"
      }} />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: "3rem" }}
      >
        <span className="eyebrow" style={{ color: "#ef4444" }}>The Problem</span>
      </motion.div>

      {/* Main headline */}
      <div style={{ maxWidth: 900, marginBottom: "6rem" }}>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 1.0, ease: E }}
          style={{
            fontSize: "clamp(2.8rem, 5.5vw, 6.5rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "#f0ede8",
            marginBottom: "1.5rem",
          }}
        >
          Legal AI is<br />
          <em className="font-serif" style={{ color: "#ef4444", fontStyle: "italic", fontWeight: 400 }}>dangerously</em>
          <span> wrong.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: E }}
          style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(240,237,232,0.4)", maxWidth: 560 }}
        >
          Large language models generate plausible-sounding legal advice — but they don't
          read the law. They hallucinate statutes. They invent citations. And the
          consequences are real.
        </motion.p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
        {STATS.map(({ value, suffix, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.8, ease: E }}
            style={{
              padding: "3rem 2.5rem",
              borderTop: `1px solid ${color}22`,
              background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: color, opacity: 0.35 }} />
            <div
              style={{
                fontSize: "clamp(3.5rem, 7vw, 7rem)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color,
                marginBottom: "1rem",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Counter target={value} suffix={suffix} />
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "rgba(240,237,232,0.38)", maxWidth: 200 }}>
              {label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ marginTop: "5rem", paddingTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p style={{
          fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)",
          lineHeight: 1.7,
          color: "rgba(240,237,232,0.22)",
          maxWidth: 640,
          letterSpacing: "0.01em",
        }}>
          LawLens was built to solve this.<br />
          <span style={{ color: "rgba(240,237,232,0.5)" }}>
            By retrieving first. Verifying always. Hallucinating never.
          </span>
        </p>
      </motion.div>
    </section>
  );
}
