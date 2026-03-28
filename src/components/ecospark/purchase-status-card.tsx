"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { paymentService } from "@/services/payment.service";

export function PurchaseStatusCard({ purchaseId }: { purchaseId: string }) {
  const purchaseQuery = useQuery({
    queryKey: ["purchase-status-page", purchaseId],
    queryFn: () => paymentService.status(purchaseId),
  });

  if (purchaseQuery.isLoading) {
    return <div className="px-4 py-8 text-muted-foreground sm:px-6 lg:px-10">Loading purchase...</div>;
  }

  if (!purchaseQuery.data) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-[28px] border border-border/80 bg-card p-8">
          <h1 className="text-3xl font-semibold">Purchase not found</h1>
        </div>
      </div>
    );
  }

  const purchase = purchaseQuery.data;

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Purchase status
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {purchase.idea.title}
          </h1>
        </div>
        <Link
          href="/dashboard/member/purchases"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl px-4")}
        >
          Back to Purchases
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[28px] border border-border/80 bg-card p-6">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <CreditCard className="size-6" />
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Status</p>
          <p className="mt-1 text-3xl font-semibold">{purchase.status}</p>
          <p className="mt-5 text-sm text-muted-foreground">Amount</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatCurrency(purchase.amount, purchase.currency)}
          </p>
          <p className="mt-5 text-sm text-muted-foreground">Purchased</p>
          <p className="mt-1 font-medium">{formatDate(purchase.createdAt)}</p>
        </div>

        <div className="rounded-[28px] border border-border/80 bg-card p-6">
          <p className="text-sm text-muted-foreground">Provider</p>
          <p className="mt-1 text-xl font-semibold">{purchase.paymentProvider}</p>
          {purchase.transactionId ? (
            <>
              <p className="mt-5 text-sm text-muted-foreground">Transaction ID</p>
              <p className="mt-1 break-all font-medium">{purchase.transactionId}</p>
            </>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/ideas/${purchase.idea.id}`}
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-2xl px-4")}
            >
              Open Idea
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
