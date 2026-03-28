import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { appConfig } from "@/lib/app-config";
import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiErrorResponse } from "@/types/api";

const baseURL = appConfig.apiBaseUrl;

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
});

function getApiErrorMessage(error: AxiosError<ApiErrorResponse>) {
  return (
    error.response?.data?.message ||
    error.response?.data?.errorSources?.[0]?.message ||
    error.message ||
    "Request failed."
  );
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== apiEndpoints.auth.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        await refreshClient.post(apiEndpoints.auth.refreshToken, {});
        return httpClient(originalRequest);
      } catch {
        return Promise.reject(new Error(getApiErrorMessage(error)));
      }
    }

    return Promise.reject(new Error(getApiErrorMessage(error)));
  },
);
