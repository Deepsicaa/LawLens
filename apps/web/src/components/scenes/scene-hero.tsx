"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LawBooksScene = dynamic(
  () => import("@/components/3d/law-books-scene").then((m) => ({ default: m.LawBooksScene })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span style={{ display: "block", overflow: "hidden" }}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.9, ease: E }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SceneHero() {
  return (
    <section
      style={{
        position: "relative", minHeight: "100vh", display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* Left — text */}
      <div
        style={{
          position: "relative", zIndex: 10, display: "flex",
          flexDirection: "column", justifyContent: "center",
          padding: "7rem 3rem 4rem 5rem",
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{
              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: "#d4af7a", boxShadow: "0 0 12px #d4af7a",
              animation: "pulse-ring 2s ease-in-out infinite",
            }} />
            AI Legal Intelligence
          </span>
        </motion.div>

        {/* Headline */}
        <h1 style={{
          marginBottom: "2rem", fontWeight: 700, letterSpacing: "-0.03em",
          lineHeight: 0.95, fontSize: "clamp(3.8rem, 7vw, 8rem)",
        }}>
          <Reveal delay={0.2}>
            <span style={{ color: "#f0ede8" }}>Know</span>
          </Reveal>
          <Reveal delay={0.35}>
            <em className="font-serif" style={{ color: "#d4af7a", fontStyle: "italic", fontWeight: 400 }}>Your</em>
          </Reveal>
          <Reveal delay={0.5}>
            <span style={{ color: "#f0ede8" }}>Rights.</span>
          </Reveal>
        </h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.7, ease: E }}
          style={{
            fontSize: "1.0rem", lineHeight: 1.85, maxWidth: 400,
            color: "rgba(240,237,232,0.42)", marginBottom: "2.8rem",
          }}
        >
          Accurate, verified, citation-backed legal answers — retrieved from official
          government legislation across every jurisdiction.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: E }}
          style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}
        >
          <Link href="/sign-up" className="btn-primary">
            Ask a Legal Question <ArrowRight size={14} />
          </Link>
          <a href="#problem" className="btn-ghost">
            See How It Works <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          style={{ marginTop: "4rem", display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}
        >
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.62rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(240,237,232,0.18)",
          }}>
            Scroll to explore
          </span>
          <motion.div
            style={{ width: 1, height: 48, background: "linear-gradient(to bottom, rgba(212,175,122,0.4), transparent)" }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Right — 3D scene */}
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <motion.div
          style={{ position: "absolute", inset: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 2.5 }}
        >
          <LawBooksScene />
        </motion.div>
        {/* Left blend into dark bg */}
        <div style={{
          position: "absolute", inset: "0 auto 0 0", width: 140, pointerEvents: "none",
          background: "linear-gradient(to right, #060608 0%, transparent 100%)",
        }} />
        {/* Bottom blend */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 200, pointerEvents: "none",
          background: "linear-gradient(to top, #060608 0%, transparent 100%)",
        }} />
      </div>
    </section>
  );
}
