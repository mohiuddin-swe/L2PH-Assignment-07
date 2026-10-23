"use client";

import { ErrorState } from "@/components/common/error-state";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-svh place-items-center px-4">
      <ErrorState digest={error.digest} onRetry={reset} />
    </main>
  );
}