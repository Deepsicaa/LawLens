"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Link2, Globe, BarChart2, ShieldCheck } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="h-px w-6 bg-[#c9a227]/60" />
      <span className="font-mono text-[11px] tracking-[0.28em] text-[#c9a227] uppercase">
        {children}
      </span>
    </div>
  );
}

function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={`relative rounded-2xl overflow-hidden glass-gold group ${className}`}
      style={{ padding: "2rem" }}
      data-cursor
    >
      {/* Hover accent line at top */}
      <div
        className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[rgba(201,162,39,0)] to-transparent transition-all duration-500 group-hover:via-[rgba(201,162,39,0.5)]"
      />
      {children}
    </motion.div>
  );
}

/* Animated counting dot cluster */
function RetrievalVisual() {
  const dots = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="relative h-28 flex items-center justify-center">
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const r = i % 2 === 0 ? 48 : 36;
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? 5 : 3,
              height: i % 3 === 0 ? 5 : 3,
              left: `${x}%`,
              top: `${y}%`,
              background: "#c9a227",
            }}
            animate={{
              opacity: [0.15, 0.9, 0.15],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.13,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(201,162,39,0.12)",
          border: "1px solid rgba(201,162,39,0.35)",
        }}
      >
        <ShieldCheck className="w-5 h-5 text-[#c9a227]" />
      </div>
    </div>
  );
}

/* Citation chain visual */
function CitationVisual() {
  const items = ["IPC §302", "Constitution Art. 21", "CPC §151"];
  return (
    <div className="flex flex-col gap-2 mt-4">
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.12, duration: 0.5, ease: EASE }}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2"
          style={{
            background: "rgba(201,162,39,0.06)",
            border: "1px solid rgba(201,162,39,0.12)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
          <span className="font-mono text-[12px] text-[#c9a227]/80">{item}</span>
          <div className="flex-1 h-px bg-[rgba(201,162,39,0.15)]" />
          <Link2 className="w-3 h-3 text-white/25" />
        </motion.div>
      ))}
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-32 px-6 md:px-12">
      <div className="separator-gold mb-24" />

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-16"
        >
          <SectionLabel>Platform Capabilities</SectionLabel>
          <h2 className="text-[clamp(2.4rem,5vw,4rem)] font-bold tracking-[-0.025em] leading-[1.08]">
            Built different.<br />
            <span className="text-white/35">Not just prompted.</span>
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "auto" }}
        >
          {/* Card 1 — Hero card: RAG (large, spans 7 cols, 2 rows) */}
          <div className="col-span-12 lg:col-span-7">
            <BentoCard delay={0} className="h-full min-h-[320px] flex flex-col">
              <SectionLabel>Core Architecture</SectionLabel>
              <h3 className="text-[24px] font-bold tracking-tight text-white mb-3">
                Retrieval-Augmented<br />Generation
              </h3>
              <p className="text-[14px] leading-relaxed text-white/45 max-w-md">
                Every answer begins with retrieval — not model memory.
                Relevant legislation is fetched, ranked, and passed to the LLM
                as verified context before a single word is generated.
              </p>
              <div className="flex-1 mt-6">
                <RetrievalVisual />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[12px] text-white/30 font-mono">
                  Zero hallucinations by design
                </span>
              </div>
            </BentoCard>
          </div>

          {/* Card 2 — Official Sources (spans 5 cols) */}
          <div className="col-span-12 lg:col-span-5">
            <BentoCard delay={0.08} className="h-full min-h-[320px] flex flex-col">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <BookOpen className="w-5 h-5 text-[#c9a227]" />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight text-white mb-3">
                Official Sources Only
              </h3>
              <p className="text-[14px] leading-relaxed text-white/45 flex-1">
                Retrieves exclusively from government legislation portals —
                acts, statutes, constitutions, regulations.
                No blogs. No summaries. No AI-generated content as source.
              </p>
              <div className="mt-5 pt-5 border-t border-white/[0.06] font-mono text-[11px] text-white/25 space-y-1">
                <div>→ indiacode.nic.in</div>
                <div>→ legislation.gov.uk</div>
                <div>→ laws-lois.justice.gc.ca</div>
                <div>→ legislation.gov.au</div>
              </div>
            </BentoCard>
          </div>

          {/* Card 3 — Citations (spans 5 cols) */}
          <div className="col-span-12 lg:col-span-5">
            <BentoCard delay={0.14} className="h-full min-h-[260px] flex flex-col">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <Link2 className="w-5 h-5 text-[#c9a227]" />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight text-white mb-3">
                Precise Citations
              </h3>
              <p className="text-[14px] leading-relaxed text-white/45 mb-2">
                Every factual claim maps to an exact act and section,
                with a direct link to the official source.
              </p>
              <CitationVisual />
            </BentoCard>
          </div>

          {/* Card 4 — Multi-jurisdiction (spans 4 cols) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <BentoCard delay={0.2} className="h-full min-h-[260px] flex flex-col">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <Globe className="w-5 h-5 text-[#c9a227]" />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight text-white mb-3">
                Multi-Jurisdiction
              </h3>
              <p className="text-[14px] leading-relaxed text-white/45 flex-1">
                India, UK, Canada, Australia — Phase 1.
                Adding a new country requires only ingesting docs and registering the collection.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {["India", "UK", "Canada", "Australia"].map((c) => (
                  <div
                    key={c}
                    className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-white/50"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>

          {/* Card 5 — Confidence scoring (spans 3 cols) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <BentoCard delay={0.26} className="h-full min-h-[260px] flex flex-col">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <BarChart2 className="w-5 h-5 text-[#c9a227]" />
              </div>
              <h3 className="text-[20px] font-bold tracking-tight text-white mb-3">
                Confidence Score
              </h3>
              <p className="text-[14px] leading-relaxed text-white/45 flex-1">
                Every answer includes a calibrated confidence level
                based on retrieval quality and evidence coverage.
              </p>
              {/* Mini gauge */}
              <div className="mt-5 flex flex-col items-center gap-1">
                <svg width="80" height="80" viewBox="0 0 80 80" className="overflow-visible">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                  <motion.circle
                    cx="40" cy="40" r="30"
                    fill="none"
                    stroke="#c9a227"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - 0.87)}`}
                    transform="rotate(-90 40 40)"
                    initial={{ strokeDashoffset: `${2 * Math.PI * 30}` }}
                    whileInView={{ strokeDashoffset: `${2 * Math.PI * 30 * 0.13}` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5, ease: EASE }}
                  />
                  <text x="40" y="44" textAnchor="middle" fill="#c9a227" fontSize="14" fontWeight="700">87%</text>
                </svg>
                <span className="text-[11px] text-white/25 font-mono">avg confidence</span>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </section>
  );
}
