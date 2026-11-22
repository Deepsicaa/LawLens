"use client";
import { Star, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Message, Citation } from "types";
import { getConfidenceLevel } from "types";

function CitationCard({ cit, index }: { cit: Citation; index: number }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[rgba(118,75,138,0.1)] bg-[rgba(118,75,138,0.04)] p-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[rgba(118,75,138,0.15)] text-[11px] font-bold text-[#704784]">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[12px] font-semibold text-[#62596b]">{cit.section}</p>
            <p className="text-[11px] text-[#62596b]">{cit.source}</p>
          </div>
          {cit.url && (
            <a
              href={cit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 rounded-md border border-[rgba(118,75,138,0.15)] bg-[rgba(118,75,138,0.08)] px-2 py-1 text-[10px] font-medium text-[#704784] hover:bg-[rgba(118,75,138,0.15)] transition-colors"
            >
              View Source <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
        {cit.text && (
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#62596b] line-clamp-2">{cit.text}</p>
        )}
      </div>
    </div>
  );
}

function inlineText(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function AnswerCopy({ text }: { text: string }) {
  const blocks = [];
  const lines = text.trim().split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;
    if (/^#{1,6}\s/.test(line)) blocks.push(<h3 key={i}>{inlineText(line.replace(/^#+\s+/, ""))}</h3>);
    else if (/^---+$/.test(line)) blocks.push(<hr key={i} />);
    else if (line.startsWith("> ")) blocks.push(<blockquote key={i}>{inlineText(line.slice(2))}</blockquote>);
    else if (/^[-*]\s/.test(line)) {
      const start = i;
      const items = [line];
      while (i + 1 < lines.length && /^[-*]\s/.test(lines[i + 1]!.trim())) items.push(lines[++i]!.trim());
      blocks.push(<ul key={start}>{items.map((item, index) => <li key={index}>{inlineText(item.slice(2))}</li>)}</ul>);
    } else blocks.push(<p key={i}>{inlineText(line)}</p>);
  }
  return <div className="answer-copy px-5 py-4 text-[15px] leading-[1.8]">{blocks}</div>;
}

export function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[72%] rounded-2xl rounded-tr-sm bg-[rgba(118,75,138,0.1)] border border-[rgba(118,75,138,0.18)] px-4 py-3">
          <p className="text-[13.5px] leading-relaxed text-[#62596b]">{message.content}</p>
        </div>
      </div>
    );
  }

  const level = message.confidenceScore != null ? getConfidenceLevel(message.confidenceScore) : null;
  const confColor =
    level === "high" ? "#267554" : level === "medium" ? "#704784" : level === "low" ? "#f97316" : "#302a3c";

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-[rgba(118,75,138,0.12)] bg-[#fffcfa] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(118,75,138,0.07)]">
          <Star className="h-3.5 w-3.5 text-[#704784] fill-[#704784]" />
          <span className="text-[11px] font-bold text-[#704784] uppercase tracking-wider">Answer</span>
          {level && (
            <span className="ml-auto text-[11px] font-semibold" style={{ color: confColor }}>
              {Math.round((message.confidenceScore ?? 0) * 100)}% confidence
            </span>
          )}
        </div>

        {/* Answer text */}
        <AnswerCopy text={message.content} />

        {/* Feedback */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-t border-[rgba(118,75,138,0.06)]">
          <span className="text-[11px] text-[#62596b]">Was this helpful?</span>
          <button className="p-1.5 rounded-lg hover:bg-[rgba(118,75,138,0.08)] text-[#62596b] hover:text-[#267554] transition-colors">
            <ThumbsUp className="h-3 w-3" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[rgba(118,75,138,0.08)] text-[#62596b] hover:text-red-400 transition-colors">
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
