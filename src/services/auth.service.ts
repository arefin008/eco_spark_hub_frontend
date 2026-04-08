import { appConfig } from "@/lib/app-config";
import { apiEndpoints } from "@/lib/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type { AuthPayload, User } from "@/types/domain";

import { ApiRequestError, authHttpClient, SKIP_AUTH_REFRESH_HEADER } from "./http-client";

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

interface MeOptions {
  skipRefresh?: boolean;
}

type CurrentUser = User | null;
type SocialProvider = "google" | "facebook";

function getGoogleRedirectTarget(callbackUrl?: string) {
  const baseUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : appConfig.appUrl;

  if (!baseUrl) {
    throw new Error("Google sign-in callback URL is not configured.");
  }

  if (!callbackUrl) {
    return baseUrl;
  }

  return new URL(callbackUrl, baseUrl).toString();
}

function getGoogleSignInStartUrl(callbackUrl?: string) {
  return getSocialSignInStartUrl("google", callbackUrl);
}

function getProviderAuthUrl(provider: SocialProvider) {
  return provider === "google" ? appConfig.googleAuthUrl : appConfig.facebookAuthUrl;
}

function getSocialSignInStartUrl(provider: SocialProvider, callbackUrl?: string) {
  const redirectUrl = new URL(
    getProviderAuthUrl(provider),
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : appConfig.appUrl,
  );

  redirectUrl.searchParams.set("callbackUrl", getGoogleRedirectTarget(callbackUrl));

  return redirectUrl.toString();
}

export const authService = {
  async signInWithGoogle(callbackUrl?: string) {
    if (!appConfig.googleAuthUrl) {
      throw new Error("Google sign-in is not configured.");
    }

    return {
      url: getGoogleSignInStartUrl(callbackUrl),
    };
  },
  async signInWithFacebook(callbackUrl?: string) {
    if (!appConfig.facebookAuthUrl) {
      throw new Error("Facebook sign-in is not configured.");
    }

    return {
      url: getSocialSignInStartUrl("facebook", callbackUrl),
    };
  },
  async register(payload: RegisterInput) {
    const { data } = await authHttpClient.post<ApiResponse<AuthPayload>>(
      apiEndpoints.auth.register,
      payload,
    );
    return data.data;
  },
  async login(payload: LoginInput) {
    const { data } = await authHttpClient.post<ApiResponse<AuthPayload>>(
      apiEndpoints.auth.login,
      payload,
    );
    return data.data;
  },
  async me(options?: MeOptions): Promise<CurrentUser> {
    try {
      const { data } = await authHttpClient.get<ApiResponse<User>>(apiEndpoints.auth.me, {
        headers: options?.skipRefresh ? { [SKIP_AUTH_REFRESH_HEADER]: "true" } : undefined,
      });
      return data.data;
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 401) {
        return null;
      }

      throw error;
    }
  },
  async logout() {
    await authHttpClient.post(apiEndpoints.auth.logout);
  },
  async changePassword(payload: ChangePasswordInput) {
    const { data } = await authHttpClient.post<ApiResponse<{ accessToken: string }>>(
      apiEndpoints.auth.changePassword,
      payload,
    );
    return data.data;
  },
  async verifyEmail(payload: VerifyEmailInput) {
    await authHttpClient.post(apiEndpoints.auth.verifyEmail, payload);
  },
  async forgotPassword(email: string) {
    await authHttpClient.post(apiEndpoints.auth.forgotPassword, { email });
  },
  async resetPassword(payload: ResetPasswordInput) {
    await authHttpClient.post(apiEndpoints.auth.resetPassword, payload);
  },
};
