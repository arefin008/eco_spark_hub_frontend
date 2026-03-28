"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeDollarSign, Lock, ShieldCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { CommentThread } from "@/components/ecospark/comment-thread";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { formatCurrency, formatDate, ideaHasAccess } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { ideaService } from "@/services/idea.service";
import { purchaseService } from "@/services/purchase.service";
import { voteService } from "@/services/vote.service";

export function IdeaDetailsClient({ ideaId }: { ideaId: string }) {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const ideaQuery = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: () => ideaService.byId(ideaId),
  });

  const voteMutation = useMutation({
    mutationFn: ({ type }: { type: "UPVOTE" | "DOWNVOTE" }) =>
      voteService.upsert(ideaId, type),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const removeVoteMutation = useMutation({
    mutationFn: () => voteService.remove(ideaId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["idea", ideaId] });
      await queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const purchaseMutation = useMutation({
    mutationFn: () => purchaseService.create(ideaId),
    onSuccess: (data) => {
      window.location.href = data.payment.checkoutUrl;
    },
    onError: (error) => toast.error(error.message),
  });

  if (ideaQuery.isLoading) {
    return <div className="py-16 text-center text-muted-foreground">Loading idea details...</div>;
  }

  if (ideaQuery.isError || !ideaQuery.data) {
    return <div className="py-16 text-center text-destructive">Failed to load this idea.</div>;
  }

  const idea = ideaQuery.data;

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] border border-border/80 bg-card p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-secondary px-3 py-1 font-medium">
            {idea.category.name}
          </span>
          {idea.isPaid ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/18 px-3 py-1 font-medium text-accent-foreground">
              <BadgeDollarSign className="size-3" />
              {formatCurrency(idea.price)}
            </span>
          ) : (
            <span className="rounded-full bg-primary/12 px-3 py-1 font-medium text-primary">
              Free idea
            </span>
          )}
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
          {idea.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted-foreground">
          <span>By {idea.author.name}</span>
          <span>Published {formatDate(idea.createdAt)}</span>
          {"status" in idea ? <span>Status: {idea.status}</span> : null}
        </div>

        {ideaHasAccess(idea) ? (
          <>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="rounded-[28px] bg-secondary/50 p-5 lg:col-span-1">
                <h2 className="font-semibold">Interaction</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => voteMutation.mutate({ type: "UPVOTE" })}
                    disabled={!currentUser || voteMutation.isPending}
                  >
                    <ThumbsUp className="size-4 text-primary" />
                    {idea.upvotes}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => voteMutation.mutate({ type: "DOWNVOTE" })}
                    disabled={!currentUser || voteMutation.isPending}
                  >
                    <ThumbsDown className="size-4 text-rose-600" />
                    {idea.downvotes}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => removeVoteMutation.mutate()}
                    disabled={!currentUser || removeVoteMutation.isPending}
                  >
                    Remove vote
                  </Button>
                </div>
              </div>
              <div className="rounded-[28px] bg-secondary/50 p-5 lg:col-span-2">
                <h2 className="font-semibold">Idea summary</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {idea.description}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <section className="rounded-[28px] border border-border/80 p-6 lg:col-span-1">
                <h2 className="text-xl font-semibold">Problem Statement</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {idea.problemStatement}
                </p>
              </section>
              <section className="rounded-[28px] border border-border/80 p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold">Proposed Solution</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {idea.proposedSolution}
                </p>
              </section>
            </div>

            {currentUser?.role === "ADMIN" ? (
              <div className="mt-8 rounded-[28px] border border-primary/20 bg-primary/6 p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 text-primary" />
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold">Admin moderation</h2>
                    <p className="text-sm text-muted-foreground">
                      Review actions are available on this idea from the admin dashboard.
                    </p>
                    <Link
                      href="/dashboard/admin/ideas"
                      className={cn(buttonVariants({ variant: "outline" }))}
                    >
                      Open review panel
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-8 rounded-[32px] border border-accent/35 bg-accent/12 p-8 text-foreground">
            <div className="flex items-start gap-4">
              <Lock className="mt-1 size-6" />
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold">Premium idea access required</h2>
                  <p className="mt-2 text-sm leading-7">
                    {idea.lockReason}. Complete checkout to unlock the full proposal.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentUser ? (
                    <Button onClick={() => purchaseMutation.mutate()} disabled={purchaseMutation.isPending}>
                      {purchaseMutation.isPending ? "Redirecting..." : "Purchase with Stripe"}
                    </Button>
                  ) : (
                    <Link href="/login" className={cn(buttonVariants({ variant: "default" }))}>
                      Login to Purchase
                    </Link>
                  )}
                  <Link href="/ideas" className={cn(buttonVariants({ variant: "outline" }))}>
                    Browse other ideas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {ideaHasAccess(idea) ? <CommentThread ideaId={ideaId} /> : null}
    </div>
  );
}
