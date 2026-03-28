"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { formatCurrency, formatDate } from "@/lib/helpers";
import { purchaseService } from "@/services/purchase.service";

export function PurchasesPanel() {
  const purchasesQuery = useQuery({
    queryKey: ["purchases", "mine"],
    queryFn: purchaseService.mine,
  });

  return (
    <div className="space-y-4 px-4 py-8 sm:px-6 lg:px-10">
      <div className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Purchased ideas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track premium idea payments and revisit purchased access.
        </p>
      </div>

      {(purchasesQuery.data ?? []).map((purchase) => (
        <article key={purchase.id} className="rounded-[24px] border border-border/80 bg-card p-5 sm:rounded-[28px] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold sm:text-2xl">{purchase.idea.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {purchase.status} • {formatCurrency(purchase.amount, purchase.currency)} •{" "}
                {formatDate(purchase.createdAt)}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <Link href={`/ideas/${purchase.idea.id}`} className="text-sm font-semibold text-primary">
                Open idea
              </Link>
              <Link
                href={`/dashboard/member/purchases/${purchase.id}`}
                className="text-sm font-semibold text-primary"
              >
                View payment status
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
