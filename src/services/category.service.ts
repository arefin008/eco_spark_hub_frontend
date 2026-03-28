import { apiEndpoints } from "@/lib/api-endpoints";
import { buildQueryString } from "@/lib/helpers";
import type { ApiMeta, ApiResponse } from "@/types/api";
import type { Category } from "@/types/domain";

import { httpClient } from "./http-client";

export const categoryService = {
  async list(params?: { searchTerm?: string; page?: number; limit?: number }) {
    const query = buildQueryString({
      searchTerm: params?.searchTerm,
      page: params?.page,
      limit: params?.limit,
    });
    const { data } = await httpClient.get<ApiResponse<Category[]>>(
      `${apiEndpoints.categories.list}${query ? `?${query}` : ""}`,
    );

    return {
      data: data.data,
      meta: data.meta as ApiMeta | undefined,
    };
  },
};
