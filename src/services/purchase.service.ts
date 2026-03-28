import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { Purchase } from "@/types/domain";

import { httpClient } from "./http-client";

interface PurchaseCreateResponse {
  purchase: Purchase;
  payment: {
    provider: string;
    checkoutUrl: string;
    sessionId: string;
  };
}

export const purchaseService = {
  async create(ideaId: string) {
    const { data } = await httpClient.post<ApiResponse<PurchaseCreateResponse>>(
      apiEndpoints.purchases.create,
      { ideaId, paymentProvider: "STRIPE" },
    );
    return data.data;
  },
  async mine() {
    const { data } = await httpClient.get<ApiResponse<Purchase[]>>(apiEndpoints.purchases.mine);
    return data.data;
  },
};
