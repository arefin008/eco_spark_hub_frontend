"use client";

import { LogOut, Menu, UserCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/ecospark/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { publicNavLinks } from "@/lib/routes";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
            E
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight">EcoSpark Hub</p>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Sustainable ideas portal
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {publicNavLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-muted-foreground transition hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {currentUser ? (
            <>
              <Link href="/my-profile" className={cn(buttonVariants({ variant: "outline" }))}>
                <UserCircle2 className="size-4" />
                {currentUser.name.split(" ")[0]}
              </Link>
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "default" }))}>
                Dashboard
              </Link>
              <Button
                variant="ghost"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="size-4" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
                Login
              </Link>
              <Link href="/register" className={cn(buttonVariants({ variant: "default" }))}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="outline" size="icon-sm" onClick={() => setOpen((value) => !value)}>
            <Menu />
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/70 px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {publicNavLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href={currentUser ? "/dashboard" : "/login"} onClick={() => setOpen(false)}>
              {currentUser ? "Dashboard" : "Login"}
            </Link>
            {currentUser ? (
              <button
                type="button"
                className="text-left"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </button>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
