import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { Purchase } from "@/types/domain";

import { httpClient } from "./http-client";

export const paymentService = {
  async status(purchaseId: string) {
    const { data } = await httpClient.get<ApiResponse<Purchase>>(
      apiEndpoints.payments.status(purchaseId),
    );
    return data.data;
  },
};
