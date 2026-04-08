import type { Metadata } from "next";
import { FileSearch, ShieldCheck, Workflow } from "lucide-react";

import { PageShell } from "@/components/ecospark/page-shell";

const editorialAreas = [
  {
    icon: Workflow,
    title: "Moderation workflow",
    description:
      "This area is reserved for publishing real operational notes about how ideas move from submission to approval.",
  },
  {
    icon: ShieldCheck,
    title: "Trust and governance",
    description:
      "Future articles should document platform rules, review standards, and member-facing policy changes when they are actually published.",
  },
  {
    icon: FileSearch,
    title: "Implementation reports",
    description:
      "This section is intended for real launch notes, improvement logs, and sustainability case studies once editorial publishing is active.",
  },
];

export const metadata: Metadata = {
  title: "Blog | EcoSpark Hub",
  description:
    "Editorial publishing is reserved for real moderation notes, governance updates, and implementation reports.",
};

export default function BlogPage() {
  return (
    <PageShell className="space-y-10 py-14 md:py-16">
      <section className="ui-surface grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Editorial</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Insights & Platform Integrity
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Discover real operational notes, governance updates, and deep dives into the implementation of top-tier sustainability initiatives. Our editorial space is dedicated to transparency and platform evolution.
          </p>
        </div>

        <div className="flex h-full items-center justify-center rounded-2xl bg-muted/40 p-8 text-center border border-border/50">
          <div>
            <h3 className="font-medium text-foreground">Content Feed</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;re currently curating our first series of implementation reports. Check back soon for our inaugural publishing cycle.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {editorialAreas.map((area) => (
          <article key={area.title} className="ui-surface p-6">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <area.icon className="size-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">{area.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{area.description}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
