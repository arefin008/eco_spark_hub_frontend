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
    <div className="space-y-4 px-6 py-10 lg:px-10">
      <div className="rounded-[28px] border border-border/80 bg-card p-6">
        <h1 className="text-3xl font-semibold tracking-tight">Purchased ideas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Track premium idea payments and revisit purchased access.
        </p>
      </div>

      {(purchasesQuery.data ?? []).map((purchase) => (
        <article key={purchase.id} className="rounded-[28px] border border-border/80 bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{purchase.idea.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {purchase.status} • {formatCurrency(purchase.amount, purchase.currency)} •{" "}
                {formatDate(purchase.createdAt)}
              </p>
            </div>
            <Link href={`/ideas/${purchase.idea.id}`} className="text-sm font-semibold text-primary">
              Open idea
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
