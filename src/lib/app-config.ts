const clientApiBaseUrl = "/api/v1";
const clientGoogleAuthUrl = "/api/v1/auth/google";
const clientFacebookAuthUrl = "/api/v1/auth/facebook";

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getApiOrigin(baseUrl: string) {
  return stripTrailingSlash(baseUrl).replace(/\/api\/v1$/, "");
}

function getOptionalEnv(
  name: "NEXT_PUBLIC_API_BASE_URL" | "NEXT_PUBLIC_APP_URL",
) {
  const value = process.env[name];

  return value ? stripTrailingSlash(value) : undefined;
}

function getOptionalString(
  name: "NEXT_PUBLIC_DEMO_USER_EMAIL" | "NEXT_PUBLIC_DEMO_USER_PASSWORD",
) {
  return process.env[name] || undefined;
}

function getProviderAuthUrl(
  envValue: string | undefined,
  fallbackUrl: string,
) {
  const value = envValue;

  if (value?.startsWith("/") || value?.startsWith("http://") || value?.startsWith("https://")) {
    return stripTrailingSlash(value);
  }

  return fallbackUrl;
}

const apiBaseUrl = getOptionalEnv("NEXT_PUBLIC_API_BASE_URL");
const appUrl = getOptionalEnv("NEXT_PUBLIC_APP_URL");

export const appConfig = {
  clientApiBaseUrl,
  apiBaseUrl,
  apiOrigin: apiBaseUrl ? getApiOrigin(apiBaseUrl) : undefined,
  authApiBaseUrl: clientApiBaseUrl,
  appUrl,
  googleAuthUrl: getProviderAuthUrl(process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL, clientGoogleAuthUrl),
  facebookAuthUrl: getProviderAuthUrl(
    process.env.NEXT_PUBLIC_FACEBOOK_AUTH_URL,
    clientFacebookAuthUrl,
  ),
  demoUserEmail: getOptionalString("NEXT_PUBLIC_DEMO_USER_EMAIL") ?? "member@ecospark.dev",
  demoUserPassword: getOptionalString("NEXT_PUBLIC_DEMO_USER_PASSWORD") ?? "demo123456",
};


