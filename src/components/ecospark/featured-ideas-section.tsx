"use client";

import { useQuery } from "@tanstack/react-query";

import { IdeaCard } from "@/components/ecospark/idea-card";
import { ideaService } from "@/services/idea.service";

function FeaturedIdeaSkeleton() {
  return (
    <article className="ui-surface h-full p-5 sm:p-6">
      <div className="animate-pulse space-y-6">
        <div className="flex gap-2">
          <div className="h-6 w-24 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-7 w-4/5 rounded-xl bg-muted" />
          <div className="h-4 w-full rounded-xl bg-muted" />
          <div className="h-4 w-11/12 rounded-xl bg-muted" />
          <div className="h-4 w-3/4 rounded-xl bg-muted" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-28 rounded-xl bg-muted" />
          <div className="h-4 w-20 rounded-xl bg-muted" />
        </div>
        <div className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <div className="h-4 w-12 rounded-xl bg-muted" />
              <div className="h-4 w-12 rounded-xl bg-muted" />
              <div className="h-4 w-12 rounded-xl bg-muted" />
            </div>
            <div className="h-10 w-full rounded-full bg-muted sm:w-32" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function FeaturedIdeasSection() {
  const featuredIdeasQuery = useQuery({
    queryKey: ["ideas", "featured-home"],
    queryFn: () => ideaService.list({ limit: 4, sortBy: "TOP_VOTED" }),
  });

  const featuredIdeas = featuredIdeasQuery.data?.data ?? [];

  if (featuredIdeasQuery.isLoading) {
    return (
      <div className="grid auto-rows-fr gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <FeaturedIdeaSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!featuredIdeas.length) {
    return (
      <div className="ui-surface border-dashed p-6 text-sm text-muted-foreground sm:p-8">
        Featured ideas are temporarily unavailable. Once the API is reachable, this section will show approved ideas again.
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr gap-4 lg:grid-cols-4">
      {featuredIdeas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
}
