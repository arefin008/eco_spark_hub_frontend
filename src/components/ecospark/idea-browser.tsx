"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { startTransition, useDeferredValue, useState } from "react";

import { IdeaCard } from "@/components/ecospark/idea-card";
import { Button } from "@/components/ui/button";
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
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const categoriesQuery = useQuery({
    queryKey: ["categories", "browser"],
    queryFn: () => categoryService.list({ limit: 100 }),
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

  return (
    <div className="mt-8 grid gap-6 xl:mt-10 xl:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-[24px] border border-border/80 bg-card p-5 shadow-sm sm:rounded-[28px] sm:p-6">
        <h2 className="text-xl font-semibold">Search and Filter</h2>

        <div className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Keyword</span>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(event) =>
                  startTransition(() => {
                    setSearchTerm(event.target.value);
                    setPage(1);
                  })
                }
                placeholder="Search by title or idea summary"
                className="h-12 w-full bg-transparent outline-none"
              />
            </div>
          </label>

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
            <span className="text-sm font-medium">Payment</span>
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
        <div className="flex flex-col gap-2 rounded-[24px] border border-border/80 bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[28px] sm:px-6">
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

        <div className="flex flex-col gap-3 rounded-[24px] border border-border/80 bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-[28px] sm:px-6">
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
  );
}
