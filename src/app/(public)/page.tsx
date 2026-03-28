"use client";

import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Search, Sparkles, Vote } from "lucide-react";
import Link from "next/link";

import { IdeaCard } from "@/components/ecospark/idea-card";
import { NewsletterForm } from "@/components/ecospark/newsletter-form";
import { PageShell } from "@/components/ecospark/page-shell";
import { SectionHeading } from "@/components/ecospark/section-heading";
import { ideaService } from "@/services/idea.service";

const featureHighlights = [
  {
    icon: Search,
    title: "Discover",
    description: "Search by title, category, votes, and payment status.",
  },
  {
    icon: Vote,
    title: "Validate",
    description: "Up-votes and comments make demand and credibility visible.",
  },
  {
    icon: Lightbulb,
    title: "Publish",
    description: "Draft, refine, and submit ideas for admin review.",
  },
  {
    icon: Sparkles,
    title: "Monetize",
    description: "Sell premium ideas while free knowledge stays public.",
  },
];

export default function HomePage() {
  const featuredIdeasQuery = useQuery({
    queryKey: ["ideas", "featured-home"],
    queryFn: () => ideaService.list({ limit: 6, sortBy: "TOP_VOTED" }),
  });

  return (
    <>
      <section className="border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(36,191,122,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(244,186,67,0.14),transparent_28%),linear-gradient(180deg,var(--background),color-mix(in_oklab,var(--background)_92%,white))]">
        <PageShell className="py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-emerald-300/80 bg-emerald-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-950">
                Community Sustainability Portal
              </span>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-6xl">
                Turn grounded environmental ideas into visible public action.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                Members publish sustainability ideas, collect votes, discuss feasibility,
                and share premium implementation guides through secure paid access when needed.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/ideas" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                  Explore Ideas
                </Link>
                <Link href="/register" className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold">
                  Become a Member
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {featureHighlights.map((item) => (
                <div key={item.title} className="rounded-[28px] border border-border/80 bg-card/90 p-5 shadow-sm">
                  <item.icon className="size-5 text-primary" />
                  <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-10 py-14">
        <SectionHeading
          eyebrow="Featured ideas"
          title="Top-voted sustainability proposals from the community"
          description="This section is powered by the live ideas endpoint, sorted by the strongest public support."
        />
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {featuredIdeasQuery.data?.data.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
        {featuredIdeasQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading featured ideas...</p>
        ) : null}
      </PageShell>

      <section className="border-y border-border bg-secondary/35">
        <PageShell className="grid gap-6 py-14 md:grid-cols-3">
          {[
            ["1", "Submit ideas with categories, pricing, and media-ready links."],
            ["2", "Admins review submissions and members unlock premium plans via Stripe."],
            ["3", "Discussion, votes, and comments keep the best ideas moving forward."],
          ].map(([index, copy]) => (
            <div key={index} className="rounded-[28px] border border-border/80 bg-card p-6">
              <p className="text-5xl font-semibold text-primary">{index}</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </PageShell>
      </section>

      <PageShell className="py-14">
        <div className="rounded-[36px] border border-border/80 bg-card p-8">
          <SectionHeading
            eyebrow="Newsletter"
            title="Get updates on new approvals, top-voted ideas, and platform announcements"
            description="The subscription form is connected to the backend newsletters API."
          />
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </PageShell>
    </>
  );
}
