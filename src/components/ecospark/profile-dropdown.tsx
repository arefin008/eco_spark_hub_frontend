"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, LogOut, Settings, ShieldCheck, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { completeClientLogout } from "@/lib/client-auth";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth.service";

function getInitials(name?: string) {
  if (!name) return "EH";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileDropdown({
  align = "end",
  sideOffset = 12,
  side = "bottom",
  className,
  compact = false,
}: {
  align?: "end" | "center" | "start";
  sideOffset?: number;
  side?: "bottom" | "top" | "right" | "left";
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  const isDashboard = pathname?.startsWith("/dashboard");

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      await completeClientLogout(queryClient, router, "/login");
      toast.success("Logged out.");
    },
    onError: (error) => toast.error(error.message),
  });

  const workspaceLabel = currentUser?.role === "ADMIN" ? "Admin workspace" : "Member workspace";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex items-center gap-3 rounded-[20px] border border-border/70 bg-card px-3 py-2 text-left shadow-sm outline-none transition hover:border-primary/20 hover:bg-secondary/35 focus-visible:ring-2 focus-visible:ring-primary/20",
            className
          )}
        >
          <div className={cn("flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary shrink-0", compact && "lg:size-11")}>
            {getInitials(currentUser?.name)}
          </div>
          <div className={cn("hidden min-w-0 sm:block", compact && "lg:hidden")}>
            <p className="truncate text-sm font-semibold text-foreground">
              {currentUser?.name ?? "Account"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser?.email ?? workspaceLabel}
            </p>
          </div>
          <ChevronDown className={cn("size-4 text-muted-foreground transition group-data-[state=open]:rotate-180 shrink-0", compact && "lg:hidden")} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[260px] rounded-[24px] p-2 shadow-xl" align={align} side={side} sideOffset={sideOffset}>
        <div className="mb-2 rounded-[16px] bg-muted/40 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{currentUser?.name ?? "Account"}</p>
          <p className="mt-1 text-xs text-muted-foreground">{currentUser?.email}</p>
        </div>
        <div className="grid gap-0.5">
          <DropdownMenuItem asChild className="cursor-pointer rounded-[14px] px-3 py-2.5 text-sm transition focus:bg-secondary/50">
            <Link href="/my-profile" className="flex items-center gap-3">
              <UserCircle2 className="size-4 text-primary" />
              Profile
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="cursor-pointer rounded-[14px] px-3 py-2.5 text-sm transition focus:bg-secondary/50">
            <Link href="/change-password" className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-primary" />
              Change your password
            </Link>
          </DropdownMenuItem>
          
          {!isDashboard && (
            <DropdownMenuItem asChild className="cursor-pointer rounded-[14px] px-3 py-2.5 text-sm transition focus:bg-secondary/50">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Settings className="size-4 text-primary" />
                Dashboard home
              </Link>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          className="cursor-pointer rounded-[14px] px-3 py-2.5 text-sm text-destructive transition focus:bg-destructive/10 focus:text-destructive"
          onSelect={(e) => {
            e.preventDefault();
            logoutMutation.mutate();
          }}
          disabled={logoutMutation.isPending}
        >
          <div className="flex w-full items-center gap-3">
            <LogOut className="size-4" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
