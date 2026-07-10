import type { Citation } from "types";
import { ExternalLink, BookOpen } from "lucide-react";

interface Props {
  citation: Citation;
  index: number;
}

export function CitationCard({ citation, index }: Props) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 group">
      <div className="flex items-start gap-3">
        {/* Number */}
        <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/15 text-[11px] font-bold text-blue-400">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {/* Source + section */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
              <BookOpen className="w-3 h-3" />
              {citation.source}
            </div>
            <span className="text-xs text-white/30">·</span>
            <span className="text-xs font-medium text-blue-400">{citation.section}</span>
          </div>

          {/* Text excerpt */}
          <p className="text-xs leading-relaxed text-white/40 line-clamp-3">{citation.text}</p>

          {/* Score + link */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="h-1 w-16 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.round(citation.relevanceScore * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-white/25 tabular-nums">
                {Math.round(citation.relevanceScore * 100)}% relevance
              </span>
            </div>
            {citation.url && (
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-[11px] text-white/25 hover:text-white/60 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Official source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
