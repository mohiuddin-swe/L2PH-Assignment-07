"use client";

import { ErrorState } from "@/components/common/error-state";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorState
      digest={error.digest}
      onRetry={reset}
      homeHref="/login"
      homeLabel="Back to sign in"
      description="This page could not be loaded. The server may be waking up, so please try again in a few seconds."
    />
  );
}