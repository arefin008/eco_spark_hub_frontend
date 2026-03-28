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
  async create(payload: { name: string; description?: string }) {
    const { data } = await httpClient.post<ApiResponse<Category>>(
      apiEndpoints.categories.create,
      payload,
    );
    return data.data;
  },
  async update(id: string, payload: { name: string; description?: string }) {
    const { data } = await httpClient.patch<ApiResponse<Category>>(
      apiEndpoints.categories.update(id),
      payload,
    );
    return data.data;
  },
  async remove(id: string) {
    await httpClient.delete(apiEndpoints.categories.remove(id));
  },
};
