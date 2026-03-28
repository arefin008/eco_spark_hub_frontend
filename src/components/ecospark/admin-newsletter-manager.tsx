"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/helpers";
import { newsletterService } from "@/services/newsletter.service";

export function AdminNewsletterManager() {
  const queryClient = useQueryClient();
  const newslettersQuery = useQuery({
    queryKey: ["admin-newsletters"],
    queryFn: newsletterService.list,
  });

  const unsubscribeMutation = useMutation({
    mutationFn: newsletterService.unsubscribe,
    onSuccess: async () => {
      toast.success("Newsletter subscriber removed.");
      await queryClient.invalidateQueries({ queryKey: ["admin-newsletters"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <div className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Newsletter subscribers
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review current subscribers and unsubscribe addresses directly from the admin area.
        </p>
      </div>

      <div className="grid gap-4">
        {(newslettersQuery.data ?? []).map((subscriber) => (
          <article
            key={subscriber.id}
            className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">{subscriber.email}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Subscribed {formatDate(subscriber.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                disabled={unsubscribeMutation.isPending}
                onClick={() => unsubscribeMutation.mutate(subscriber.email)}
              >
                <Trash2 className="size-4" />
                Unsubscribe
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
