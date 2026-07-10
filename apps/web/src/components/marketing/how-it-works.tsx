"use client";
import { motion } from "framer-motion";
import { Search, Brain, ShieldCheck, Link2, Zap } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Ask a question",
    description:
      "Select your jurisdiction and ask any legal question in plain language. No legalese required.",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
  },
  {
    number: "02",
    icon: Zap,
    title: "Hybrid retrieval",
    description:
      "Dense and sparse retrieval runs in parallel across the jurisdiction's vector index. 30 candidates retrieved, reranked to the best 5.",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/10",
  },
  {
    number: "03",
    icon: Brain,
    title: "Grounded generation",
    description:
      "Claude generates an answer strictly from the retrieved evidence. The system prompt makes fabrication structurally impossible.",
    color: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Verification",
    description:
      "A secondary AI pass checks every claim in the answer against the retrieved documents. Unsupported claims are flagged.",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
  },
  {
    number: "05",
    icon: Link2,
    title: "Citations & confidence",
    description:
      "Citations are extracted and formatted with direct links to official sources. A confidence score tells you exactly how reliable the answer is.",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#05071a] py-32 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            The pipeline
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            From question
            <br />
            <span className="text-white/40">to verified answer.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/40">
            Five deterministic stages between your question and the response. Every stage is
            independently observable and testable.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-white/5 to-transparent md:hidden" />

          <div className="space-y-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`group relative flex gap-5 md:gap-8 items-start rounded-2xl border ${step.border} ${step.bg} p-5 md:p-7 backdrop-blur-sm transition-all duration-300 hover:border-white/10`}
                >
                  {/* Step number + icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] ${step.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold font-mono ${step.color} opacity-70`}>
                        {step.number}
                      </span>
                      <h3 className="text-[15px] font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-white/40">{step.description}</p>
                  </div>

                  {/* Arrow for large screens */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="h-3 w-px bg-white/10" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
