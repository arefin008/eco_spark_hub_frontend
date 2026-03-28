import { apiEndpoints } from "@/lib/api-endpoints";
import type { VoteType } from "@/types/domain";

import { httpClient } from "./http-client";

export const voteService = {
  async upsert(ideaId: string, type: VoteType) {
    await httpClient.post(apiEndpoints.votes.upsert, { ideaId, type });
  },
  async remove(ideaId: string) {
    await httpClient.delete(apiEndpoints.votes.remove, {
      data: { ideaId },
    });
  },
};
