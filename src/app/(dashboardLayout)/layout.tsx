"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AuthGuard } from "@/components/ecospark/auth-guard";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { adminDashboardLinks, memberDashboardLinks } from "@/lib/routes";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const links =
    currentUser?.role === "ADMIN" ? adminDashboardLinks : memberDashboardLinks;
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Logged out.");
      router.push("/");
    },
    onError: (error) => toast.error(error.message),
  });
  const isProfileActive = pathname === "/my-profile";

  return (
    <AuthGuard>
      <div
        className={cn(
          "grid min-h-screen",
          desktopCollapsed ? "lg:grid-cols-[92px_1fr]" : "lg:grid-cols-[300px_1fr]",
        )}
      >
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border/70 bg-background/92 px-4 py-3 backdrop-blur lg:hidden">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">EcoSpark Hub Dashboard</p>
            <p className="text-xs text-muted-foreground">
              {currentUser ? `${currentUser.role.toLowerCase()} workspace` : "Navigation"}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => setMobileSidebarOpen((value) => !value)}
            aria-expanded={mobileSidebarOpen}
            aria-label={mobileSidebarOpen ? "Close dashboard sidebar" : "Open dashboard sidebar"}
          >
            {mobileSidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>

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
            "fixed inset-y-0 left-0 z-40 w-[285px] border-r border-border/70 bg-sidebar/96 px-4 py-5 backdrop-blur-xl transition-transform duration-200 sm:px-6 sm:py-8 lg:relative lg:w-auto lg:translate-x-0 lg:border-b-0",
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

          <div className="flex h-full flex-col gap-8">
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
                    {currentUser ? `${currentUser.role.toLowerCase()} workspace` : "Sign in required"}
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

            <div
              className={cn(
                "mt-auto rounded-[24px] border border-border/70 bg-background/90 p-3 shadow-sm sm:rounded-[28px] sm:p-4",
                desktopCollapsed && "lg:px-2 lg:py-2.5",
              )}
            >
              <Link
                href="/my-profile"
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-3 py-3 transition hover:border-primary/20 hover:bg-secondary/45",
                  desktopCollapsed && "lg:justify-center lg:border-transparent lg:bg-transparent lg:px-0 lg:py-2",
                  isProfileActive && "border-primary/15 bg-secondary/60",
                )}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_16%,white),color-mix(in_oklab,var(--secondary)_86%,white))] text-primary">
                  <UserCircle2 className="size-5" />
                </div>
                <div className={cn("min-w-0 flex-1", desktopCollapsed && "lg:hidden")}>
                  <p className="text-sm font-semibold text-foreground">
                    {currentUser?.name ?? "Account"}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
                    {currentUser?.email ?? "Signed in user"}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground",
                    desktopCollapsed && "lg:hidden",
                  )}
                />
              </Link>

              <div className={cn("mt-3 border-t border-border/70 pt-3", desktopCollapsed && "lg:mt-2 lg:border-t-0 lg:pt-0")}>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-11 w-full justify-start rounded-2xl px-4 text-muted-foreground hover:bg-destructive/8 hover:text-destructive",
                    desktopCollapsed && "lg:justify-center lg:px-0",
                  )}
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="size-4" />
                  <span className={cn(desktopCollapsed && "lg:hidden")}>
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <div className="min-w-0 bg-background">{children}</div>
      </div>
    </AuthGuard>
  );
}
