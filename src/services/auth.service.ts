import { apiEndpoints } from "@/lib/api-endpoints";
import { httpClient } from "@/services/http-client";

export const authService = {
  register: () => httpClient.post(apiEndpoints.auth.register),
  login: () => httpClient.post(apiEndpoints.auth.login),
  me: () => httpClient.get(apiEndpoints.auth.me),
  logout: () => httpClient.post(apiEndpoints.auth.logout),
};
