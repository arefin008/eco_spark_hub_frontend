const clientApiBaseUrl = "/api/v1";
const clientGoogleAuthUrl = "/api/v1/auth/google";

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

function getGoogleAuthUrl() {
  const value = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL;

  if (value?.startsWith("/") || value?.startsWith("http://") || value?.startsWith("https://")) {
    return stripTrailingSlash(value);
  }

  return clientGoogleAuthUrl;
}

const apiBaseUrl = getOptionalEnv("NEXT_PUBLIC_API_BASE_URL");
const appUrl = getOptionalEnv("NEXT_PUBLIC_APP_URL");

export const appConfig = {
  clientApiBaseUrl,
  apiBaseUrl,
  apiOrigin: apiBaseUrl ? getApiOrigin(apiBaseUrl) : undefined,
  authApiBaseUrl: clientApiBaseUrl,
  appUrl,
  googleAuthUrl: getGoogleAuthUrl(),
};


