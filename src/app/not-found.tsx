import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">404</p>
          <h1 className="text-2xl font-semibold">Page not found.</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            The route you requested is not part of the current EcoSpark Hub
            scaffold.
          </p>
          <Link
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            href="/"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
