"use client";
import { useState, useRef, useEffect } from "react";
import { JURISDICTIONS } from "types";
import type { Jurisdiction } from "types";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: Jurisdiction;
  onChange: (j: Jurisdiction) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function JurisdictionSelector({ value, onChange, disabled, compact }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = JURISDICTIONS[value];

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  if (!compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {(Object.entries(JURISDICTIONS) as [Jurisdiction, (typeof JURISDICTIONS)[Jurisdiction]][]).map(
          ([key, m]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              disabled={disabled}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-150",
                value === key
                  ? "border-[rgba(201,162,39,0.5)] bg-[rgba(201,162,39,0.12)] text-[#c9a227]"
                  : "border-[rgba(201,162,39,0.08)] bg-[rgba(201,162,39,0.03)] text-[#f0ebe0]/40 hover:border-[rgba(201,162,39,0.2)] hover:text-[#f0ebe0]/70",
                disabled && "pointer-events-none opacity-40"
              )}
            >
              <span>{m.flag}</span>
              <span>{m.name}</span>
            </button>
          )
        )}
      </div>
    );
  }

  // Compact dropdown mode
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-[rgba(201,162,39,0.2)] bg-[rgba(201,162,39,0.08)] px-3 py-1.5 text-sm font-medium text-[#c9a227] transition-all hover:bg-[rgba(201,162,39,0.12)]",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <span>{meta.flag}</span>
        <span>{meta.name}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-[rgba(201,162,39,0.15)] bg-[#0f1013] shadow-xl overflow-hidden">
          {(Object.entries(JURISDICTIONS) as [Jurisdiction, (typeof JURISDICTIONS)[Jurisdiction]][]).map(
            ([key, m]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors",
                  value === key
                    ? "bg-[rgba(201,162,39,0.1)] text-[#c9a227]"
                    : "text-[#f0ebe0]/55 hover:bg-[rgba(201,162,39,0.05)] hover:text-[#f0ebe0]/90"
                )}
              >
                <span>{m.flag}</span>
                <span>{m.name}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
