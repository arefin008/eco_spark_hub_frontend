const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getApiOrigin(baseUrl: string) {
  return stripTrailingSlash(baseUrl).replace(/\/api\/v1$/, "");
}

export const appConfig = {
  apiBaseUrl: stripTrailingSlash(apiBaseUrl),
  apiOrigin: getApiOrigin(apiBaseUrl),
  googleAuthUrl:
    process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL ??
    `${getApiOrigin(apiBaseUrl)}/api/v1/auth/google`,
};
