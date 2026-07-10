"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const WORDS = ["TRUSTED.", "VERIFIED.", "ACCURATE."];

export function SceneCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section
      ref={ref}
      id="cta"
      className="scene"
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "8rem 5rem", position: "relative", overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* Radiating rings */}
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute", borderRadius: "50%",
            border: "1px solid rgba(212,175,122,0.06)",
            width: `${i * 22}vw`, height: `${i * 22}vw`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 5 + i, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Center gold dot */}
      <div style={{
        position: "absolute", width: 8, height: 8, borderRadius: "50%",
        background: "#d4af7a", boxShadow: "0 0 30px #d4af7a, 0 0 80px rgba(212,175,122,0.3)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: E }}
          style={{ marginBottom: "4rem" }}
        >
          <span className="eyebrow">The Future of Legal Intelligence</span>
        </motion.div>

        {/* Giant stacked words */}
        <div style={{ marginBottom: "5rem" }}>
          {WORDS.map((word, i) => (
            <div key={word} style={{ overflow: "hidden" }}>
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.16, duration: 1.0, ease: E }}
                style={{
                  fontSize: "clamp(4rem, 10vw, 11rem)",
                  fontWeight: 900,
                  lineHeight: 0.92,
                  letterSpacing: "-0.04em",
                  color: i === 1 ? "#d4af7a" : "rgba(240,237,232,0.92)",
                  textShadow: i === 1 ? "0 0 60px rgba(212,175,122,0.25)" : "none",
                  fontFamily: i === 1 ? "var(--font-serif)" : "var(--font-sans)",
                  fontStyle: i === 1 ? "italic" : "normal",
                }}
              >
                {word}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.8, ease: E }}
          style={{
            fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(240,237,232,0.35)",
            maxWidth: 440, margin: "0 auto 3.5rem",
          }}
        >
          Legal intelligence built on official sources.<br />
          Not on memory. Not on guesswork. On law.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.7, ease: E }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link href="/sign-up" className="btn-primary" style={{ fontSize: "0.95rem", padding: "1rem 2.5rem" }}>
            Start for Free <ArrowRight size={15} />
          </Link>
          <Link href="/sign-in" className="btn-ghost" style={{ fontSize: "0.95rem", padding: "1rem 2.5rem" }}>
            Sign In
          </Link>
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ marginTop: "2rem", fontSize: "0.72rem", color: "rgba(240,237,232,0.18)", letterSpacing: "0.08em" }}
        >
          No credit card required · India · UK · Canada · Australia
        </motion.p>
      </div>
    </section>
  );
}
