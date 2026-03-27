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
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm font-medium text-destructive">
            Application error
          </p>
          <h1 className="text-2xl font-semibold">Something went wrong.</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {error.message || "The route failed to render."}
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </main>
  );
}
