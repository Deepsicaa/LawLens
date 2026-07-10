"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

function ConfidenceRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <motion.circle
          cx={70} cy={70} r={r} fill="none"
          stroke="#10b981" strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ delay: 0.8, duration: 1.5, ease: E }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981", lineHeight: 1 }}
        >
          {score}%
        </motion.span>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(240,237,232,0.35)", textTransform: "uppercase" }}>
          confidence
        </span>
      </div>
    </div>
  );
}

const CITATIONS = [
  { act: "Indian Contract Act, 1872", section: "§ 10", excerpt: "All agreements are contracts if they are made by the free consent of parties..." },
  { act: "Consumer Protection Act, 2019", section: "§ 2(7)", excerpt: "Consumer means any person who buys any goods for consideration..." },
  { act: "Information Technology Act, 2000", section: "§ 43A", excerpt: "A body corporate possessing, dealing or handling sensitive personal data..." },
];

export function SceneVerification() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [activeCite, setActiveCite] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setActiveCite((v) => (v + 1) % CITATIONS.length), 2800);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section
      ref={ref}
      id="verification"
      className="scene"
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "8rem 5rem", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, rgba(16,185,129,0.03) 0%, transparent 60%)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>

        {/* Left: Evidence panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.0, ease: E }}
        >
          <span className="eyebrow" style={{ display: "block", marginBottom: "1.5rem" }}>Evidence Verification</span>
          <h2 style={{
            fontSize: "clamp(2rem, 3.8vw, 4.5rem)", fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.025em", color: "#f0ede8", marginBottom: "1.2rem"
          }}>
            Every answer has<br />
            <em className="font-serif" style={{ color: "#10b981", fontStyle: "italic", fontWeight: 400 }}>proof.</em>
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(240,237,232,0.35)", marginBottom: "2.5rem", maxWidth: 420 }}>
            LawLens never guesses. Every factual claim in an answer is traced directly
            to a retrieved statute. No citation = no claim.
          </p>

          {/* Citation cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {CITATIONS.map((c, i) => (
              <motion.div
                key={c.act}
                animate={{
                  background: activeCite === i ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
                  borderColor: activeCite === i ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.05)",
                }}
                transition={{ duration: 0.4 }}
                style={{
                  padding: "1rem 1.25rem", borderRadius: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                }}
                onClick={() => setActiveCite(i)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#10b981", letterSpacing: "0.1em" }}>
                    {c.section}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: "rgba(240,237,232,0.25)", letterSpacing: "0.08em" }}>
                    {c.act}
                  </span>
                </div>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "rgba(240,237,232,0.35)", fontStyle: "italic" }}>
                  "{c.excerpt.slice(0, 72)}…"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Answer panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 1.0, ease: E }}
        >
          <div style={{
            background: "rgba(6,6,8,0.8)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "1.5rem", padding: "2.5rem", backdropFilter: "blur(24px)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,237,232,0.3)" }}>
                LawLens Answer
              </span>
              <div style={{ marginLeft: "auto" }}>
                <ConfidenceRing score={94} />
              </div>
            </div>

            {/* Answer text */}
            <div style={{ fontSize: "0.88rem", lineHeight: 1.85, color: "rgba(240,237,232,0.65)", marginBottom: "2rem" }}>
              <p>
                Under Section 10 of the Indian Contract Act, 1872, a valid contract requires
                free consent of competent parties, lawful consideration, and a lawful object.
              </p>
              <br />
              <p>
                The Consumer Protection Act, 2019 further provides remedies where a party
                is misled into forming a contract under unfair trade practices.
              </p>
            </div>

            {/* Citation tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {CITATIONS.slice(0, 2).map((c) => (
                <span
                  key={c.act}
                  style={{
                    fontSize: "0.65rem", padding: "0.3rem 0.65rem", borderRadius: "999px",
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                    color: "#10b981", letterSpacing: "0.05em",
                  }}
                >
                  {c.section} · {c.act.split(",")[0]}
                </span>
              ))}
            </div>

            {/* Verified badge */}
            <div style={{
              marginTop: "1.5rem", paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", gap: "0.6rem",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#10b981",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6rem", color: "#000", fontWeight: 700,
              }}>✓</div>
              <span style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.35)", letterSpacing: "0.05em" }}>
                Evidence verified · 3 official sources retrieved
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
