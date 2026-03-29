"use client";

import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";

interface UseCurrentUserOptions {
  enabled?: boolean;
  skipRefresh?: boolean;
}

export function useCurrentUser(options?: UseCurrentUserOptions) {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => authService.me({ skipRefresh: options?.skipRefresh }),
    enabled: options?.enabled,
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  });
}
