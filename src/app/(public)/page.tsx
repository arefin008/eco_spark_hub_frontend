import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, Search, ShieldCheck, Vote } from "lucide-react";

import { IdeaCard } from "@/components/ecospark/idea-card";
import { NewsletterForm } from "@/components/ecospark/newsletter-form";
import { PageShell } from "@/components/ecospark/page-shell";
import { SectionHeading } from "@/components/ecospark/section-heading";
import { buttonVariants } from "@/components/ui/button-styles";
import { getFeaturedIdeas } from "@/lib/server/public-ideas";
import { cn } from "@/lib/utils";

const featureHighlights = [
  {
    icon: Search,
    title: "Find strong ideas faster",
    description: "Browse approved ideas with search, category filters, and clear free or paid access states.",
  },
  {
    icon: Vote,
    title: "Let the community rank them",
    description: "Votes and comments reveal which sustainability proposals have real momentum.",
  },
  {
    icon: Lightbulb,
    title: "Publish with structure",
    description: "Members can submit clear proposals with problem statements, solutions, and implementation detail.",
  },
  {
    icon: ShieldCheck,
    title: "Keep moderation visible",
    description: "Admin review keeps the public feed focused while preserving a transparent workflow.",
  },
];

const processSteps = [
  {
    title: "Publish an idea",
    description: "Members create sustainability proposals with practical context and optional premium access.",
  },
  {
    title: "Gather public feedback",
    description: "Community votes and discussion help strong ideas stand out without burying the essentials.",
  },
  {
    title: "Move into execution",
    description: "Approved ideas remain discoverable, and premium implementation guidance can support deeper action.",
  },
];

export const metadata: Metadata = {
  title: "EcoSpark Hub",
  description:
    "Discover, validate, and publish sustainability ideas through a clean public platform built for members and admins.",
};

export default async function HomePage() {
  const featuredIdeas = await getFeaturedIdeas();

  return (
    <>
      <section className="border-b border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_34%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--secondary)_14%,transparent),transparent_28%),linear-gradient(180deg,color-mix(in_oklab,var(--background)_94%,white),var(--background))]">
        <PageShell className="py-12 sm:py-14 md:py-20">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary sm:px-4 sm:text-xs sm:tracking-[0.32em]">
                Community Sustainability Portal
              </span>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
                Cleaner public idea sharing for sustainability projects that deserve real traction.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 md:text-lg">
                EcoSpark Hub gives members a focused place to publish ideas, gather support,
                and unlock implementation guidance without cluttering the experience.
              </p>
              <div className="flex flex-row gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/ideas"
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "min-w-0 flex-1 rounded-full px-4 text-center sm:flex-none sm:px-5",
                  )}
                >
                  Explore Ideas
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "min-w-0 flex-1 rounded-full px-4 text-center sm:flex-none sm:px-5",
                  )}
                >
                  Become a Member
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-border/80 bg-card p-4 shadow-sm sm:rounded-[32px] sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {featureHighlights.map((item) => (
                  <div key={item.title} className="rounded-[22px] border border-border/70 bg-muted/70 p-4 sm:rounded-[24px] sm:p-5">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <item.icon className="size-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageShell>
      </section>

      <PageShell className="space-y-8 py-12 sm:space-y-10 md:py-16">
        <SectionHeading
          eyebrow="Featured ideas"
          title="Top-voted sustainability proposals from the community"
          description="Rendered on the server so the public feed stays indexable and loads with content."
        />
        {featuredIdeas.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {featuredIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border/80 bg-card/80 p-6 text-sm text-muted-foreground sm:p-8">
            Featured ideas are temporarily unavailable. The page still renders, and the list
            will populate once the API is reachable.
          </div>
        )}
      </PageShell>

      <section className="border-y border-border bg-secondary/30">
        <PageShell className="py-12 md:py-16">
          <SectionHeading
            eyebrow="How It Works"
            title="A straightforward workflow from idea to implementation"
            description="Publish, validate with the community, and move strong ideas into action."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div key={step.title} className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      <PageShell className="py-12 md:py-16">
        <div className="rounded-[28px] border border-border/80 bg-card p-5 sm:rounded-[36px] sm:p-8">
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
