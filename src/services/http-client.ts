import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { appConfig } from "@/lib/app-config";
import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiErrorResponse } from "@/types/api";

const SKIP_AUTH_REFRESH_HEADER = "x-skip-auth-refresh";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

const baseURL = appConfig.clientApiBaseUrl;
const authBaseURL = appConfig.authApiBaseUrl;

const refreshClient = axios.create({
  baseURL: authBaseURL,
  withCredentials: true,
});

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
});

export const authHttpClient = axios.create({
  baseURL: authBaseURL,
  withCredentials: true,
});

function getApiErrorMessage(error: AxiosError<ApiErrorResponse>) {
  const status = error.response?.status;

  if (status === 429) {
    return "The AI service has reached its free usage limit for now. Please wait a bit and try again later.";
  }

  if (status === 503) {
    return "The service is temporarily unavailable. Please try again shortly.";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.errorSources?.[0]?.message ||
    error.message ||
    "Request failed."
  );
}

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) =>
    Promise.reject(new ApiRequestError(getApiErrorMessage(error), error.response?.status)),
);

authHttpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.headers?.[SKIP_AUTH_REFRESH_HEADER] &&
      originalRequest.url !== apiEndpoints.auth.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        await refreshClient.post(apiEndpoints.auth.refreshToken, {});
        return authHttpClient(originalRequest);
      } catch {
        return Promise.reject(
          new ApiRequestError(getApiErrorMessage(error), error.response?.status),
        );
      }
    }

    return Promise.reject(
      new ApiRequestError(getApiErrorMessage(error), error.response?.status),
    );
  },
);

export { SKIP_AUTH_REFRESH_HEADER };
