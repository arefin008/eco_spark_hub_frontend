const clientApiBaseUrl = "/api/v1";
const clientGoogleAuthUrl = "/api/auth/sign-in/social";

function requireEnv(name: "NEXT_PUBLIC_API_BASE_URL" | "NEXT_PUBLIC_APP_URL") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getApiOrigin(baseUrl: string) {
  return stripTrailingSlash(baseUrl).replace(/\/api\/v1$/, "");
}

export const appConfig = {
  clientApiBaseUrl,
  apiBaseUrl: stripTrailingSlash(requireEnv("NEXT_PUBLIC_API_BASE_URL")),
  apiOrigin: getApiOrigin(requireEnv("NEXT_PUBLIC_API_BASE_URL")),
  appUrl: stripTrailingSlash(requireEnv("NEXT_PUBLIC_APP_URL")),
  googleAuthUrl: process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL ?? clientGoogleAuthUrl,
};
