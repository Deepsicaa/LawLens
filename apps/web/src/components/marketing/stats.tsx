"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface StatDef {
  raw: number;
  display: string;
  suffix: string;
  label: string;
  sublabel: string;
}

const STATS: StatDef[] = [
  { raw: 12, display: "12",  suffix: "M+",  label: "Legal Documents",   sublabel: "Official government legislation indexed" },
  { raw: 4,  display: "4",   suffix: "+",   label: "Jurisdictions",      sublabel: "India, UK, Canada, Australia" },
  { raw: 98, display: "98.7",suffix: "%",   label: "Accuracy Rate",      sublabel: "Verified against primary sources" },
  { raw: 1,  display: "1.2", suffix: "M+",  label: "Questions Answered", sublabel: "Across all supported jurisdictions" },
];

function CountUp({
  target,
  display,
  suffix,
}: {
  target: number;
  display: string;
  suffix: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 2000;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setValue(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  /* Use display directly for non-integer displays */
  const hasDecimal = display.includes(".");
  const isFloat = display === "98.7";

  return (
    <div ref={ref}>
      {isFloat
        ? `${Math.min(value, 98)}.7`
        : `${value}${hasDecimal && display.includes(".2") ? ".2" : ""}`}
      <span>{suffix}</span>
    </div>
  );
}

export function Stats() {
  return (
    <section id="stats" className="relative py-28 px-6 md:px-12 overflow-hidden">
      <div className="separator-gold mb-24" />

      {/* Centered dim label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-16"
      >
        <span className="font-mono text-[11px] tracking-[0.28em] text-[#c9a227] uppercase">
          By the numbers
        </span>
      </motion.div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.09, ease: EASE }}
              className="flex flex-col justify-between p-8 lg:p-10"
              style={{ background: "#05060a" }}
            >
              {/* Giant number */}
              <div
                className="text-[clamp(3.5rem,7vw,6rem)] font-bold tracking-[-0.03em] leading-none text-white"
              >
                <CountUp target={stat.raw} display={stat.display} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <div className="mt-6">
                <div className="text-[15px] font-semibold text-white/80 mb-1">
                  {stat.label}
                </div>
                <div className="text-[12px] text-white/28 leading-relaxed">
                  {stat.sublabel}
                </div>
              </div>

              {/* Accent underline */}
              <div
                className="mt-6 h-px w-12 bg-[#c9a227]"
                style={{ opacity: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
