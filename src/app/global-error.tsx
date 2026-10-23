"use client";

import "./globals.css";

// Last-resort boundary: it replaces the root layout, so it has to render its own <html>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-svh place-items-center px-4 text-center">
          <div className="max-w-sm space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">An unexpected error occurred. Please reload the page.</p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}