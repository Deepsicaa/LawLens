"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function CTA() {
  return (
    <section className="relative py-40 px-6 md:px-12 overflow-hidden">
      <div className="separator-gold mb-0" />

      {/* Centered gold supernova glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,162,39,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-12 bg-[#c9a227]/40" />
            <span className="font-mono text-[11px] tracking-[0.3em] text-[#c9a227] uppercase">
              Begin your research
            </span>
            <span className="h-px w-12 bg-[#c9a227]/40" />
          </div>

          <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-bold tracking-[-0.03em] leading-[1.0] mb-6">
            <span className="block text-white">TRUSTED.</span>
            <span className="block text-white/35">VERIFIED.</span>
            <span className="block text-[#c9a227] text-glow-gold">ACCURATE.</span>
          </h2>

          <p className="mx-auto mt-8 max-w-md text-[16px] leading-relaxed text-white/35">
            Join researchers, law students, and professionals who rely on
            LawLens for citation-backed legal intelligence.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-3 rounded-2xl bg-[#c9a227] px-9 py-4.5 text-[15px] font-bold text-black glow-gold transition-all duration-300 hover:bg-[#d9b330] hover:scale-[1.02]"
              data-cursor
              style={{ paddingTop: "1.125rem", paddingBottom: "1.125rem" }}
            >
              Start for Free
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 rounded-2xl glass-gold px-9 py-4 text-[15px] font-medium text-white/55 transition-all duration-300 hover:text-white"
              data-cursor
              style={{ paddingTop: "1.125rem", paddingBottom: "1.125rem" }}
            >
              Ask a Question
            </Link>
          </motion.div>

          <p className="mt-8 text-[12px] text-white/18 font-mono">
            Official legislation only · No credit card required · Always free to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
}
