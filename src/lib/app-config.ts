const clientApiBaseUrl = "/api/v1";
const clientGoogleAuthUrl = "/api/auth/sign-in/social";

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getApiOrigin(baseUrl: string) {
  return stripTrailingSlash(baseUrl).replace(/\/api\/v1$/, "");
}

function getOptionalEnv(name: "NEXT_PUBLIC_API_BASE_URL" | "NEXT_PUBLIC_APP_URL") {
  const value = process.env[name];

  return value ? stripTrailingSlash(value) : undefined;
}

const apiBaseUrl = getOptionalEnv("NEXT_PUBLIC_API_BASE_URL");
const appUrl = getOptionalEnv("NEXT_PUBLIC_APP_URL");

export const appConfig = {
  clientApiBaseUrl,
  apiBaseUrl,
  apiOrigin: apiBaseUrl ? getApiOrigin(apiBaseUrl) : undefined,
  appUrl,
  googleAuthUrl: clientGoogleAuthUrl,
};
