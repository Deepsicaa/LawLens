"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const METRICS = [
  { value: 3620, suffix: "+", label: "Official Acts & Statutes indexed", color: "#d4af7a" },
  { value: 94, suffix: "%", label: "Citation accuracy rate", color: "#10b981" },
  { value: 4, suffix: "", label: "Legal jurisdictions supported", color: "#3b82f6" },
  { value: 800, suffix: "ms", label: "Average response latency", color: "#7c3aed" },
];

const PRINCIPLES = [
  "Retrieve from official sources first — always",
  "Never generate a legal claim without retrieved evidence",
  "Every citation traces to a real, verifiable statute",
  "When uncertain, state uncertainty — never guess",
  "Jurisdiction awareness before every answer",
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

export function SceneTrust() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      id="trust"
      className="scene"
      style={{ padding: "8rem 5rem", position: "relative", overflow: "hidden" }}
    >
      {/* Giant background logo mark watermark */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none", userSelect: "none",
        opacity: 0.022,
      }}>
        <svg width="60vw" height="60vw" viewBox="0 0 48 48" fill="none" style={{ display: "block" }}>
          <circle cx="24" cy="24" r="21.5" stroke="#c4a46a" strokeWidth="0.6"/>
          <circle cx="24" cy="24" r="17.5" stroke="#c4a46a" strokeWidth="0.3"/>
          <line x1="24" y1="14.5" x2="24" y2="35.5" stroke="#c4a46a" strokeWidth="0.5" strokeLinecap="round"/>
          <line x1="10.5" y1="19" x2="37.5" y2="19" stroke="#c4a46a" strokeWidth="0.5" strokeLinecap="round"/>
          <circle cx="24" cy="19" r="1.2" fill="#c4a46a"/>
          <line x1="10.5" y1="19" x2="10.5" y2="28.5" stroke="#c4a46a" strokeWidth="0.4" strokeLinecap="round"/>
          <line x1="37.5" y1="19" x2="37.5" y2="28.5" stroke="#c4a46a" strokeWidth="0.4" strokeLinecap="round"/>
          <path d="M 5.5,28.5 Q 10.5,33.5 15.5,28.5" stroke="#c4a46a" strokeWidth="0.5" strokeLinecap="round" fill="none"/>
          <path d="M 32.5,28.5 Q 37.5,33.5 42.5,28.5" stroke="#c4a46a" strokeWidth="0.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: E }}
          style={{ marginBottom: "6rem", textAlign: "center" }}
        >
          <span className="eyebrow" style={{ display: "block", marginBottom: "1.2rem" }}>Research & Trust</span>
          <h2 style={{
            fontSize: "clamp(2.2rem, 4vw, 5rem)", fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.025em", color: "#f0ede8",
          }}>
            Built on evidence.<br />
            <em className="font-serif" style={{ color: "#d4af7a", fontStyle: "italic", fontWeight: 400 }}>
              Measured on accuracy.
            </em>
          </h2>
        </motion.div>

        {/* Giant metrics */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          marginBottom: "6rem",
        }}>
          {METRICS.map(({ value, suffix, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.8, ease: E }}
              style={{
                padding: "3rem 2rem",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                position: "relative",
              }}
            >
              <div style={{ height: 2, background: color, position: "absolute", top: 0, left: 0, right: 0, opacity: 0.5 }} />
              <div style={{
                fontSize: "clamp(2.5rem, 4.5vw, 5rem)", fontWeight: 800, letterSpacing: "-0.04em",
                color, lineHeight: 1, marginBottom: "0.75rem", fontVariantNumeric: "tabular-nums",
              }}>
                <AnimatedNumber target={value} suffix={suffix} />
              </div>
              <p style={{ fontSize: "0.8rem", lineHeight: 1.6, color: "rgba(240,237,232,0.32)" }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* AI Principles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8, ease: E }}
          >
            <h3 style={{
              fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)", fontWeight: 700, lineHeight: 1.15,
              letterSpacing: "-0.02em", color: "#f0ede8", marginBottom: "2rem"
            }}>
              The{" "}
              <em className="font-serif" style={{ color: "#d4af7a", fontStyle: "italic", fontWeight: 400 }}>
                five principles
              </em>{" "}
              every answer must satisfy.
            </h3>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "rgba(240,237,232,0.35)", maxWidth: 360 }}>
              These constraints are not suggestions. They are encoded into the LawLens pipeline
              and verified at every step of generation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8, ease: E }}
            style={{ display: "flex", flexDirection: "column", gap: "0" }}
          >
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: E }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "1rem",
                  padding: "1.2rem 0",
                  borderBottom: i < PRINCIPLES.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.6rem",
                  color: "#d4af7a", letterSpacing: "0.1em", paddingTop: "0.1rem", flexShrink: 0
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "rgba(240,237,232,0.55)" }}>
                  {p}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
