export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-sm">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Login
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in to your member account
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Auth services and route constants are scaffolded for the backend
            endpoints in `ALL_ROUTES.md`.
          </p>
        </div>
      </div>
    </main>
  );
}
