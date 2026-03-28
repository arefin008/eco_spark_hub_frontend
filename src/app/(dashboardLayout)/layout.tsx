"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthGuard } from "@/components/ecospark/auth-guard";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { adminDashboardLinks, memberDashboardLinks } from "@/lib/routes";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const links =
    currentUser?.role === "ADMIN" ? adminDashboardLinks : memberDashboardLinks;

  return (
    <AuthGuard>
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-border/70 bg-sidebar/88 px-6 py-8 backdrop-blur-xl lg:border-r lg:border-b-0">
          <div className="space-y-8">
            <div className="rounded-[30px] border border-border/70 bg-background/72 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                EcoSpark Hub
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {currentUser ? `${currentUser.role.toLowerCase()} workspace` : "Sign in required"}
              </p>
            </div>

            <nav className="flex flex-col gap-2 text-sm">
              {links.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="min-w-0 bg-background">{children}</div>
      </div>
    </AuthGuard>
  );
}
