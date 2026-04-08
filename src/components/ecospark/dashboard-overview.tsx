"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  FileText,
  ShoppingBag,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getAdminAiInsights, getMemberAiInsights, getTopIdeaCategory } from "@/lib/ai";
import { formatCurrency, formatCurrencyParts, formatDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/admin.service";
import { ideaService } from "@/services/idea.service";
import { purchaseService } from "@/services/purchase.service";

type OverviewRow = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  metric: string;
  createdAt: string;
  href: string;
};

const chartPalette = ["var(--color-primary)", "var(--color-secondary)", "var(--color-accent)", "#ef4444"];

function groupByMonth(values: string[]) {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const counts = new Map<string, number>();

  for (const value of values) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) continue;
    const key = formatter.format(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([label, total]) => ({
    label,
    total,
  }));
}

function OverviewCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-[24px] border border-border/80 bg-card p-5 shadow-sm sm:rounded-[28px] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            {value}
          </p>
        </div>
        <div className="flex size-12 shrink-0 items-center justify-center self-start rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{helper}</p>
    </article>
  );
}

function OverviewTable({
  rows,
  searchTerm,
  setSearchTerm,
  filterValue,
  setFilterValue,
}: {
  rows: OverviewRow[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const statuses = useMemo(
    () => Array.from(new Set(rows.map((row) => row.status))),
    [rows],
  );

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesQuery =
        !query ||
        row.title.toLowerCase().includes(query) ||
        row.subtitle.toLowerCase().includes(query) ||
        row.metric.toLowerCase().includes(query);
      const matchesStatus = filterValue === "ALL" || row.status === filterValue;

      return matchesQuery && matchesStatus;
    });
  }, [filterValue, rows, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section className="rounded-[28px] border border-border/80 bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border/70 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Recent activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search, filter, and page through recent dashboard records.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={searchTerm}
              onChange={(event) => {
                setPage(1);
                setSearchTerm(event.target.value);
              }}
              placeholder="Search records"
              className="ui-control h-11 min-w-0 sm:w-64"
            />
            <select
              value={filterValue}
              onChange={(event) => {
                setPage(1);
                setFilterValue(event.target.value);
              }}
              className="ui-control h-11 min-w-0 sm:w-48"
            >
              <option value="ALL">All statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/45">
            <tr>
              <th className="px-5 py-4 font-semibold sm:px-6">Title</th>
              <th className="px-5 py-4 font-semibold sm:px-6">Status</th>
              <th className="px-5 py-4 font-semibold sm:px-6">Metric</th>
              <th className="px-5 py-4 font-semibold sm:px-6">Date</th>
              <th className="px-5 py-4 font-semibold sm:px-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length ? (
              paginatedRows.map((row) => (
                <tr key={row.id} className="border-t border-border/70">
                  <td className="px-5 py-4 align-top sm:px-6">
                    <p className="font-medium text-foreground">{row.title}</p>
                    <p className="mt-1 text-muted-foreground">{row.subtitle}</p>
                  </td>
                  <td className="px-5 py-4 align-top sm:px-6">
                    <span className="rounded-full bg-secondary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top sm:px-6">{row.metric}</td>
                  <td className="px-5 py-4 align-top text-muted-foreground sm:px-6">
                    {formatDate(row.createdAt)}
                  </td>
                  <td className="px-5 py-4 align-top sm:px-6">
                    <Link href={row.href} className="font-semibold text-primary">
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground sm:px-6">
                  No rows match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-muted-foreground">
          Showing {paginatedRows.length ? (currentPage - 1) * pageSize + 1 : 0}
          {" "}-{" "}
          {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-2 text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="rounded-xl border border-border px-3 py-2 text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-border/80 bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 h-72">{children}</div>
    </section>
  );
}

function AiInsightGrid({
  heading,
  description,
  items,
}: {
  heading: string;
  description: string;
  items: Array<{ title: string; description: string; tone: "info" | "success" | "warning" }>;
}) {
  return (
    <section className="rounded-[28px] border border-emerald-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,251,247,0.98))] p-5 shadow-sm dark:border-emerald-900/50 dark:bg-[linear-gradient(180deg,rgba(7,18,14,0.96),rgba(9,30,22,0.98))] sm:p-6">
      <p className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200">
        AI Insights
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className={cn(
              "rounded-3xl border p-4",
              item.tone === "warning"
                ? "border-amber-300/50 bg-amber-500/10 dark:border-amber-500/35 dark:bg-amber-500/12"
                : item.tone === "success"
                  ? "border-emerald-300/40 bg-emerald-500/10 dark:border-emerald-500/35 dark:bg-emerald-500/12"
                  : "border-border/80 bg-background/70 dark:border-slate-700/80 dark:bg-slate-900/70",
            )}
          >
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DashboardOverview() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("ALL");

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
    staleTime: 0,
    refetchOnMount: "always",
  });
  const adminIdeasQuery = useQuery({
    queryKey: ["ideas", "admin-overview"],
    queryFn: () => ideaService.list({ page: 1, limit: 100, sortBy: "RECENT" }),
    enabled: currentUser?.role === "ADMIN",
    staleTime: 0,
  });
  const adminUsersQuery = useQuery({
    queryKey: ["admin-users", "overview"],
    queryFn: () => adminService.users({ page: 1, limit: 100 }),
    enabled: currentUser?.role === "ADMIN",
    staleTime: 0,
  });

  if (isLoading) {
    return <div className="px-4 py-6 text-muted-foreground sm:px-6 sm:py-8 lg:px-8">Loading dashboard...</div>;
  }

  if (!currentUser) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-[28px] border border-border bg-card p-8">
          <h1 className="text-3xl font-semibold">Dashboard access</h1>
          <p className="mt-3 text-muted-foreground">Sign in to open your member or admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (currentUser.role === "ADMIN") {
    const stats = adminStatsQuery.data;
    const allIdeas = adminIdeasQuery.data?.data ?? [];
    const allUsers = adminUsersQuery.data?.data ?? [];

    if (!stats) {
      return <div className="px-4 py-6 text-muted-foreground sm:px-6 sm:py-8 lg:px-8">Loading admin overview...</div>;
    }

    const pipelineData = [
      { label: "Approved", value: stats.approvedIdeas },
      { label: "Rejected", value: stats.rejectedIdeas },
      { label: "In review", value: stats.underReviewIdeas },
      { label: "Purchases", value: stats.totalPaidPurchases },
    ];
    const roleBreakdown = [
      { name: "Members", value: allUsers.filter((user) => user.role === "MEMBER").length },
      { name: "Admins", value: allUsers.filter((user) => user.role === "ADMIN").length },
      { name: "Deactivated", value: allUsers.filter((user) => user.status === "DEACTIVATED").length },
    ].filter((item) => item.value > 0);
    const volumeTrend = groupByMonth(allIdeas.map((idea) => idea.submittedAt ?? idea.createdAt));
    const adminAiInsights = getAdminAiInsights(stats, allIdeas, allUsers);
    const topCategory = getTopIdeaCategory(allIdeas);
    const overviewRows: OverviewRow[] = allIdeas
      .slice()
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .map((idea) => ({
        id: idea.id,
        title: idea.title,
        subtitle: `${idea.category.name} by ${idea.author.name}`,
        status: idea.status.replaceAll("_", " "),
        metric: `${idea.upvotes} votes`,
        createdAt: idea.submittedAt ?? idea.createdAt,
        href: `/ideas/${idea.id}`,
      }));

    return (
      <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Admin overview</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Platform health and moderation</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Monitor user growth, idea moderation, and premium purchases from one place.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/admin/ideas"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "justify-center rounded-2xl px-4",
              )}
            >
              Review ideas
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard/admin/users"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "justify-center rounded-2xl px-4",
              )}
            >
              Manage users
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          <OverviewCard label="Total users" value={stats.totalUsers} helper="All registered accounts across the platform." icon={Users} />
          <OverviewCard label="Ideas submitted" value={stats.totalIdeas} helper="Total sustainability ideas currently stored." icon={FileText} />
          <OverviewCard label="Awaiting review" value={stats.underReviewIdeas} helper="Items still waiting on an admin decision." icon={Shield} />
          <OverviewCard label="Paid purchases" value={stats.totalPaidPurchases} helper="Successful premium purchases recorded so far." icon={BarChart3} />
        </div>

        <AiInsightGrid
          heading="AI operational insights"
          description={`The assistant is watching moderation flow, category momentum, and account health. Strongest category signal: ${topCategory ?? "not enough data yet"}.`}
          items={adminAiInsights}
        />

        <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
          <ChartCard title="Idea pipeline" description="Moderation status and conversion into paid purchases.">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[14, 14, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="User mix" description="Role and account-state distribution from live user records.">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleBreakdown} dataKey="value" nameKey="name" innerRadius={68} outerRadius={102} paddingAngle={4}>
                  {roleBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Submission trend" description="Monthly idea volume based on current backend data.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={volumeTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="var(--color-secondary)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <OverviewTable
          rows={overviewRows}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
        />
      </div>
    );
  }

  const myIdeas = memberIdeasQuery.data ?? [];
  const myPurchases = memberPurchasesQuery.data ?? [];
  const approvedCount = myIdeas.filter((idea) => idea.status === "APPROVED").length;
  const reviewCount = myIdeas.filter((idea) => idea.status === "UNDER_REVIEW").length;
  const paidIdeas = myIdeas.filter((idea) => idea.isPaid).length;
  const totalSpend = myPurchases.reduce((sum, purchase) => sum + Number(purchase.amount), 0);
  const premiumSpend = formatCurrencyParts(totalSpend || 0);
  const ideaStatusData = [
    { label: "Draft", value: myIdeas.filter((idea) => idea.status === "DRAFT").length },
    { label: "Review", value: reviewCount },
    { label: "Approved", value: approvedCount },
    { label: "Rejected", value: myIdeas.filter((idea) => idea.status === "REJECTED").length },
  ];
  const purchaseTrend = groupByMonth(myPurchases.map((purchase) => purchase.createdAt));
  const memberAiInsights = getMemberAiInsights(myIdeas, myPurchases);
  const topCategory = getTopIdeaCategory(myIdeas);
  const ideaTypeData = [
    { name: "Free", value: myIdeas.length - paidIdeas },
    { name: "Paid", value: paidIdeas },
    { name: "Purchased", value: myPurchases.filter((purchase) => purchase.status === "PAID").length },
  ].filter((item) => item.value > 0);
  const overviewRows: OverviewRow[] = myIdeas
    .slice()
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((idea) => ({
      id: idea.id,
      title: idea.title,
      subtitle: idea.category.name,
      status: idea.status.replaceAll("_", " "),
      metric: `${idea.upvotes} votes`,
      createdAt: idea.createdAt,
      href: `/dashboard/member/ideas`,
    }));

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">Member overview</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ideas, purchases, and progress</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Track your submissions, review progress, and premium purchases without leaving the dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/member/ideas/new"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "justify-center rounded-2xl px-4",
            )}
          >
            Create idea
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/dashboard/member/purchases"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "justify-center rounded-2xl px-4",
            )}
          >
            View purchases
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <OverviewCard label="My ideas" value={myIdeas.length} helper="All idea drafts and submitted proposals." icon={FileText} />
        <OverviewCard label="Approved ideas" value={approvedCount} helper="Ideas that passed review and are now visible." icon={CheckCircle2} />
        <OverviewCard label="Under review" value={reviewCount} helper="Ideas currently waiting on moderation." icon={Shield} />
        <OverviewCard
          label="Premium spend"
          value={
            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1 leading-none">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {premiumSpend.currencyLabel}
              </span>
              <span>{premiumSpend.amount}</span>
            </span>
          }
          helper="Total from your purchase history."
          icon={CreditCard}
        />
      </div>

      <AiInsightGrid
        heading="AI coaching layer"
        description={`The assistant is projecting likely next steps from your current idea pipeline and purchase history. Strongest category signal: ${topCategory ?? "not enough history yet"}.`}
        items={memberAiInsights}
      />

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Idea status" description="Live breakdown of your idea pipeline.">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ideaStatusData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[14, 14, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Idea mix" description="Compare free ideas, paid ideas, and completed purchases.">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={ideaTypeData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={102} paddingAngle={4}>
                {ideaTypeData.map((entry, index) => (
                  <Cell key={entry.name} fill={chartPalette[index % chartPalette.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Purchase activity" description="Monthly purchase history based on your current transactions.">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={purchaseTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="var(--color-secondary)" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <OverviewTable
        rows={overviewRows}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      />

      <section className="rounded-[28px] border border-border/80 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Quick actions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Jump straight into the most common member tasks.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/member/ideas"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "justify-center rounded-2xl px-4",
              )}
            >
              <FileText className="size-4" />
              My ideas
            </Link>
            <Link
              href="/dashboard/member/purchases"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "justify-center rounded-2xl px-4",
              )}
            >
              <ShoppingBag className="size-4" />
              Purchases
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
