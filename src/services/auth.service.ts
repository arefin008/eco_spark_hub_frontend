import { appConfig } from "@/lib/app-config";
import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { AuthPayload, User } from "@/types/domain";

import { httpClient, SKIP_AUTH_REFRESH_HEADER } from "./http-client";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

interface SocialSignInResponse {
  url: string;
  redirect: boolean;
}

interface MeOptions {
  skipRefresh?: boolean;
}

export const authService = {
  async signInWithGoogle(callbackUrl?: string) {
    const response = await fetch(appConfig.googleAuthUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: callbackUrl,
      }),
    });

    if (!response.ok) {
      throw new Error("Google sign-in could not be started.");
    }

    return (await response.json()) as SocialSignInResponse;
  },
  async register(payload: RegisterInput) {
    const { data } = await httpClient.post<ApiResponse<AuthPayload>>(
      apiEndpoints.auth.register,
      payload,
    );
    return data.data;
  },
  async login(payload: LoginInput) {
    const { data } = await httpClient.post<ApiResponse<AuthPayload>>(
      apiEndpoints.auth.login,
      payload,
    );
    return data.data;
  },
  async me(options?: MeOptions) {
    const { data } = await httpClient.get<ApiResponse<User>>(apiEndpoints.auth.me, {
      headers: options?.skipRefresh ? { [SKIP_AUTH_REFRESH_HEADER]: "true" } : undefined,
    });
    return data.data;
  },
  async logout() {
    await httpClient.post(apiEndpoints.auth.logout);
  },
  async changePassword(payload: ChangePasswordInput) {
    const { data } = await httpClient.post<ApiResponse<{ accessToken: string }>>(
      apiEndpoints.auth.changePassword,
      payload,
    );
    return data.data;
  },
  async verifyEmail(payload: VerifyEmailInput) {
    await httpClient.post(apiEndpoints.auth.verifyEmail, payload);
  },
  async forgotPassword(email: string) {
    await httpClient.post(apiEndpoints.auth.forgotPassword, { email });
  },
  async resetPassword(payload: ResetPasswordInput) {
    await httpClient.post(apiEndpoints.auth.resetPassword, payload);
  },
};
