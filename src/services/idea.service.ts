import { apiEndpoints } from "@/lib/api-endpoints";
import { httpClient } from "@/services/http-client";

export const ideaService = {
  list: () => httpClient.get(apiEndpoints.ideas.list),
  mine: () => httpClient.get(apiEndpoints.ideas.mine),
  byId: (id: string) => httpClient.get(apiEndpoints.ideas.byId(id)),
};
