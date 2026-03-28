"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, FileText, Shield, ShoppingBag, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useCurrentUser } from "@/hooks/use-current-user";
import { adminService } from "@/services/admin.service";
import { ideaService } from "@/services/idea.service";
import { purchaseService } from "@/services/purchase.service";

const statIcons = {
  ideas: FileText,
  purchases: ShoppingBag,
  users: Users,
  review: Shield,
  analytics: BarChart3,
};

const adminStatCards = [
  { label: "Users", key: "totalUsers", icon: statIcons.users },
  { label: "Ideas", key: "totalIdeas", icon: statIcons.ideas },
  { label: "Under Review", key: "underReviewIdeas", icon: statIcons.review },
  { label: "Paid Purchases", key: "totalPaidPurchases", icon: statIcons.analytics },
] as const;

const memberStatCards = [
  { label: "My Ideas", icon: statIcons.ideas },
  { label: "Approved", icon: statIcons.analytics },
  { label: "Under Review", icon: statIcons.review },
  { label: "Purchases", icon: statIcons.purchases },
] as const;

export function DashboardOverview() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const memberIdeasQuery = useQuery({
    queryKey: ["ideas", "mine"],
    queryFn: ideaService.mine,
    enabled: currentUser?.role === "MEMBER",
  });
  const memberPurchasesQuery = useQuery({
    queryKey: ["purchases", "mine"],
    queryFn: purchaseService.mine,
    enabled: currentUser?.role === "MEMBER",
  });
  const adminStatsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.stats,
    enabled: currentUser?.role === "ADMIN",
  });

  if (isLoading) {
    return <div className="px-6 py-10 text-muted-foreground">Loading dashboard...</div>;
  }

  if (!currentUser) {
    return (
      <div className="px-6 py-10">
        <div className="rounded-[28px] border border-border bg-card p-8">
          <h1 className="text-3xl font-semibold">Dashboard access</h1>
          <p className="mt-3 text-muted-foreground">
            Sign in to open your member or admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (currentUser.role === "ADMIN" && adminStatsQuery.data) {
    const stats = adminStatsQuery.data;
    const chartData = [
      { label: "Approved", value: stats.approvedIdeas },
      { label: "Rejected", value: stats.rejectedIdeas },
      { label: "Review", value: stats.underReviewIdeas },
      { label: "Purchases", value: stats.totalPaidPurchases },
    ];

    return (
      <div className="space-y-8 px-6 py-10 lg:px-10">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
            Admin overview
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Moderation and platform health
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adminStatCards.map((item) => (
            <div key={item.label} className="rounded-[28px] border border-border/80 bg-card p-6">
              <item.icon className="size-5 text-primary" />
              <p className="mt-5 text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-4xl font-semibold">{stats[item.key]}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-border/80 bg-card p-6">
          <h2 className="text-2xl font-semibold">Idea pipeline</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  const myIdeas = memberIdeasQuery.data ?? [];
  const myPurchases = memberPurchasesQuery.data ?? [];
  const approvedCount = myIdeas.filter((idea) => idea.status === "APPROVED").length;
  const reviewCount = myIdeas.filter((idea) => idea.status === "UNDER_REVIEW").length;

  return (
    <div className="space-y-8 px-6 py-10 lg:px-10">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
          Member overview
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Track your ideas and premium access
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[myIdeas.length, approvedCount, reviewCount, myPurchases.length].map((value, index) => {
          const item = memberStatCards[index];

          return (
            <div key={item.label} className="rounded-[28px] border border-border/80 bg-card p-6">
              <item.icon className="size-5 text-primary" />
              <p className="mt-5 text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-4xl font-semibold">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
