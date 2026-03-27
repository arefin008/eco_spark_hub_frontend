export default function AdminIdeasPage() {
  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin idea moderation
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          This route is intended for under-review, approved, and rejected idea
          management, including feedback for rejected submissions.
        </p>
      </div>
    </main>
  );
}
