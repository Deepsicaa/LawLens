"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const COUNTRIES = [
  {
    code: "IN",
    name: "India",
    status: "Live",
    acts: ["Indian Contract Act", "IPC", "Consumer Protection Act", "RTI Act", "IT Act"],
    docs: "1,240+",
    color: "#f97316",
    gradient: "linear-gradient(135deg, #1a0a00 0%, #3d1500 50%, #0a0600 100%)",
    accent: "#f97316",
    landmark: "⟨Tri⟩",
  },
  {
    code: "GB",
    name: "United Kingdom",
    status: "Live",
    acts: ["Equality Act", "Human Rights Act", "Companies Act", "GDPR (UK)", "Employment Act"],
    docs: "980+",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #000a1a 0%, #001540 50%, #00060a 100%)",
    accent: "#3b82f6",
    landmark: "⟨Ben⟩",
  },
  {
    code: "CA",
    name: "Canada",
    status: "Live",
    acts: ["Canadian Charter", "Criminal Code", "PIPEDA", "Competition Act", "Labour Code"],
    docs: "760+",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #0a0000 100%)",
    accent: "#ef4444",
    landmark: "⟨Leaf⟩",
  },
  {
    code: "AU",
    name: "Australia",
    status: "Live",
    acts: ["Corporations Act", "Fair Work Act", "Privacy Act", "Australian Constitution", "NCC"],
    docs: "640+",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #001a0a 0%, #003d1a 50%, #00060a 100%)",
    accent: "#10b981",
    landmark: "⟨Oper⟩",
  },
];

export function SceneJurisdictions() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [active, setActive] = useState(0);
  const country = COUNTRIES[active]!

  return (
    <section
      ref={ref}
      id="jurisdictions"
      className="scene"
      style={{ minHeight: "100vh", padding: "8rem 5rem", position: "relative", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: E }}
          style={{ marginBottom: "5rem" }}
        >
          <span className="eyebrow" style={{ display: "block", marginBottom: "1.2rem" }}>Jurisdiction Coverage</span>
          <h2 style={{
            fontSize: "clamp(2.2rem, 4vw, 5rem)", fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "-0.025em", color: "#f0ede8",
          }}>
            One platform.<br />
            <em className="font-serif" style={{ color: "#d4af7a", fontStyle: "italic", fontWeight: 400 }}>
              Four legal systems.
            </em>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "4rem", alignItems: "start" }}>

          {/* Country selector */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: E }}
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {COUNTRIES.map((c, i) => (
              <button
                key={c.code}
                onClick={() => setActive(i)}
                style={{
                  display: "flex", alignItems: "center", gap: "1.25rem",
                  padding: "1.25rem 1.5rem", borderRadius: "1rem",
                  border: `1px solid ${active === i ? c.accent + "35" : "rgba(255,255,255,0.05)"}`,
                  background: active === i ? `${c.accent}0a` : "transparent",
                  cursor: "pointer", textAlign: "left", transition: "all 0.3s",
                  width: "100%",
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: active === i ? `${c.accent}20` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${active === i ? c.accent + "40" : "rgba(255,255,255,0.08)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", color: c.accent, flexShrink: 0,
                }}>
                  {c.code}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: active === i ? "#f0ede8" : "rgba(240,237,232,0.5)", marginBottom: 2 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.28)" }}>{c.docs} official documents</div>
                </div>
                <div style={{
                  fontSize: "0.6rem", padding: "0.25rem 0.6rem", borderRadius: "999px",
                  background: `${c.accent}15`, border: `1px solid ${c.accent}30`,
                  color: c.accent, letterSpacing: "0.12em", textTransform: "uppercase",
                }}>
                  {c.status}
                </div>
              </button>
            ))}
          </motion.div>

          {/* Detail panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8, ease: E }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: E }}
                style={{
                  borderRadius: "1.5rem", overflow: "hidden",
                  border: `1px solid ${country.accent}20`,
                  background: country.gradient,
                  minHeight: 400,
                  position: "relative",
                }}
              >
                {/* Top accent line */}
                <div style={{ height: 2, background: `linear-gradient(90deg, ${country.accent}, transparent)` }} />

                <div style={{ padding: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2.5rem" }}>
                    <div>
                      <div style={{ fontSize: "4rem", fontWeight: 900, color: "rgba(255,255,255,0.06)", lineHeight: 1, marginBottom: "0.5rem", fontFamily: "var(--font-serif)" }}>
                        {country.code}
                      </div>
                      <h3 style={{ fontSize: "2rem", fontWeight: 700, color: "#f0ede8", letterSpacing: "-0.02em" }}>
                        {country.name}
                      </h3>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: country.accent, letterSpacing: "-0.03em" }}>
                        {country.docs}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(240,237,232,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Official Acts
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: country.accent, textTransform: "uppercase", marginBottom: "1rem" }}>
                      Key Legislation
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {country.acts.map((act, ai) => (
                        <div key={act} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: country.accent, flexShrink: 0, opacity: 1 - ai * 0.15 }} />
                          <span style={{ fontSize: "0.85rem", color: `rgba(240,237,232,${0.65 - ai * 0.08})` }}>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Corner landmark symbol */}
                <div style={{
                  position: "absolute", bottom: "2rem", right: "2rem",
                  fontSize: "4rem", color: country.accent, opacity: 0.08,
                  fontFamily: "var(--font-serif)", lineHeight: 1,
                }}>
                  §
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Coming soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ marginTop: "3rem", display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
          <span style={{ fontSize: "0.72rem", color: "rgba(240,237,232,0.22)", letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Singapore · UAE · Germany coming 2026
          </span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.05)" }} />
        </motion.div>
      </div>
    </section>
  );
}
