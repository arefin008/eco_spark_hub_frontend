import { apiEndpoints } from "@/lib/api-endpoints";
import { buildQueryString } from "@/lib/helpers";
import type { ApiMeta, ApiResponse } from "@/types/api";
import type { AdminStats, User, UserStatus } from "@/types/domain";

import { httpClient } from "./http-client";

export const adminService = {
  async stats() {
    const { data } = await httpClient.get<ApiResponse<AdminStats>>(apiEndpoints.admins.stats);
    return data.data;
  },
  async users(params?: {
    searchTerm?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const query = buildQueryString({
      searchTerm: params?.searchTerm,
      role: params?.role,
      status: params?.status,
      page: params?.page,
      limit: params?.limit,
    });

    const { data } = await httpClient.get<ApiResponse<User[]>>(
      `${apiEndpoints.users.list}${query ? `?${query}` : ""}`,
    );

    return {
      data: data.data,
      meta: data.meta as ApiMeta | undefined,
    };
  },
  async updateUserStatus(id: string, status: UserStatus) {
    const { data } = await httpClient.patch<ApiResponse<User>>(
      apiEndpoints.admins.updateUserStatus(id),
      { status },
    );
    return data.data;
  },
};
