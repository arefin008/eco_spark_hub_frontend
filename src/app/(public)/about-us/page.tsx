export default function AboutUsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-10">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          About us
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          A civic platform for community-led sustainability.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          EcoSpark Hub helps members share practical environmental ideas, collect
          support through voting and discussion, and move promising submissions
          into public visibility through admin review.
        </p>
      </div>
    </main>
  );
}
