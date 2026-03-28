"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDate, ideaHasAccess } from "@/lib/helpers";
import { ideaService } from "@/services/idea.service";

export function AdminIdeaReview() {
  const [ideaId, setIdeaId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const publicIdeasQuery = useQuery({
    queryKey: ["ideas", "admin-public"],
    queryFn: () => ideaService.list({ page: 1, limit: 12, sortBy: "RECENT" }),
  });
  const targetIdeaQuery = useQuery({
    queryKey: ["admin-idea", selectedId],
    queryFn: () => ideaService.byId(selectedId),
    enabled: Boolean(selectedId),
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      action,
      reason,
    }: {
      action: "APPROVE" | "REJECT";
      reason?: string;
    }) =>
      ideaService.review(selectedId, {
        action,
        rejectionReason: reason,
      }),
    onSuccess: async () => {
      toast.success("Idea review submitted.");
      await targetIdeaQuery.refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <div className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin idea review</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          The backend exposes review actions by idea ID but does not currently expose a
          dedicated admin listing endpoint for under-review or rejected ideas. This panel
          lets you fetch any idea by ID and review it directly.
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setSelectedId(ideaId.trim());
          }}
        >
          <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-4">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={ideaId}
              onChange={(event) => setIdeaId(event.target.value)}
              placeholder="Paste an idea ID"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <Button type="submit">Fetch Idea</Button>
        </form>
      </div>

      {targetIdeaQuery.data && ideaHasAccess(targetIdeaQuery.data) ? (
        <div className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            {targetIdeaQuery.data.status.replaceAll("_", " ")}
          </p>
          <h2 className="mt-2 text-3xl font-semibold">{targetIdeaQuery.data.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Submitted {formatDate(targetIdeaQuery.data.createdAt)}
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {targetIdeaQuery.data.description}
          </p>

          <textarea
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Rejection reason if rejecting"
            className="mt-5 min-h-24 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button onClick={() => reviewMutation.mutate({ action: "APPROVE" })}>
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                reviewMutation.mutate({
                  action: "REJECT",
                  reason: rejectionReason,
                })
              }
            >
              Reject
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {publicIdeasQuery.data?.data.map((idea) => (
          <article key={idea.id} className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Approved idea
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
    </div>
  );
}
