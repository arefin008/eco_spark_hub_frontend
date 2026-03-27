import { notFound } from "next/navigation";

import { ideaList } from "@/data/mock-content";

export default async function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;
  const idea = ideaList.find((item) => item.id === ideaId);

  if (!idea) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-10">
      <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {idea.category}
          </span>
          <span className="text-xs text-muted-foreground">
            {idea.isPaid ? "Paid access required" : "Public idea"}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {idea.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submitted by {idea.author} on {idea.publishedAt}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Problem statement</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {idea.problemStatement}
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Proposed solution</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {idea.proposedSolution}
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-xl font-semibold">Detailed description</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {idea.description}
              </p>
            </section>
          </div>

          <aside className="space-y-4 rounded-3xl border border-border bg-secondary/30 p-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Interaction
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Voting, comments, nested replies, and admin review actions are
                represented in the service and route scaffold for later wiring.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-muted-foreground">Votes</p>
                <p className="mt-2 text-2xl font-semibold">{idea.voteScore}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-muted-foreground">Status</p>
                <p className="mt-2 text-2xl font-semibold">{idea.status}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
