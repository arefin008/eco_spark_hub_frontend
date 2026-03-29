import type { QueryClient } from "@tanstack/react-query";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function completeClientLogout(
  queryClient: QueryClient,
  router: AppRouterInstance,
  redirectTo: string,
) {
  await queryClient.cancelQueries();
  queryClient.clear();
  queryClient.setQueryData(["current-user"], null);
  router.replace(redirectTo);
  router.refresh();
}
