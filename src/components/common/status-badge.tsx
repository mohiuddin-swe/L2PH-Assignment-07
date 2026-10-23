import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/25 text-warning-foreground dark:text-warning",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-secondary text-secondary-foreground",
};

const DOT_CLASS: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  neutral: "bg-muted-foreground",
};

// Every status the backend can return, mapped to a colour.
const STATUS_TONE: Record<string, Tone> = {
  ACTIVE: "success",
  ENROLLED: "success",
  PAID: "success",
  SUCCESS: "success",
  PUBLISHED: "success",
  PRESENT: "success",
  PENDING: "warning",
  UNPAID: "warning",
  DRAFT: "warning",
  LATE: "warning",
  SUSPENDED: "danger",
  DROPPED: "danger",
  CANCELLED: "danger",
  FAILED: "danger",
  ABSENT: "danger",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONE[status] ?? "neutral";
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <Badge variant="secondary" className={cn("gap-1.5", TONE_CLASS[tone], className)}>
      <span className={cn("size-1.5 rounded-full", DOT_CLASS[tone])} aria-hidden />
      {label}
    </Badge>
  );
}