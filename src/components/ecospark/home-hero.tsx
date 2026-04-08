"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { getDynamicHeroContent } from "@/lib/ai";
import { readAiProfile } from "@/lib/ai-profile";
import { buttonVariants } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

const spotlightSlides = [
  {
    eyebrow: "Community validation",
    title: "Turn promising sustainability ideas into proposals people can actually review.",
    description:
      "Members can publish structured ideas, collect votes, and surface the strongest concepts before execution work starts.",
    bullets: ["Structured publishing", "Public traction signals", "Clear approval states"],
  },
  {
    eyebrow: "Moderated publishing",
    title: "Keep the public feed credible with a visible moderation workflow.",
    description:
      "EcoSpark Hub separates drafts, under-review submissions, and approved ideas so the public catalog stays useful and trustworthy.",
    bullets: ["Admin review queue", "Rejection feedback", "Approved-only discovery"],
  },
  {
    eyebrow: "Execution support",
    title: "Mix open access discovery with paid implementation guidance where depth matters.",
    description:
      "The platform supports both freely accessible ideas and premium knowledge products for deeper research or rollout planning.",
    bullets: ["Free and paid access", "Purchase flow", "Reusable implementation assets"],
  },
];

export function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroPersonalization, setHeroPersonalization] = useState(() =>
    getDynamicHeroContent(readAiProfile()),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % spotlightSlides.length);
    }, 4800);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setHeroPersonalization(getDynamicHeroContent(readAiProfile()));
  }, []);

  const activeSlide = spotlightSlides[activeIndex];

  return (
    <section className="border-b border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_34%),radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--secondary)_14%,transparent),transparent_28%),linear-gradient(180deg,color-mix(in_oklab,var(--background)_94%,white),var(--background))]">
      <div className="ui-shell flex min-h-[64svh] items-center py-10 sm:py-12 md:py-14 lg:min-h-[67svh]">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-primary sm:text-xs">
              <Sparkles className="size-3.5" />
              {heroPersonalization.eyebrow}
            </span>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-secondary">
                {activeSlide.eyebrow}
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
                {heroPersonalization.title}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8 md:text-lg">
                {heroPersonalization.description}
              </p>
            </div>

            <div className="flex flex-row flex-wrap gap-3">
              <Link
                href="/ideas"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-auto rounded-full px-5",
                )}
              >
                {heroPersonalization.ctaLabel}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-auto rounded-full px-5",
                )}
              >
                Become a Member
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {spotlightSlides.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    index === activeIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {slide.eyebrow}
                </button>
              ))}
            </div>

            <Link
              href="#platform-overview"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              Explore platform highlights
              <ArrowDown className="size-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="ui-surface overflow-hidden p-4 sm:p-5"
          >
            <div className="grid gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.eyebrow}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[24px] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_10%,transparent),color-mix(in_srgb,var(--secondary)_14%,transparent))] p-5 sm:p-6"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-card/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Active spotlight
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {activeSlide.eyebrow}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="grid gap-3 sm:grid-cols-3">
                {activeSlide.bullets.map((bullet) => (
                  <div key={bullet} className="ui-surface-subtle p-4">
                    <CheckCircle2 className="size-5 text-secondary" />
                    <p className="mt-3 text-sm font-medium">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
