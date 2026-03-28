"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Leaf, LogOut, Menu, UserCircle2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/ecospark/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { publicNavLinks } from "@/lib/routes";
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

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const navigationLinks = publicNavLinks.filter((item) =>
    currentUser ? item.href !== "/dashboard" : true,
  );

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Logged out.");
      setOpen(false);
      router.push("/");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-5 md:px-8 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--primary),var(--secondary))] text-sm font-semibold text-white shadow-sm sm:size-11">
            <Leaf className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight sm:text-base">
              EcoSpark Hub
            </p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Sustainable ideas portal
            </p>
          </div>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 rounded-full border border-border/70 bg-card/90 p-1 lg:flex">
          {navigationLinks.map((item) => {
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
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {currentUser ? (
            <>
              <Link
                href="/my-profile"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-3.5")}
              >
                <UserCircle2 className="size-4" />
                {currentUser.name.split(" ")[0]}
              </Link>
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

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/70 bg-background/96 px-4 py-4 md:hidden">
          <div className="mx-auto max-w-7xl rounded-[24px] border border-border/70 bg-card p-3 shadow-sm">
            <nav className="flex flex-col gap-1">
              {navigationLinks.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    active={isActive}
                    onClick={() => setOpen(false)}
                  />
                );
              })}
            </nav>

            <div className="mt-3 border-t border-border/70 pt-3">
              {currentUser ? (
                <div className="space-y-2">
                  <Link
                    href="/my-profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3"
                  >
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <UserCircle2 className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{currentUser.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{currentUser.email}</p>
                    </div>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-11 w-full justify-between rounded-2xl px-4",
                    )}
                  >
                    Dashboard
                    <ArrowRight className="size-4" />
                  </Link>

                  <Button
                    variant="ghost"
                    className="h-11 w-full justify-start rounded-2xl px-4"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="size-4" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 justify-center rounded-2xl px-4",
                    )}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "h-11 justify-center rounded-2xl px-4",
                    )}
                  >
                    Join now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
