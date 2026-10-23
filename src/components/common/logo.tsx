import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { APP_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  variant?: "default" | "inverse";
  className?: string;
}

export function Logo({ href = "/", variant = "default", className }: LogoProps) {
  const inverse = variant === "inverse";
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-lg",
          inverse ? "bg-primary-foreground/15 text-primary-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        <GraduationCap className="size-[18px]" aria-hidden />
      </span>
      <span className={cn("text-lg", inverse && "text-primary-foreground")}>{APP_NAME}</span>
    </Link>
  );
}