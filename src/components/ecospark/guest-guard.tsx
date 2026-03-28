"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: currentUser, isFetched, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isFetched || isLoading) {
      return;
    }

    if (currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, isFetched, isLoading, pathname, router]);

  if (isLoading || !isFetched) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="w-full max-w-xl rounded-[32px] border border-border/70 bg-card/90 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Loading
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Preparing authentication</h1>
          <div className="mt-6 space-y-3">
            <div className="h-3 rounded-full bg-muted" />
            <div className="h-3 w-4/5 rounded-full bg-muted" />
            <div className="h-3 w-3/5 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return null;
  }

  return <>{children}</>;
}
