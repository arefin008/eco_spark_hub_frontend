import { appConfig } from "@/lib/app-config";
import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { AuthPayload, User } from "@/types/domain";

import { httpClient } from "./http-client";

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

export const authService = {
  getGoogleAuthUrl() {
    return appConfig.googleAuthUrl;
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
  async me() {
    const { data } = await httpClient.get<ApiResponse<User>>(apiEndpoints.auth.me);
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
