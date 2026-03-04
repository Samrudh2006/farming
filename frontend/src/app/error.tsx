/**
 * Global error boundary.
 */
"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
