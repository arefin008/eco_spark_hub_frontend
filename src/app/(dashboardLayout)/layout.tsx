"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  UserCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/ecospark/auth-guard";
import { ProfileDropdown } from "@/components/ecospark/profile-dropdown";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { completeClientLogout } from "@/lib/client-auth";
import { adminDashboardLinks, memberDashboardLinks } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";
import type { UserRole } from "@/types/domain";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const links = currentUser?.role === "ADMIN" ? adminDashboardLinks : memberDashboardLinks;
  const allowedRoles: UserRole[] | undefined = pathname.startsWith("/dashboard/admin")
    ? ["ADMIN"]
    : pathname.startsWith("/dashboard/member")
      ? ["MEMBER"]
      : undefined;
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      await completeClientLogout(queryClient, router, "/login");
      toast.success("Logged out.");
    },
    onError: (error) => toast.error(error.message),
  });

  const activeItem = useMemo(() => {
    const allLinks = [
      ...adminDashboardLinks,
      ...memberDashboardLinks,
      { href: "/my-profile", label: "Profile", icon: UserCircle2 },
    ];

    return allLinks
      .filter((item, index, self) => self.findIndex((entry) => entry.href === item.href) === index)
      .sort((left, right) => right.href.length - left.href.length)
      .find((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));
  }, [pathname]);



  const isProfileActive = pathname === "/my-profile";
  const workspaceLabel = currentUser?.role === "ADMIN" ? "Admin workspace" : "Member workspace";

  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <div
        className={cn(
          "grid min-h-screen bg-background",
          desktopCollapsed ? "lg:grid-cols-[92px_1fr]" : "lg:grid-cols-[300px_1fr]",
        )}
      >
        {mobileSidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
            aria-label="Close dashboard sidebar overlay"
            onClick={() => setMobileSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[285px] border-r border-border/70 bg-sidebar/96 px-4 py-5 backdrop-blur-xl transition-transform duration-200 sm:px-6 sm:py-8 lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 lg:border-b-0",
            "lg:transition-[width,padding] lg:duration-200",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
            desktopCollapsed && "lg:w-[92px] lg:px-3",
          )}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-4 right-4 rounded-full lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close dashboard sidebar"
          >
            <X className="size-4" />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            className="absolute top-8 -right-3.5 z-10 hidden rounded-full lg:inline-flex"
            onClick={() => setDesktopCollapsed((value) => !value)}
            aria-label={desktopCollapsed ? "Expand dashboard sidebar" : "Collapse dashboard sidebar"}
          >
            {desktopCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>

          <div className="flex min-h-full flex-col gap-8">
            <div
              className={cn(
                "w-full rounded-[24px] border border-border/70 bg-background/72 p-4 shadow-sm sm:rounded-[30px] sm:p-5",
                desktopCollapsed && "lg:flex lg:justify-center lg:px-0 lg:py-4",
              )}
            >
              {desktopCollapsed ? (
                <span className="hidden text-xl font-semibold tracking-tight lg:block">E</span>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                    EcoSpark Hub
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {currentUser ? workspaceLabel : "Sign in required"}
                  </p>
                </>
              )}
            </div>

            <nav className="grid gap-2 text-sm sm:flex sm:flex-col">
              {links.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-2xl px-4 py-3 text-muted-foreground transition hover:bg-secondary hover:text-foreground",
                      desktopCollapsed && "lg:justify-center lg:px-0",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                    )}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className={cn(desktopCollapsed && "lg:hidden")}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto px-4 lg:px-0">
              <ProfileDropdown 
                side="top" 
                align="start" 
                compact={desktopCollapsed} 
                className={cn("w-full py-3", desktopCollapsed && "lg:bg-transparent lg:border-transparent lg:shadow-none lg:hover:bg-secondary lg:justify-center")}
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
            <div className="flex min-h-18 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="rounded-full lg:hidden"
                  onClick={() => setMobileSidebarOpen((value) => !value)}
                  aria-expanded={mobileSidebarOpen}
                  aria-label={mobileSidebarOpen ? "Close dashboard sidebar" : "Open dashboard sidebar"}
                >
                  {mobileSidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                </Button>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold uppercase tracking-[0.28em] text-primary">
                    {workspaceLabel}
                  </p>
                  <div className="mt-1 flex min-w-0 items-center gap-2">
                    <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                      {activeItem?.label ?? "Dashboard"}
                    </h1>
                    {pathname !== "/dashboard" ? (
                      <span className="hidden text-sm text-muted-foreground sm:inline">
                        / dashboard
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
