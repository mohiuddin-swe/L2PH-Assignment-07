"use client";

import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  digest?: string;
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this page. Please try again in a moment.",
  digest,
  onRetry,
  homeHref = "/",
  homeLabel = "Go home",
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center", className)}>
      <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" aria-hidden />
      </span>
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
        {digest ? <p className="font-mono text-xs text-muted-foreground">Reference: {digest}</p> : null}
      </div>
      <div className="flex gap-2">
        {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
        <Link href={homeHref} className={buttonVariants({ variant: "outline" })}>
          {homeLabel}
        </Link>
      </div>
    </div>
  );
}