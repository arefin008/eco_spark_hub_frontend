import Link from "next/link";

import { featuredIdeas, testimonials } from "@/data/mock-content";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-border bg-[radial-gradient(circle_at_top,rgba(22,163,74,0.16),transparent_38%),linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_92%,white))]">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-emerald-200/70 bg-emerald-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-900">
              Sustainable Community Portal
            </span>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Turn local sustainability ideas into visible community action.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                EcoSpark Hub gives members a place to publish ideas, collect
                votes, discuss impact, and unlock premium ideas through paid
                access when required.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                href="/ideas"
              >
                Browse Ideas
              </Link>
              <Link
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition hover:bg-muted"
                href="/register"
              >
                Become a Member
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Search
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Find ideas fast</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Search by name, category, author, payment status, or vote range.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Paid Access
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                Premium idea monetization
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Members can purchase access to premium ideas while free ideas
                remain public.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Featured ideas
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Community projects with strong momentum
            </h2>
          </div>
          <Link
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            href="/ideas"
          >
            View all ideas
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {featuredIdeas.map((idea) => (
            <article
              key={idea.id}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {idea.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {idea.isPaid ? "Paid" : "Free"}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{idea.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {idea.summary}
              </p>
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>{idea.voteScore} votes</span>
                <Link
                  className="font-medium text-primary transition hover:opacity-80"
                  href={`/ideas/${idea.id}`}
                >
                  View idea
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/35">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Testimonials
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Top voted ideas members talk about
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.author}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="text-sm leading-6 text-muted-foreground">
                  “{item.quote}”
                </p>
                <div className="mt-6">
                  <p className="font-semibold">{item.author}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm lg:flex lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Newsletter
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Keep members updated on top voted and newly approved ideas.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              The backend route set already includes newsletter subscription
              endpoints, so this section is ready to be wired to the API.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
            <Link
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              href="/ideas"
            >
              Explore ideas
            </Link>
            <Link
              className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              href="/blog"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
