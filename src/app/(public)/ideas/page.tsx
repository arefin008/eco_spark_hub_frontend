import Link from "next/link";

import { ideaList, ideasPageFilters } from "@/data/mock-content";

export default function IdeasPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          All ideas
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Paginated idea discovery scaffold
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          This page is structured around the assignment spec: searchable,
          filterable, sortable idea cards with free and paid visibility labels.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="mt-4 space-y-4">
            {ideasPageFilters.map((group) => (
              <div key={group.title} className="space-y-2">
                <p className="text-sm font-medium">{group.title}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <span
                      key={option}
                      className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {ideaList.map((idea) => (
              <article
                key={idea.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {idea.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {idea.isPaid ? "Paid idea" : "Free idea"}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold">{idea.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {idea.summary}
                </p>
                <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{idea.voteScore} votes</span>
                  <Link
                    className="font-medium text-primary"
                    href={`/ideas/${idea.id}`}
                  >
                    View idea
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-3xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
            <span>Showing 1-6 of 24 ideas</span>
            <span>Pagination placeholder</span>
          </div>
        </section>
      </div>
    </main>
  );
}
