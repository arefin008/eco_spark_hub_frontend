import { apiEndpoints } from "@/lib/api-endpoints";

import { httpClient } from "./http-client";

export const newsletterService = {
  async subscribe(email: string) {
    await httpClient.post(apiEndpoints.newsletters.subscribe, { email });
  },
};
