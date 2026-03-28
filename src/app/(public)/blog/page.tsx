import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/ecospark/page-shell";
import { blogPosts } from "@/data/mock-content";

export const metadata: Metadata = {
  title: "Blog | EcoSpark Hub",
  description:
    "Editorial notes on moderation, public idea platforms, and sustainability implementation.",
};

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = blogPosts;

  return (
    <PageShell className="space-y-12 py-14 md:py-16">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Blog</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Editorial thinking on moderation, idea quality, and sustainability execution.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            The blog gives the project a more complete public voice and explains the product logic
            behind community-backed idea platforms.
          </p>
        </div>

        <article className="rounded-[32px] border border-border/80 bg-card p-6 shadow-sm lg:p-8">
          <p className="text-sm text-muted-foreground">{featuredPost.date}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">{featuredPost.title}</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{featuredPost.excerpt}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Featured editorial
            <ArrowRight className="size-4" />
          </p>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {otherPosts.map((post) => (
          <article key={post.slug} className="rounded-[28px] border border-border/80 bg-card p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">{post.date}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{post.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
            <p className="mt-6 text-sm font-semibold text-primary">Editorial archive</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
