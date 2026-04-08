"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/helpers";
import { adminService } from "@/services/admin.service";
import { ideaService } from "@/services/idea.service";
import type { Idea, IdeaDetail, IdeaStatus } from "@/types/domain";

function getStatusCopy(status: IdeaStatus) {
  switch (status) {
    case "UNDER_REVIEW":
      return {
        label: "Under Review",
        tone: "text-[color:var(--warning-foreground)]",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        tone: "text-destructive",
      };
    case "APPROVED":
      return {
        label: "Approved",
        tone: "text-[color:var(--success-foreground)]",
      };
    default:
      return {
        label: "Draft",
        tone: "text-slate-700",
      };
  }
}

function IdeaReviewCard({
  idea,
  rejectionReason,
  onReasonChange,
  onInspect,
  onApprove,
  onReject,
  isSubmitting,
}: {
  idea: Idea;
  rejectionReason: string;
  onReasonChange: (value: string) => void;
  onInspect: () => void;
  onApprove: () => void;
  onReject: () => void;
  isSubmitting: boolean;
}) {
  const status = getStatusCopy(idea.status);
  const canReview = idea.status === "UNDER_REVIEW" || idea.status === "REJECTED";

  return (
    <article className="ui-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${status.tone}`}>
            {status.label}
          </p>
          <h2 className="mt-2 text-xl font-semibold sm:text-2xl">{idea.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {idea.category.name} • Submitted {formatDate(idea.submittedAt ?? idea.createdAt)}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            ID: <span className="font-mono">{idea.id}</span>
          </p>
        </div>

        <Button variant="outline" onClick={onInspect}>
          <Eye className="size-4" />
          Inspect
        </Button>
      </div>

      <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">
        {idea.description}
      </p>

      {idea.rejectionReason ? (
        <p className="ui-status-error mt-4">
          Previous feedback: {idea.rejectionReason}
        </p>
      ) : null}

      {canReview ? (
        <>
          <Textarea
            value={rejectionReason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Feedback for rejection"
            className="mt-4 min-h-24"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={onApprove} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Approve"}
            </Button>
            <Button variant="outline" onClick={onReject} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Reject"}
            </Button>
          </div>
        </>
      ) : null}
    </article>
  );
}

function IdeaDetailPanel({
  idea,
  rejectionReason,
  onReasonChange,
  onApprove,
  onReject,
  isSubmitting,
}: {
  idea: IdeaDetail;
  rejectionReason: string;
  onReasonChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  isSubmitting: boolean;
}) {
  const status = "status" in idea ? getStatusCopy(idea.status) : null;
  const canReview = "status" in idea && (idea.status === "UNDER_REVIEW" || idea.status === "REJECTED");

  return (
    <Card>
      <CardHeader>
        {status ? (
          <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${status.tone}`}>
            {status.label}
          </p>
        ) : (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--warning-foreground)]">
            Limited idea payload returned
          </p>
        )}
        <CardTitle className="text-3xl">{idea.title}</CardTitle>
        <CardDescription>
          Submitted {formatDate(idea.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {"description" in idea ? (
          <div className="space-y-4">
            <p className="text-sm leading-7 text-muted-foreground">{idea.description}</p>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="ui-surface-subtle p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Problem
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {idea.problemStatement}
                </p>
              </div>
              <div className="ui-surface-subtle p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Proposed solution
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {idea.proposedSolution}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">
            The detail endpoint returned a restricted payload for this idea, but review actions can
            still be submitted from this panel.
          </p>
        )}

        {canReview ? (
          <>
            <Textarea
              value={rejectionReason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Feedback for rejection"
              className="mt-5 min-h-24"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button onClick={onApprove} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Approve"}
              </Button>
              <Button variant="outline" onClick={onReject} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Reject"}
              </Button>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AdminIdeaReview() {
  const queryClient = useQueryClient();
  const [ideaId, setIdeaId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const ideasQuery = useQuery({
    queryKey: ["ideas", "admin-review"],
    queryFn: () => ideaService.list({ page: 1, limit: 100, sortBy: "RECENT" }),
    staleTime: 0,
    refetchOnMount: "always",
  });
  const adminStatsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.stats,
    staleTime: 0,
    refetchOnMount: "always",
  });
  const targetIdeaQuery = useQuery({
    queryKey: ["admin-idea", selectedId],
    queryFn: () => ideaService.byId(selectedId),
    enabled: Boolean(selectedId),
    staleTime: 0,
  });

  const reviewableIdeas = useMemo(() => {
    return (ideasQuery.data?.data ?? []).filter(
      (idea) => idea.status === "UNDER_REVIEW" || idea.status === "REJECTED",
    );
  }, [ideasQuery.data]);

  const approvedIdeas = useMemo(() => {
    return (ideasQuery.data?.data ?? []).filter((idea) => idea.status === "APPROVED").slice(0, 6);
  }, [ideasQuery.data]);
  const underReviewCount = adminStatsQuery.data?.underReviewIdeas ?? 0;
  const reviewCountMismatch = underReviewCount > reviewableIdeas.length;

  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      action,
      reason,
    }: {
      id: string;
      action: "APPROVE" | "REJECT";
      reason?: string;
    }) =>
      ideaService.review(id, {
        action,
        rejectionReason: reason,
      }),
    onSuccess: async (_, variables) => {
      setRejectionReasons((current) => ({
        ...current,
        [variables.id]: "",
      }));
      toast.success("Idea review submitted.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ideas"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] }),
        queryClient.invalidateQueries({ queryKey: ["admin-idea"] }),
      ]);
    },
    onError: (error) => toast.error(error.message),
  });

  function setReason(id: string, value: string) {
    setRejectionReasons((current) => ({
      ...current,
      [id]: value,
    }));
  }

  function submitReview(id: string, action: "APPROVE" | "REJECT") {
    const reason = rejectionReasons[id]?.trim();

    if (action === "REJECT" && !reason) {
      toast.error("Add feedback before rejecting an idea.");
      return;
    }

    reviewMutation.mutate({
      id,
      action,
      reason,
    });
  }

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight sm:text-3xl">Admin idea review</CardTitle>
          <CardDescription>
            Review ideas that members submitted for moderation. If your backend only returns public
            ideas in the list endpoint, the manual fetch field below still lets you review by idea
            ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setSelectedId(ideaId.trim());
            }}
          >
            <label className="ui-control flex h-12 flex-1 items-center gap-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={ideaId}
                onChange={(event) => setIdeaId(event.target.value)}
                placeholder="Paste an idea ID"
                className="w-full bg-transparent outline-none"
              />
            </label>
            <Button type="submit">Fetch Idea</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void ideasQuery.refetch();
                void adminStatsQuery.refetch();
              }}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </form>
        </CardContent>
      </Card>

      {targetIdeaQuery.data ? (
        <IdeaDetailPanel
          idea={targetIdeaQuery.data}
          rejectionReason={rejectionReasons[selectedId] ?? ""}
          onReasonChange={(value) => setReason(selectedId, value)}
          onApprove={() => submitReview(selectedId, "APPROVE")}
          onReject={() => submitReview(selectedId, "REJECT")}
          isSubmitting={reviewMutation.isPending}
        />
      ) : null}

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Review queue</h2>
          <p className="text-sm text-muted-foreground">
            Ideas in under-review or rejected state can be approved or sent back with updated
            feedback from here.
          </p>
          {adminStatsQuery.data ? (
            <p className="text-sm text-muted-foreground">
              Admin stats currently report {underReviewCount} idea{underReviewCount === 1 ? "" : "s"} under review.
            </p>
          ) : null}
        </div>

        {reviewCountMismatch ? (
          <div className="ui-status-warning p-6">
            The admin overview reports {underReviewCount} under-review idea{underReviewCount === 1 ? "" : "s"},
            but the idea list returned only {reviewableIdeas.length} reviewable item{reviewableIdeas.length === 1 ? "" : "s"}.
            This usually means the backend stats endpoint and ideas listing endpoint are not returning the same dataset.
            Use the idea ID fetch above for now.
          </div>
        ) : null}

        {ideasQuery.isLoading ? (
          <div className="ui-surface p-6 text-sm text-muted-foreground">
            Loading ideas for review...
          </div>
        ) : reviewableIdeas.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {reviewableIdeas.map((idea) => (
              <IdeaReviewCard
                key={idea.id}
                idea={idea}
                rejectionReason={rejectionReasons[idea.id] ?? ""}
                onReasonChange={(value) => setReason(idea.id, value)}
                onInspect={() => {
                  setIdeaId(idea.id);
                  setSelectedId(idea.id);
                }}
                onApprove={() => submitReview(idea.id, "APPROVE")}
                onReject={() => submitReview(idea.id, "REJECT")}
                isSubmitting={reviewMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="ui-surface p-6 text-sm text-muted-foreground">
            No reviewable ideas were returned by the list endpoint. If your backend exposes pending
            ideas only by ID, use the fetch form above and review them manually.
          </div>
        )}
      </section>

      {approvedIdeas.length ? (
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Recently approved</h2>
            <p className="text-sm text-muted-foreground">
              These are already public, but the IDs remain visible for quick lookup.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {approvedIdeas.map((idea) => (
              <article
                key={idea.id}
                className="ui-surface p-5 sm:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--success-foreground)]">
                  Approved
                </p>
                <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{idea.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  ID: <span className="font-mono text-xs">{idea.id}</span>
                </p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {idea.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
