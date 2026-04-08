"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronDown,
  LogOut,
  Menu,
  SquarePen,
  UserCircle2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/ecospark/theme-toggle";
import { BrandMark } from "@/components/shared/brand-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { completeClientLogout } from "@/lib/client-auth";
import {
  adminProfileLinks,
  authenticatedNavLinks,
  memberProfileLinks,
  publicNavLinks,
  resourceNavLinks,
} from "@/lib/routes";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function DesktopMenu({
  label,
  items,
  active,
  open,
  onToggle,
  onClose,
}: {
  label: string;
  items: Array<{ href: string; label: string }>;
  active: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          "h-auto rounded-full px-4 py-2 text-sm font-medium",
          active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
        onClick={onToggle}
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={cn("size-4 transition", open ? "rotate-180" : "")} />
      </Button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.75rem)] z-50 min-w-56 ui-surface p-2">
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="rounded-2xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser({ skipRefresh: true });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const primaryLinks = currentUser ? authenticatedNavLinks : publicNavLinks;
  const profileLinks = currentUser
    ? currentUser.role === "ADMIN"
      ? adminProfileLinks
      : memberProfileLinks
    : [];

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setResourcesOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      setMobileOpen(false);
      setProfileOpen(false);
      await completeClientLogout(queryClient, router, "/");
      toast.success("Logged out.");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <>
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/92 backdrop-blur-xl"
    >
      <div className="w-full bg-[linear-gradient(90deg,color-mix(in_srgb,var(--primary)_8%,transparent),transparent_22%,transparent_78%,color-mix(in_srgb,var(--secondary)_10%,transparent))]">
        <div className="ui-shell flex max-w-7xl items-center gap-3 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <BrandMark className="size-10 sm:size-11" glyphClassName="size-5 sm:size-[1.35rem]" />
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-tight sm:text-base">
                EcoSpark Hub
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Sustainable ideas portal
              </p>
            </div>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 rounded-full border border-border/70 bg-card/92 p-1 xl:flex">
            {primaryLinks.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive}
                />
              );
            })}

            <DesktopMenu
              label="Resources"
              items={resourceNavLinks}
              active={resourceNavLinks.some((item) => pathname.startsWith(item.href))}
              open={resourcesOpen}
              onToggle={() => {
                setResourcesOpen((value) => !value);
                setProfileOpen(false);
              }}
              onClose={() => setResourcesOpen(false)}
            />
          </nav>

          <div className="ml-auto hidden items-center gap-2 xl:flex">
            <ThemeToggle />

            {currentUser ? (
              <>
                {currentUser.role === "MEMBER" ? (
                  <Link
                    href="/dashboard/member/ideas/new"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "hidden rounded-full px-4 xl:inline-flex",
                    )}
                  >
                    <SquarePen className="size-4" />
                    Create Idea
                  </Link>
                ) : null}

                <div className="relative">
                  <Button
                    variant="outline"
                    className="rounded-full px-3.5"
                    onClick={() => {
                      setProfileOpen((value) => !value);
                      setResourcesOpen(false);
                    }}
                    aria-expanded={profileOpen}
                  >
                    <UserCircle2 className="size-4" />
                    {currentUser.name.split(" ")[0]}
                    <ChevronDown className={cn("size-4 transition", profileOpen ? "rotate-180" : "")} />
                  </Button>

                  {profileOpen ? (
                    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 min-w-64 ui-surface p-2">
                      <div className="rounded-2xl bg-muted/35 px-4 py-3">
                        <p className="truncate text-sm font-semibold">{currentUser.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
                      </div>

                      <div className="mt-2 flex flex-col gap-1">
                        {profileLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="rounded-2xl px-4 py-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-2 border-t border-border/70 pt-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start rounded-2xl px-4"
                          onClick={() => logoutMutation.mutate()}
                          disabled={logoutMutation.isPending}
                        >
                          <LogOut className="size-4" />
                          {logoutMutation.isPending ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "default" }), "rounded-full px-4")}
                >
                  Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-4")}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ variant: "default" }), "rounded-full px-4")}
                >
                  Join now
                </Link>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2 xl:hidden">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

      </div>
    </header>

    {mobileOpen ? (
      <div className="fixed inset-0 z-50 xl:hidden">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[18rem] overflow-y-auto border-l border-border bg-background shadow-2xl sm:max-w-sm">
          <div className="flex h-[3.75rem] items-center justify-between border-b border-border/70 px-5">
            <div className="flex items-center gap-2">
              <BrandMark className="size-7" glyphClassName="size-[14px]" />
              <span className="text-[15px] font-semibold text-foreground">EcoSpark Hub</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="p-4">
            <nav className="flex flex-col gap-1">
              {primaryLinks.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-[15px] font-medium transition",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 border-t border-border/70 pt-5">
              <p className="px-4 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Resources
              </p>
              <div className="mt-2 grid gap-1">
                {resourceNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-4 py-3 text-[15px] font-medium text-muted-foreground transition hover:bg-muted/50 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-border/70 pt-5">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-muted/35 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">{currentUser.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>

                  <div className="grid gap-1">
                    {profileLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-11 w-full justify-between rounded-full px-4",
                        )}
                      >
                        {item.label}
                        <ArrowRight className="size-4" />
                      </Link>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="h-11 w-full justify-start rounded-full px-4"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="size-4" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 justify-center rounded-full px-4",
                    )}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-11 justify-center rounded-full px-4",
                    )}
                  >
                    Join now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
