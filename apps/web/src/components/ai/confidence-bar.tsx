import { getConfidenceLevel } from "types";
import { cn } from "@/lib/utils";

interface Props {
  score: number;
}

const LEVEL_STYLES = {
  high: { bar: "bg-emerald-500", label: "High confidence", text: "text-emerald-400" },
  medium: { bar: "bg-amber-500", label: "Medium confidence", text: "text-amber-400" },
  low: { bar: "bg-orange-500", label: "Low confidence", text: "text-orange-400" },
  insufficient: { bar: "bg-red-500", label: "Insufficient evidence", text: "text-red-400" },
};

export function ConfidenceBar({ score }: Props) {
  const level = getConfidenceLevel(score);
  const styles = LEVEL_STYLES[level];
  const pct = Math.round(score * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", styles.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={cn("text-xs font-medium tabular-nums", styles.text)}>
        {pct}% · {styles.label}
      </span>
    </div>
  );
}
