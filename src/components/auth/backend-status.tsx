"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// The API runs on a free instance that sleeps when idle. Pinging it as soon as the login page
// opens wakes it up while the visitor is still typing, and we say so instead of leaving them guessing.
export function BackendStatus() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/proxy/health", { cache: "no-store", signal: controller.signal })
      .catch(() => undefined)
      .finally(() => {
        if (!controller.signal.aborted) setReady(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <p role="status" aria-live="polite" className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
      <span
        className={cn("size-2 rounded-full", ready ? "bg-success" : "animate-pulse bg-warning")}
        aria-hidden
      />
      {ready ? "Server is online" : "Waking up the server. The first sign-in can take up to a minute."}
    </p>
  );
}