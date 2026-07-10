"use client";
import { Star, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Message, Citation } from "types";
import { getConfidenceLevel } from "types";

function CitationCard({ cit, index }: { cit: Citation; index: number }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[rgba(201,162,39,0.1)] bg-[rgba(201,162,39,0.04)] p-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[rgba(201,162,39,0.15)] text-[11px] font-bold text-[#c9a227]">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[12px] font-semibold text-[#f0ebe0]/80">{cit.section}</p>
            <p className="text-[11px] text-[#f0ebe0]/40">{cit.source}</p>
          </div>
          {cit.url && (
            <a
              href={cit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 rounded-md border border-[rgba(201,162,39,0.15)] bg-[rgba(201,162,39,0.08)] px-2 py-1 text-[10px] font-medium text-[#c9a227] hover:bg-[rgba(201,162,39,0.15)] transition-colors"
            >
              View Source <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
        {cit.text && (
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#f0ebe0]/35 line-clamp-2">{cit.text}</p>
        )}
      </div>
    </div>
  );
}

export function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[72%] rounded-2xl rounded-tr-sm bg-[rgba(201,162,39,0.1)] border border-[rgba(201,162,39,0.18)] px-4 py-3">
          <p className="text-[13.5px] leading-relaxed text-[#f0ebe0]/90">{message.content}</p>
        </div>
      </div>
    );
  }

  const level = message.confidenceScore != null ? getConfidenceLevel(message.confidenceScore) : null;
  const confColor =
    level === "high" ? "#22c55e" : level === "medium" ? "#c9a227" : level === "low" ? "#f97316" : "#f0ebe0";

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-[rgba(201,162,39,0.12)] bg-[#0f1013] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(201,162,39,0.07)]">
          <Star className="h-3.5 w-3.5 text-[#c9a227] fill-[#c9a227]" />
          <span className="text-[11px] font-bold text-[#c9a227] uppercase tracking-wider">Answer</span>
          {level && (
            <span className="ml-auto text-[11px] font-semibold" style={{ color: confColor }}>
              {Math.round((message.confidenceScore ?? 0) * 100)}% confidence
            </span>
          )}
        </div>

        {/* Answer text */}
        <div className="px-4 py-4 text-[13.5px] leading-[1.85] text-[#f0ebe0]/78 whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Feedback */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-[rgba(201,162,39,0.06)]">
          <span className="text-[11px] text-[#f0ebe0]/25">Was this helpful?</span>
          <button className="p-1.5 rounded-lg hover:bg-[rgba(201,162,39,0.08)] text-[#f0ebe0]/25 hover:text-[#22c55e] transition-colors">
            <ThumbsUp className="h-3 w-3" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[rgba(201,162,39,0.08)] text-[#f0ebe0]/25 hover:text-red-400 transition-colors">
            <ThumbsDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Citations */}
      {message.citations && message.citations.length > 0 && (
        <div className="space-y-2 pl-1">
          {message.citations.map((cit, i) => (
            <CitationCard key={cit.id} cit={cit} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
