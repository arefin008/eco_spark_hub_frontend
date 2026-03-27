export default function MyProfilePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-10">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          My profile
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Member profile scaffold
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Use this route for account information, purchased ideas, authored
          ideas, and password management once the backend is connected.
        </p>
      </div>
    </main>
  );
}
