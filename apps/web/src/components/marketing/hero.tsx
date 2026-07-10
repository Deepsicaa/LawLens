"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Globe2, Zap, Star } from "lucide-react";

const HeroScene = dynamic(
  () => import("@/components/3d/hero-scene").then((m) => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: EASE },
});

const TRUST = [
  { icon: ShieldCheck, label: "Official Sources Only" },
  { icon: Globe2,      label: "Multi-Jurisdiction" },
  { icon: Zap,         label: "AI Verified Answers" },
  { icon: Star,        label: "Instant & Reliable" },
];

/* Mask-reveal line animation */
function RevealLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span className="word-mask" style={{ lineHeight: 1.05, display: "block" }}>
      <motion.span
        className={`block ${className}`}
        initial={{ y: "108%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.85, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "100vh", background: "transparent" }}
    >
      {/* Use CSS grid: text left | 3D right, both filling full height */}
      <div
        className="grid"
        style={{
          minHeight: "100vh",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* ── Left: Copy ─────────────────────────────────── */}
        <div
          className="relative z-10 flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-20 pt-24 pb-12"
        >
          {/* Eyebrow badge */}
          <motion.div {...FADE(0.1)} className="mb-8">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{
                border: "1px solid rgba(201,162,39,0.35)",
                background: "rgba(201,162,39,0.07)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9a227] opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c9a227]" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.22em] text-[#c9a227] uppercase">
                AI-Powered Legal Intelligence
              </span>
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="font-bold tracking-[-0.025em]"
            style={{ fontSize: "clamp(3.2rem, 6vw, 5.5rem)" }}
          >
            <RevealLine delay={0.2} className="text-white">See The Law.</RevealLine>
            <RevealLine delay={0.36} className="text-[#c9a227]">Clearly.</RevealLine>
          </h1>

          {/* Subtext */}
          <motion.p
            {...FADE(0.58)}
            className="mt-6 text-[15.5px] leading-[1.82] max-w-[420px]"
            style={{ color: "rgba(242,240,236,0.42)" }}
          >
            Accurate. Verified. Citation-backed legal answers from official
            sources across multiple jurisdictions. All in one intelligent platform.
          </motion.p>

          {/* CTAs */}
          <motion.div {...FADE(0.72)} className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold text-black transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "#c9a227",
                boxShadow: "0 0 28px rgba(201,162,39,0.40)",
              }}
            >
              Ask a Legal Question
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-all duration-300 hover:text-white"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(242,240,236,0.60)",
              }}
            >
              Explore Features
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div {...FADE(0.9)} className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3">
            {TRUST.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[12px]" style={{ color: "rgba(242,240,236,0.32)" }}>
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: "rgba(201,162,39,0.1)" }}
                >
                  <Icon className="w-2.5 h-2.5 text-[#c9a227]" style={{ opacity: 0.7 }} />
                </div>
                {label}
              </div>
            ))}
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            className="mt-16 flex flex-col gap-2"
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: "rgba(242,240,236,0.18)" }}>
              Scroll
            </span>
            <motion.div
              className="h-10 w-px"
              style={{ background: "linear-gradient(to bottom, rgba(201,162,39,0.35), transparent)" }}
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* ── Right: 3D Scene ─────────────────────────────── */}
        <div className="relative" style={{ minHeight: "100vh" }}>
          <motion.div
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 2.2 }}
          >
            <HeroScene />
          </motion.div>
          {/* Left fade so the 3D blends into the text column */}
          <div
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: "120px",
              background: "linear-gradient(to right, #05060a 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "180px",
              background: "linear-gradient(to top, #05060a 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
