"use client";
import { JURISDICTIONS } from "types";
import type { Jurisdiction } from "types";
import { CitationCard } from "@/components/ai/citation-card";
import { ConfidenceBar } from "@/components/ai/confidence-bar";

interface JurisdictionResult {
  jurisdiction: Jurisdiction;
  answer: string;
  citations: Array<{
    id: string;
    source: string;
    section: string;
    text: string;
    url?: string;
    jurisdiction: Jurisdiction;
    relevanceScore: number;
  }>;
  confidenceScore: number;
  retrievedDocuments: number;
}

interface Props {
  question: string;
  results: JurisdictionResult[];
}

export function ComparisonTable({ question, results }: Props) {
  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#62596b] mb-1">
          Comparing across jurisdictions
        </p>
        <p className="text-[15px] text-[#62596b]">{question}</p>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map((result) => {
          const meta = JURISDICTIONS[result.jurisdiction];
          return (
            <div
              key={result.jurisdiction}
              className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
            >
              {/* Jurisdiction header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <span className="text-xl">{meta.flag}</span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#302a3c]">{meta.name}</h3>
                  <p className="text-xs text-[#62596b]">{result.retrievedDocuments} documents retrieved</p>
                </div>
              </div>

              {/* Confidence */}
              <div className="px-5 pt-4">
                <ConfidenceBar score={result.confidenceScore} />
              </div>

              {/* Answer */}
              <div className="px-5 py-4 flex-1">
                <p className="text-sm leading-relaxed text-[#62596b]">{result.answer}</p>
              </div>

              {/* Citations */}
              {result.citations.length > 0 && (
                <div className="px-5 pb-5 space-y-2 border-t border-white/[0.06] pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#62596b] mb-3">
                    {result.citations.length} source{result.citations.length !== 1 ? "s" : ""}
                  </p>
                  {result.citations.slice(0, 2).map((c, i) => (
                    <CitationCard key={c.id} citation={c} index={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
