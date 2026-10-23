import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label: string;
  className?: string;
}

// Green at 75% and above, amber from 60%, red below.
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const tone = pct >= 75 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive";
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${pct}%` }} />
    </div>
  );
}