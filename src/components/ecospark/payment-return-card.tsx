"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/ecospark/page-shell";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { paymentService } from "@/services/payment.service";

export function PaymentReturnCard({
  purchaseId,
  status,
}: {
  purchaseId?: string;
  status: "success" | "cancel";
}) {
  const purchaseQuery = useQuery({
    queryKey: ["payment-status", purchaseId],
    queryFn: () => paymentService.status(purchaseId as string),
    enabled: Boolean(purchaseId),
  });

  const purchase = purchaseQuery.data;
  const title =
    status === "success" ? "Payment completed" : "Payment was not completed";
  const description =
    status === "success"
      ? "Your payment has been recorded. You can now reopen the purchased idea or review your purchases."
      : "You can return to the idea and try checkout again later, or review your purchases from the dashboard.";

  return (
    <PageShell className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-border/80 bg-card p-6 shadow-sm sm:p-8">
        <div
          className={cn(
            "inline-flex size-14 items-center justify-center rounded-2xl",
            status === "success"
              ? "bg-primary/12 text-primary"
              : "bg-amber-500/12 text-amber-700",
          )}
        >
          {status === "success" ? (
            <CheckCircle2 className="size-7" />
          ) : (
            <AlertCircle className="size-7" />
          )}
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>

        {purchase ? (
          <div className="mt-6 rounded-[24px] border border-border/70 bg-background/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Purchase details
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{purchase.idea.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {purchase.status} • {formatCurrency(purchase.amount, purchase.currency)}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {purchase?.idea.id ? (
            <Link
              href={`/ideas/${purchase.idea.id}`}
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-2xl px-4")}
            >
              Open Purchased Idea
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
          <Link
            href="/dashboard/member/purchases"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-2xl px-4")}
          >
            View Purchases
          </Link>
          <Link
            href="/ideas"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "rounded-2xl px-4")}
          >
            Browse Ideas
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
