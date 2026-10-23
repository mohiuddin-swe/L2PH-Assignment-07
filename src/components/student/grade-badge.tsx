import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function toneFor(grade: string): string {
  if (grade.startsWith("A")) return "bg-success/15 text-success";
  if (grade.startsWith("B")) return "bg-accent text-accent-foreground";
  if (grade === "F") return "bg-destructive/10 text-destructive";
  return "bg-warning/25 text-warning-foreground dark:text-warning";
}

export function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span className="text-muted-foreground">-</span>;
  return (
    <Badge variant="secondary" className={cn("min-w-9 font-semibold", toneFor(grade))}>
      {grade}
    </Badge>
  );
}