"use client";

import Link from "next/link";

import { useCurrentUser } from "@/hooks/use-current-user";
import { adminDashboardLinks, memberDashboardLinks } from "@/lib/routes";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: currentUser } = useCurrentUser();
  const links =
    currentUser?.role === "ADMIN" ? adminDashboardLinks : memberDashboardLinks;

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-border bg-sidebar px-6 py-8 lg:border-r lg:border-b-0">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
              EcoSpark Hub
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {currentUser ? `${currentUser.role.toLowerCase()} workspace` : "Sign in required"}
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 bg-background">{children}</div>
    </div>
  );
}
