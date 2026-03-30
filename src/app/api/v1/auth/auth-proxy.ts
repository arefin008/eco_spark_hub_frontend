import { NextResponse } from "next/server";

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return stripTrailingSlash(apiBaseUrl);
}

export function getSetCookieHeaders(headers: Headers) {
  const getSetCookie = (headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;

  if (typeof getSetCookie === "function") {
    return getSetCookie.call(headers);
  }

  const cookieHeader = headers.get("set-cookie");

  if (!cookieHeader) {
    return [];
  }

  return splitSetCookieHeader(cookieHeader);
}

function splitSetCookieHeader(value: string) {
  const cookies: string[] = [];
  let start = 0;
  let inExpiresAttribute = false;

  for (let index = 0; index < value.length; index += 1) {
    const current = value[index];
    const ahead = value.slice(index, index + 8).toLowerCase();

    if (ahead === "expires=") {
      inExpiresAttribute = true;
      continue;
    }

    if (inExpiresAttribute && current === ";") {
      inExpiresAttribute = false;
      continue;
    }

    if (!inExpiresAttribute && current === ",") {
      const next = value.slice(index + 1);

      if (/^\s*[^=;, ]+=/.test(next)) {
        cookies.push(value.slice(start, index).trim());
        start = index + 1;
      }
    }
  }

  cookies.push(value.slice(start).trim());

  return cookies.filter(Boolean);
}

export function applyBackendCookies(response: NextResponse, backendHeaders: Headers) {
  const cookies = getSetCookieHeaders(backendHeaders);

  for (const cookie of cookies) {
    response.headers.append("set-cookie", cookie);
  }
}
