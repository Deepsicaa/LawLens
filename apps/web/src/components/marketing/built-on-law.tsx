"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, Globe2, Star, MessageSquare } from "lucide-react";

const BooksScene3D = dynamic(
  () => import("@/components/3d/books-scene").then((m) => ({ default: m.BooksScene3D })),
  { ssr: false, loading: () => <div className="w-full h-full" /> }
);

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const STATS = [
  { icon: FileText,      value: "12M+",  label: "Legal Documents",    desc: "Indexed official acts" },
  { icon: Globe2,        value: "4+",    label: "Countries Covered",  desc: "Phase 1 jurisdictions" },
  { icon: Star,          value: "98.7%", label: "Accuracy Rate",      desc: "Verified sources" },
  { icon: MessageSquare, value: "1.2M+", label: "Questions Answered", desc: "Across jurisdictions" },
];

export function BuiltOnLaw() {
  return (
    <section id="about" className="relative overflow-hidden py-0">
      <div className="separator-gold" />

      <div className="relative min-h-[85vh] grid grid-cols-1 lg:grid-cols-2">

        {/* ── Left: Text content ───────────────────────── */}
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 xl:px-20 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-6 bg-[#c9a227]/60" />
              <span className="font-mono text-[11px] tracking-[0.28em] text-[#c9a227] uppercase">
                Trusted Legal Intelligence
              </span>
            </div>

            <h2 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold tracking-[-0.025em] leading-[1.06] mb-6">
              Built on Law.
              <br />
              <span className="text-[#c9a227]">Powered by AI.</span>
            </h2>

            <p className="text-[15px] leading-[1.82] text-white/40 max-w-[420px] mb-8">
              We combine advanced AI with authoritative legal databases to
              deliver answers you can trust. Every claim traced to official
              legislation. No exceptions.
            </p>

            <Link
              href="/ask"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3 text-[14px] font-medium text-white/65 transition-all duration-300 hover:border-[rgba(201,162,39,0.4)] hover:bg-[rgba(201,162,39,0.06)] hover:text-white w-fit"
              data-cursor
            >
              Learn More
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {/* ── Stat grid ────────────────────────── */}
            <div className="mt-14 grid grid-cols-2 gap-3">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: EASE }}
                    className="glass-gold rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(201,162,39,0.1)", border: "1px solid rgba(201,162,39,0.18)" }}
                      >
                        <Icon className="w-3.5 h-3.5 text-[#c9a227]" />
                      </div>
                    </div>
                    <div className="text-[28px] font-bold tracking-tight text-white leading-none mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[12px] font-semibold text-white/70 mb-0.5">{stat.label}</div>
                    <div className="text-[11px] text-white/28">{stat.desc}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* ── Right: 3D Law Books ─────────────────────── */}
        <div className="relative min-h-[500px] lg:min-h-full">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.0 }}
          >
            <BooksScene3D />
          </motion.div>
          {/* Left edge blend */}
          <div
            className="absolute inset-y-0 left-0 w-32 hidden lg:block"
            style={{ background: "linear-gradient(to right, #05060a 0%, transparent 100%)" }}
          />
          {/* Bottom blend */}
          <div
            className="absolute bottom-0 inset-x-0 h-24"
            style={{ background: "linear-gradient(to top, #05060a 0%, transparent 100%)" }}
          />
        </div>
      </div>

      <div className="separator-gold mt-0" />
    </section>
  );
}
