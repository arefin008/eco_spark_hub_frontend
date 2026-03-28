import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { NewsletterSubscription } from "@/types/domain";

import { httpClient } from "./http-client";

export const newsletterService = {
  async subscribe(email: string) {
    await httpClient.post(apiEndpoints.newsletters.subscribe, { email });
  },
  async unsubscribe(email: string) {
    await httpClient.patch(apiEndpoints.newsletters.unsubscribe(email));
  },
  async list() {
    const { data } = await httpClient.get<ApiResponse<NewsletterSubscription[]>>(
      apiEndpoints.newsletters.list,
    );
    return data.data;
  },
};
