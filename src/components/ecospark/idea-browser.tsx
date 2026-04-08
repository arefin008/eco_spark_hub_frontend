"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Search, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";

import { IdeaCard } from "@/components/ecospark/idea-card";
import { Button } from "@/components/ui/button";
import {
  getCouponRecommendation,
  getPersonalizedIdeas,
  getSearchSuggestions,
  getTrendingIdeas,
} from "@/lib/ai";
import { readAiProfile, updateAiProfile } from "@/lib/ai-profile";
import { aiService } from "@/services/ai.service";
import { categoryService } from "@/services/category.service";
import { ideaService } from "@/services/idea.service";

const sortOptions = [
  { value: "RECENT", label: "Recent" },
  { value: "TOP_VOTED", label: "Top Voted" },
  { value: "MOST_COMMENTED", label: "Most Commented" },
] as const;
const PAGE_SIZE = 10;
const FILTER_FETCH_LIMIT = 100;

export function IdeaBrowser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"" | "FREE" | "PAID">("");
  const [sortBy, setSortBy] =
    useState<(typeof sortOptions)[number]["value"]>("RECENT");
  const [page, setPage] = useState(1);
  const [aiProfile, setAiProfile] = useState(() => readAiProfile());
  const [hasAskedAiSearch, setHasAskedAiSearch] = useState(false);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const categoriesQuery = useQuery({
    queryKey: ["categories", "browser"],
    queryFn: () => categoryService.list({ limit: 100 }),
  });
  const allIdeasQuery = useQuery({
    queryKey: ["ideas", "browser-ai-pool"],
    queryFn: () => ideaService.list({ page: 1, limit: 100, sortBy: "TOP_VOTED" }),
  });
  const aiSearchMutation = useMutation({
    mutationFn: (query: string) =>
      aiService.assistant({
        question: `Find the best EcoSpark Hub ideas for this search: ${query}. Summarize the strongest matches, mention whether free or paid ideas seem relevant, and suggest follow-up searches.`,
        ideas: (allIdeasQuery.data?.data ?? []).slice(0, 12).map((idea) => ({
          id: idea.id,
          title: idea.title,
          category: idea.category.name,
          isPaid: idea.isPaid,
          upvotes: idea.upvotes,
          commentCount: idea.commentCount,
          problemStatement: idea.problemStatement,
          proposedSolution: idea.proposedSolution,
          description: idea.description,
        })),
      }),
  });

  const ideasQuery = useQuery({
    queryKey: [
      "ideas",
      deferredSearchTerm,
      categoryId,
      paymentStatus,
      sortBy,
      page,
    ],
    queryFn: () =>
      ideaService.list({
        searchTerm: deferredSearchTerm,
        categoryId: categoryId || undefined,
        paymentStatus: paymentStatus || undefined,
        isPaid:
          paymentStatus === "PAID"
            ? true
            : paymentStatus === "FREE"
              ? false
              : undefined,
        sortBy,
        page: paymentStatus ? 1 : page,
        limit: paymentStatus ? FILTER_FETCH_LIMIT : PAGE_SIZE,
      }),
  });

  const filteredIdeas = (ideasQuery.data?.data ?? []).filter((idea) => {
    if (paymentStatus === "PAID") {
      return idea.isPaid;
    }

    if (paymentStatus === "FREE") {
      return !idea.isPaid;
    }

    return true;
  });
  const paginatedIdeas = paymentStatus
    ? filteredIdeas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : filteredIdeas;

  const total =
    paymentStatus === ""
      ? ideasQuery.data?.meta?.total ?? ideasQuery.data?.data.length ?? 0
      : filteredIdeas.length;
  const maxPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const suggestionPool = allIdeasQuery.data?.data ?? ideasQuery.data?.data ?? [];
  const searchSuggestions = useMemo(
    () => getSearchSuggestions(suggestionPool, searchTerm),
    [searchTerm, suggestionPool],
  );
  const trendingIdeas = useMemo(() => getTrendingIdeas(suggestionPool), [suggestionPool]);
  const personalizedIdeas = useMemo(
    () => getPersonalizedIdeas(suggestionPool, aiProfile),
    [aiProfile, suggestionPool],
  );
  const couponRecommendation = useMemo(
    () => getCouponRecommendation(suggestionPool, aiProfile),
    [aiProfile, suggestionPool],
  );

  useEffect(() => {
    if (!deferredSearchTerm && !categoryId && !paymentStatus) {
      return;
    }

    const nextProfile = updateAiProfile((profile) => ({
      ...profile,
      searchHistory: deferredSearchTerm
        ? [deferredSearchTerm, ...profile.searchHistory.filter((item) => item !== deferredSearchTerm)].slice(0, 6)
        : profile.searchHistory,
      categoryHistory: categoryId
        ? [
            categoriesQuery.data?.data.find((category) => category.id === categoryId)?.name ?? categoryId,
            ...profile.categoryHistory.filter(
              (item) =>
                item !==
                (categoriesQuery.data?.data.find((category) => category.id === categoryId)?.name ?? categoryId),
            ),
          ].slice(0, 6)
        : profile.categoryHistory,
      prefersPaid: paymentStatus === "PAID" ? true : profile.prefersPaid,
    }));

    setAiProfile(nextProfile);
  }, [categoriesQuery.data?.data, categoryId, deferredSearchTerm, paymentStatus]);

  useEffect(() => {
    if (!deferredSearchTerm.trim() || !allIdeasQuery.data?.data.length) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHasAskedAiSearch(true);
      aiSearchMutation.mutate(deferredSearchTerm.trim());
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [allIdeasQuery.data?.data, deferredSearchTerm]);

  function runAiSearch(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    setSearchTerm(normalizedQuery);
    setPage(1);
    setHasAskedAiSearch(true);
    aiSearchMutation.mutate(normalizedQuery);
  }

  return (
    <div className="mt-8 space-y-6 xl:mt-10">
      <section className="rounded-[32px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,251,247,0.98))] px-5 py-6 shadow-[0_28px_70px_-38px_rgba(15,23,42,0.28)] dark:border-emerald-500/15 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(8,28,19,0.98))] sm:px-7 sm:py-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-600/15 bg-emerald-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            <Sparkles className="size-3.5" />
            AI-Powered Search
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-4xl">
            Search EcoSpark ideas with a cleaner, smarter workflow
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Start with a broad question, then let the assistant summarize the strongest matches while the standard results stay grounded in real approved ideas.
          </p>

          <div className="mt-6 rounded-full border border-slate-200 bg-white px-3 py-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)] transition focus-within:border-emerald-600/25 focus-within:shadow-[0_22px_44px_-26px_rgba(22,163,74,0.24)] dark:border-slate-700 dark:bg-slate-900/90">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 px-2">
                <Search className="size-5 text-slate-400 dark:text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(event) =>
                    startTransition(() => {
                      setSearchTerm(event.target.value);
                      setPage(1);
                    })
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      runAiSearch(searchTerm);
                    }
                  }}
                  placeholder="Search ideas the way you would ask a search engine"
                  className="h-12 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>
              <Button
                type="button"
                onClick={() => runAiSearch(searchTerm)}
                className="h-12 rounded-full px-6"
                disabled={aiSearchMutation.isPending}
              >
                {aiSearchMutation.isPending ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {searchSuggestions.length ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {searchSuggestions.map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.label}`}
                  type="button"
                  onClick={() => runAiSearch(suggestion.label)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-600/20 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-[28px] border border-border/80 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <SlidersHorizontal className="size-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Refine results</h2>
              <p className="text-sm text-muted-foreground">Adjust the standard result set.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Category</span>
              <select
                value={categoryId}
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  setPage(1);
                }}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none"
              >
                <option value="">All categories</option>
                {categoriesQuery.data?.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Access type</span>
              <select
                value={paymentStatus}
                onChange={(event) => {
                  setPaymentStatus(event.target.value as "" | "FREE" | "PAID");
                  setPage(1);
                }}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none"
              >
                <option value="">All ideas</option>
                <option value="FREE">Free ideas</option>
                <option value="PAID">Paid ideas</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Sort</span>
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value as (typeof sortOptions)[number]["value"]);
                  setPage(1);
                }}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </aside>

        <section className="space-y-5">
          {hasAskedAiSearch && deferredSearchTerm.trim() ? (
            <div className="rounded-[28px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(22,163,74,0.06),rgba(255,255,255,0.94))] p-5 shadow-sm dark:border-emerald-500/15 dark:bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(15,23,42,0.96))] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    <Sparkles className="size-3.5" />
                    AI Search Overview
                  </p>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                    Results for "{deferredSearchTerm}"
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                    {aiSearchMutation.isPending
                      ? "Reviewing the strongest matches and search directions..."
                      : aiSearchMutation.data?.answer ??
                        "Use the filters below to narrow the current result set."}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-white/80 px-4 py-3 text-sm text-muted-foreground dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
                  {ideasQuery.isLoading ? "Searching..." : `${total} indexed matches`}
                </div>
              </div>

              {aiSearchMutation.data?.suggestions?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {aiSearchMutation.data.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => runAiSearch(suggestion)}
                      className="rounded-full border border-emerald-600/15 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-600/25 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/20 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

        {couponRecommendation ? (
          <div className="rounded-[24px] border border-emerald-900/10 bg-[linear-gradient(180deg,rgba(22,163,74,0.06),rgba(255,255,255,0.92))] px-5 py-4 dark:border-emerald-500/15 dark:bg-[linear-gradient(180deg,rgba(16,185,129,0.10),rgba(15,23,42,0.96))] sm:rounded-[28px] sm:px-6">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              <Sparkles className="size-3.5" />
              Offer Insight
            </p>
            <p className="mt-2 text-sm leading-7 text-foreground">{couponRecommendation.message}</p>
          </div>
        ) : null}

        {trendingIdeas.length ? (
          <div className="rounded-[24px] border border-border/80 bg-card px-5 py-5 shadow-sm sm:rounded-[28px] sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  <TrendingUp className="size-3.5" />
                  Trending searches
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fast entry points based on traction across approved ideas.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {trendingIdeas.map((idea) => (
                <button
                  key={idea.id}
                  type="button"
                  onClick={() => runAiSearch(idea.title)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {idea.title}
                  <ArrowUpRight className="size-3.5" />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {personalizedIdeas.length ? (
          <div className="space-y-3 rounded-[24px] border border-border/80 bg-card px-5 py-5 shadow-sm sm:rounded-[28px] sm:px-6">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                <Sparkles className="size-3.5" />
                Personalized matches
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Suggested from your recent search intent, categories, and access preferences.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {personalizedIdeas.slice(0, 2).map((idea) => (
                <IdeaCard key={`recommended-${idea.id}`} idea={idea} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 rounded-[24px] border border-border/80 bg-card px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[28px] sm:px-6">
          <p className="text-sm text-muted-foreground">
            {ideasQuery.isLoading
              ? "Loading ideas..."
              : `Showing ${paginatedIdeas.length} ideas across ${total} results`}
          </p>
          <p className="text-sm text-muted-foreground">Page {page} of {maxPages}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {paginatedIdeas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>

        {!ideasQuery.isLoading && !filteredIdeas.length ? (
          <div className="rounded-[24px] border border-dashed border-border px-5 py-10 text-center text-muted-foreground sm:rounded-[28px] sm:px-6 sm:py-12">
            No approved ideas matched your filters.
          </div>
        ) : null}

        <div className="flex flex-col gap-3 rounded-[24px] border border-border/80 bg-card px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[28px] sm:px-6">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page >= maxPages}
            onClick={() => setPage((value) => value + 1)}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
        </section>
      </div>
    </div>
  );
}
