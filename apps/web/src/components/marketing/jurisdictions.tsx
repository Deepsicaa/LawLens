"use client";
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const JURISDICTIONS = [
  {
    code: "IN",
    flag: "🇮🇳",
    country: "India",
    city: "New Delhi",
    landmark: "Taj Mahal",
    source: "indiacode.nic.in",
    actCount: "1,800+",
    description:
      "Constitution of India, IPC/BNS, Code of Civil Procedure, Code of Criminal Procedure, and all central acts indexed from India Code.",
    status: "Permitted" as const,
    statusNote: "With valid authorization and statutory compliance.",
    /* Gradient simulating sunset over Taj Mahal */
    gradient: "linear-gradient(160deg, #3d1a06 0%, #7a3310 30%, #c9621a 60%, #e8902a 80%, #f5b844 100%)",
    accentColor: "#f97316",
    /* SVG silhouette of Taj Mahal style dome */
    silhouette: `M50,75 L50,60 C50,55 45,52 45,48 C45,42 48,38 50,35 C52,38 55,42 55,48 C55,52 50,55 50,60 L50,75
                 M35,75 L35,62 L30,58 L28,48 L30,42 L35,38 L35,34 L37,34 L37,38 L42,40 L42,75
                 M65,75 L65,62 L70,58 L72,48 L70,42 L65,38 L65,34 L63,34 L63,38 L58,40 L58,75
                 M20,75 L80,75`,
  },
  {
    code: "GB",
    flag: "🇬🇧",
    country: "United Kingdom",
    city: "London",
    landmark: "Big Ben",
    source: "legislation.gov.uk",
    actCount: "3,100+",
    description:
      "UK Acts of Parliament, Statutory Instruments, Scottish and Welsh legislation, and key common law foundations.",
    status: "Restricted" as const,
    statusNote: "Legal for self-defense in certain circumstances.",
    gradient: "linear-gradient(160deg, #040c2e 0%, #0a1855 30%, #1a3a8c 60%, #2a5ac0 80%, #4a7ae8 100%)",
    accentColor: "#3b82f6",
    silhouette: `M50,75 L50,30 L50,30
                 M47,75 L47,30 L53,30 L53,75
                 M45,38 L55,38 M45,32 L55,32
                 M44,55 Q50,50 56,55 L56,68 L44,68 Z
                 M20,75 L80,75`,
  },
  {
    code: "CA",
    flag: "🇨🇦",
    country: "Canada",
    city: "Toronto",
    landmark: "CN Tower",
    source: "laws-lois.justice.gc.ca",
    actCount: "900+",
    description:
      "Consolidated Acts of Canada, federal regulations, and the Canadian Charter of Rights and Freedoms from the federal register.",
    status: "Restricted" as const,
    statusNote: "Prohibited in most areas except with specific permits.",
    gradient: "linear-gradient(160deg, #1a0a0a 0%, #3d0f0f 25%, #7a1a1a 50%, #b52020 75%, #e03030 100%)",
    accentColor: "#ef4444",
    silhouette: `M50,75 L50,15 M48,75 L48,15 L52,15 L52,75
                 M44,22 Q50,18 56,22 Q52,28 52,35 L48,35 Q48,28 44,22
                 M40,45 L60,45 L60,55 L40,55 Z
                 M20,75 L80,75`,
  },
  {
    code: "AU",
    flag: "🇦🇺",
    country: "Australia",
    city: "Sydney",
    landmark: "Opera House",
    source: "legislation.gov.au",
    actCount: "2,200+",
    description:
      "Commonwealth Acts, Legislative Instruments, Federal Register of Legislation, and state territory legislation.",
    status: "Permitted" as const,
    statusNote: "Legal with applicable license in some states.",
    gradient: "linear-gradient(160deg, #020e1a 0%, #053020 25%, #0a5a38 50%, #159558 75%, #22c55e 100%)",
    accentColor: "#22c55e",
    silhouette: `M25,75 Q30,55 38,48 Q44,42 50,42 Q56,42 62,48 Q70,55 75,75
                 M30,75 Q34,58 40,52 Q45,47 50,47 Q55,47 60,52 Q66,58 70,75
                 M20,75 L80,75`,
  },
];

type Jurisdiction = typeof JURISDICTIONS[number];

function StatusBadge({ status, color }: { status: "Permitted" | "Restricted"; color: string }) {
  const isPermitted = status === "Permitted";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        background: isPermitted ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${isPermitted ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        color: isPermitted ? "#4ade80" : "#f87171",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isPermitted ? "#4ade80" : "#f87171" }}
      />
      {status}
    </span>
  );
}

function CountryCard({ j, index }: { j: Jurisdiction; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE }}
      className="group relative rounded-2xl overflow-hidden flex-shrink-0"
      style={{
        width: "280px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0d0e14",
      }}
      data-cursor
    >
      {/* Photo-like gradient image area */}
      <div className="relative h-44 overflow-hidden" style={{ background: j.gradient }}>
        {/* Silhouette SVG */}
        <svg
          viewBox="0 0 100 100"
          className="absolute bottom-0 inset-x-0 w-full opacity-40"
          preserveAspectRatio="none"
          style={{ height: "65%" }}
        >
          <path d={j.silhouette} fill={j.accentColor} fillOpacity={0.6} stroke="none" />
        </svg>

        {/* Flag + country name overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="text-xl">{j.flag}</span>
          <span className="text-[14px] font-bold text-white drop-shadow-lg">{j.country}</span>
        </div>

        {/* Map pin */}
        <div className="absolute top-3 right-3 flex items-center gap-1 text-white/50">
          <MapPin className="w-3 h-3" />
          <span className="text-[10px] font-mono">{j.landmark}</span>
        </div>

        {/* Gradient overlay bottom */}
        <div
          className="absolute bottom-0 inset-x-0 h-16"
          style={{ background: "linear-gradient(to top, #0d0e14 0%, transparent 100%)" }}
        />
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={j.status} color={j.accentColor} />
          <span className="font-mono text-[10px] text-white/25">{j.actCount} Acts</span>
        </div>

        <p className="text-[12px] leading-[1.65] text-white/42 line-clamp-3">
          {j.statusNote}
        </p>

        <p className="text-[11px] text-white/22 font-mono truncate">{j.source}</p>

        <Link
          href="/ask"
          className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-semibold transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1px solid rgba(255,255,255,0.09)`,
            color: "rgba(255,255,255,0.6)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = `${j.accentColor}18`;
            (e.currentTarget as HTMLElement).style.borderColor = `${j.accentColor}40`;
            (e.currentTarget as HTMLElement).style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
          }}
          data-cursor
        >
          View Laws <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

export function Jurisdictions() {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(JURISDICTIONS.length - 1, i + 1));

  return (
    <section id="jurisdictions" className="relative py-28 overflow-hidden">
      <div className="separator-gold mb-24" />

      {/* Dim world-map dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(201,162,39,0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-6 bg-[#c9a227]/60" />
              <span className="font-mono text-[11px] tracking-[0.28em] text-[#c9a227] uppercase">
                Multiple Jurisdictions
              </span>
            </div>
            <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-bold tracking-[-0.025em] leading-[1.08]">
              Compare Laws.
              <br />
              <span className="text-white/30">Understand Differences.</span>
            </h2>
            <p className="mt-3 text-[15px] text-white/35">
              One question. Multiple perspectives.
            </p>
          </motion.div>

          {/* Nav arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={activeIdx === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              data-cursor
            >
              <ChevronLeft className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={next}
              disabled={activeIdx === JURISDICTIONS.length - 1}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-25"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              data-cursor
            >
              <ChevronRight className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* Cards row (overflow-x scroll on mobile) */}
        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 md:-mx-0 md:px-0">
          <div className="flex gap-4 pb-2" style={{ minWidth: "max-content" }}>
            {JURISDICTIONS.map((j, i) => (
              <CountryCard key={j.code} j={j} index={i} />
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {JURISDICTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: activeIdx === i ? "20px" : "6px",
                height: "6px",
                background: activeIdx === i ? "#c9a227" : "rgba(255,255,255,0.2)",
              }}
              data-cursor
            />
          ))}
        </div>
      </div>
    </section>
  );
}
