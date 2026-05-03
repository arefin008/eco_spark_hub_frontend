import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChartColumn,
  FolderKanban,
  MessagesSquare,
  Search,
  ShieldCheck,
  Users,
  Vote,
} from "lucide-react";

import { HomeHero } from "@/components/ecospark/home-hero";
import { FeaturedIdeasSection } from "@/components/ecospark/featured-ideas-section";
import { BackToTopButton } from "@/components/ecospark/back-to-top-button";
import { NewsletterForm } from "@/components/ecospark/newsletter-form";
import { PageShell } from "@/components/ecospark/page-shell";
import { Reveal } from "@/components/ecospark/reveal";
import { SectionHeading } from "@/components/ecospark/section-heading";
import { buttonVariants } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

const featureHighlights = [
  {
    icon: Search,
    title: "Discover credible ideas",
    description: "Search approved ideas by category, access model, and momentum signals.",
  },
  {
    icon: Vote,
    title: "Rank what matters",
    description: "Community voting and comments help strong proposals stand out quickly.",
  },
  {
    icon: FolderKanban,
    title: "Publish with structure",
    description: "Members submit problem statements, solutions, descriptions, and supporting media.",
  },
  {
    icon: ShieldCheck,
    title: "Moderate transparently",
    description: "Admins can review, approve, reject, and return feedback from a dedicated queue.",
  },
];

const ideaCategories = [
  {
    title: "Energy transition",
    description: "Projects focused on distributed clean energy, efficiency, and community adoption.",
  },
  {
    title: "Waste reduction",
    description: "Ideas that reduce landfill pressure, improve reuse, and strengthen local recovery loops.",
  },
  {
    title: "Mobility and streets",
    description: "Safer low-carbon transport, better access patterns, and smarter neighborhood movement.",
  },
  {
    title: "Civic implementation",
    description: "Operational approaches that move community proposals toward delivery.",
  },
];

const workflowSteps = [
  {
    title: "Create a proposal",
    description: "Members write a clear sustainability idea with the core context reviewers need.",
  },
  {
    title: "Review and moderate",
    description: "Admins evaluate the idea, keep standards visible, and return feedback when needed.",
  },
  {
    title: "Publish publicly",
    description: "Approved ideas enter the public catalog with discoverable metadata and traction signals.",
  },
  {
    title: "Support deeper execution",
    description: "Paid implementation content can extend strong ideas into reusable knowledge products.",
  },
];

const faqItems = [
  {
    question: "Who can publish ideas on EcoSpark Hub?",
    answer:
      "Authenticated members can create idea drafts, edit them, and submit them for review through the member workspace.",
  },
  {
    question: "What appears in the public feed?",
    answer:
      "The public catalog is designed around approved ideas so discovery stays focused and moderation standards remain visible.",
  },
  {
    question: "Why does the platform support paid ideas?",
    answer:
      "Some ideas grow into deeper implementation guides, research packages, or rollout playbooks that justify premium access.",
  },
  {
    question: "How do admins review submissions?",
    answer:
      "Admins use a dedicated review queue where they can inspect details, approve submissions, or reject them with feedback.",
  },
];

export const metadata: Metadata = {
  title: "Eco Spark Hub | Sustainable Innovation Platform",
  description:
    "Eco Spark Hub is a platform for sustainable innovation, eco-friendly ideas, and green technology solutions.",
  keywords: [
    "eco spark hub",
    "eco spark hub platform",
    "sustainable innovation",
    "green technology",
    "eco friendly ideas"
  ],
};

export default async function HomePage() {
  return (
    <>
      <HomeHero />
      <PageShell id="platform-overview" className="space-y-16 py-12 md:py-16">
        <Reveal>
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Core Features"
            title="Built around the actual lifecycle of sustainability proposals"
            description="Every major interaction on the platform supports one of four goals: discover, validate, publish, or moderate."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureHighlights.map((item) => (
              <article key={item.title} className="ui-surface p-5 sm:p-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <item.icon className="size-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Categories"
            title="Idea discovery is organized around practical sustainability domains"
            description="The public feed is easier to navigate when the landing page sets expectations around the types of ideas the platform supports."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {ideaCategories.map((category) => (
              <article key={category.title} className="ui-surface p-5 sm:p-6">
                <h2 className="text-2xl font-semibold tracking-tight">{category.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {category.description}
                </p>
              </article>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Workflow"
            title="From draft to public idea in four straightforward stages"
            description="The review path is visible on the homepage so visitors understand how quality is controlled before ideas appear publicly."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <article key={step.title} className="ui-surface p-5 sm:p-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
              </article>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="ui-surface p-6 lg:p-8">
            <SectionHeading
              eyebrow="For Members"
              title="Members can publish ideas with the context needed for serious review"
              description="The submission flow supports structured publishing instead of vague one-line proposals."
            />
            <div className="mt-6 grid gap-3">
              <div className="ui-surface-subtle flex items-start gap-3 p-4">
                <FolderKanban className="mt-0.5 size-5 text-secondary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Draft first, revise freely, and submit only when the proposal is strong enough for review.
                </p>
              </div>
              <div className="ui-surface-subtle flex items-start gap-3 p-4">
                <MessagesSquare className="mt-0.5 size-5 text-secondary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Votes and discussion create visible community signal before deeper implementation work begins.
                </p>
              </div>
            </div>
          </div>

          <div className="ui-surface p-6 lg:p-8">
            <SectionHeading
              eyebrow="For Admins"
              title="Review queues and user controls keep the public catalog useful"
              description="Admin tools are tailored for moderation rather than generic content management."
            />
            <div className="mt-6 grid gap-3">
              <div className="ui-surface-subtle flex items-start gap-3 p-4">
                <BadgeCheck className="mt-0.5 size-5 text-secondary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Reviewers can inspect ideas, approve them, or reject them with clear feedback.
                </p>
              </div>
              <div className="ui-surface-subtle flex items-start gap-3 p-4">
                <Users className="mt-0.5 size-5 text-secondary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  User and category management stay connected to the same operating workflow.
                </p>
              </div>
            </div>
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Featured Ideas"
            title="Approved ideas remain the strongest proof of platform value"
            description="This section pulls directly from the API and now supports AI-ranked discovery signals so the homepage stays tied to real platform activity."
          />
          <FeaturedIdeasSection />
        </section>
        </Reveal>

        <Reveal>
        <section className="space-y-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Key questions are answered before visitors enter the app"
            description="A professional homepage should remove the main sources of uncertainty for both public users and members."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {faqItems.map((item) => (
              <article key={item.question} className="ui-surface p-5 sm:p-6">
                <h2 className="text-lg font-semibold tracking-tight">{item.question}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
        </Reveal>
      </PageShell>

      <section className="border-y border-border bg-secondary/22">
        <PageShell className="space-y-8 py-12 md:py-16">
          <Reveal>
          <SectionHeading
            eyebrow="Newsletter"
            title="Stay current on newly approved ideas and platform updates"
            description="The newsletter gives visitors a low-friction way to stay connected without creating an account immediately."
          />
          <div className="ui-surface p-5 sm:p-8">
            <NewsletterForm />
          </div>
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-12 md:py-16">
        <Reveal>
        <section className="ui-surface grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              Final Call To Action
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Move from browsing sustainability ideas to publishing one.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              The page should end with a clean decision: explore the public catalog, create an account, or continue into the dashboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/ideas"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-12 justify-center rounded-2xl px-5",
              )}
            >
              Browse Public Ideas
              <ChartColumn className="size-4" />
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 justify-center rounded-2xl px-5",
              )}
            >
              Create Account
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 justify-center rounded-2xl px-5 sm:col-span-2",
              )}
            >
              Open Dashboard
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
        </Reveal>
      </PageShell>

      <BackToTopButton />
    </>
  );
}
