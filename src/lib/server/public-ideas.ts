import { appConfig } from "@/lib/app-config";
import { buildQueryString } from "@/lib/helpers";
import type { ApiResponse } from "@/types/api";
import type { Idea } from "@/types/domain";

export async function getFeaturedIdeas() {
  const query = buildQueryString({
    limit: 6,
    sortBy: "TOP_VOTED",
  });
  const response = await fetch(`${appConfig.apiBaseUrl}/ideas?${query}`, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error("Failed to load featured ideas.");
  }

  const payload = (await response.json()) as ApiResponse<Idea[]>;

  return payload.data;
}
