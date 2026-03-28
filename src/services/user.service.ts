import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/domain";

import { httpClient } from "./http-client";

export const userService = {
  async byId(id: string) {
    const { data } = await httpClient.get<ApiResponse<User>>(apiEndpoints.users.byId(id));
    return data.data;
  },
  async update(id: string, payload: Partial<Pick<User, "name" | "email" | "role" | "status">>) {
    const { data } = await httpClient.patch<ApiResponse<User>>(
      apiEndpoints.users.byId(id),
      payload,
    );
    return data.data;
  },
};
