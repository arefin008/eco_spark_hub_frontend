import type { Metadata } from "next";
import { ArrowRight, Globe2, Leaf, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/ecospark/page-shell";

const principles = [
  {
    icon: Leaf,
    title: "Community-first publishing",
    description:
      "Ideas are structured for clarity so people can understand the problem, proposal, and value quickly.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent moderation",
    description:
      "Review states and decisions stay visible, which keeps trust high and public discussion grounded.",
  },
  {
    icon: Globe2,
    title: "Execution-ready outcomes",
    description:
      "The platform supports deeper implementation guidance without hiding core public discovery behind a paywall.",
  },
];

export const metadata: Metadata = {
  title: "About Us | EcoSpark Hub",
  description:
    "Learn how EcoSpark Hub helps communities publish, validate, and implement sustainability ideas.",
};

export default function AboutUsPage() {
  return (
    <PageShell className="space-y-12 py-14 md:py-16">
      <section className="grid gap-6 rounded-[32px] border border-border/80 bg-card p-6 shadow-sm lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">About us</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            A cleaner public platform for sustainability ideas that need real traction, not noise.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            EcoSpark Hub is designed to help communities publish stronger proposals, collect visible
            support, and move credible sustainability ideas into implementation through structured
            workflows and transparent review.
          </p>
        </div>

        <div className="rounded-[28px] border border-border/80 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_12%,white),white)] p-6">
          <p className="text-sm leading-7 text-muted-foreground">
            Instead of treating civic software like a bulletin board, the platform treats every idea
            like a product proposal: clear context, visible public feedback, and a path to action.
          </p>
          <Link
            href="/ideas"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Explore public ideas
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((item) => (
          <article key={item.title} className="rounded-[28px] border border-border/80 bg-card p-6 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <item.icon className="size-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
