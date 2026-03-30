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

interface ParsedSetCookie {
  nameValue: string;
  attributes: string[];
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

function parseSetCookie(cookie: string): ParsedSetCookie {
  const [nameValue, ...attributes] = cookie
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    nameValue,
    attributes,
  };
}

function isCookieDeletion(attributes: string[]) {
  return attributes.some((attribute) => {
    const [name, value = ""] = attribute.split("=", 2);
    const normalizedName = name.trim().toLowerCase();
    const normalizedValue = value.trim().toLowerCase();

    return (
      (normalizedName === "max-age" && normalizedValue === "0") ||
      (normalizedName === "expires" && normalizedValue === "thu, 01 jan 1970 00:00:00 gmt")
    );
  });
}

function getCookiePath(attributes: string[]) {
  const pathAttribute = attributes.find((attribute) => attribute.toLowerCase().startsWith("path="));
  return pathAttribute?.slice(5).trim();
}

function isDomainAttributeSafe(hostname: string) {
  return hostname.includes(".") && hostname !== "localhost" && !/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
}

function serializeSetCookie(nameValue: string, attributes: string[]) {
  return [nameValue, ...attributes].join("; ");
}

function normalizeProxyCookie(cookie: string) {
  const parsed = parseSetCookie(cookie);
  const attributes = parsed.attributes.filter(
    (attribute) => !attribute.toLowerCase().startsWith("domain="),
  );

  if (!attributes.some((attribute) => attribute.toLowerCase().startsWith("path="))) {
    attributes.push("Path=/");
  }

  return serializeSetCookie(parsed.nameValue, attributes);
}

function getFrontendDomainCookie(cookie: string, requestUrl: string) {
  const parsed = parseSetCookie(cookie);
  const requestHostname = new URL(requestUrl).hostname;

  if (!isDomainAttributeSafe(requestHostname)) {
    return null;
  }

  const attributes = parsed.attributes.filter(
    (attribute) => !attribute.toLowerCase().startsWith("domain="),
  );
  const domainAttribute = `Domain=${requestHostname}`;
  attributes.push(domainAttribute);

  if (!attributes.some((attribute) => attribute.toLowerCase().startsWith("path="))) {
    attributes.push("Path=/");
  }

  return serializeSetCookie(parsed.nameValue, attributes);
}

export function applyBackendCookies(
  response: NextResponse,
  backendHeaders: Headers,
  requestUrl: string,
) {
  const cookies = getSetCookieHeaders(backendHeaders);

  for (const cookie of cookies) {
    const normalizedCookie = normalizeProxyCookie(cookie);
    const parsed = parseSetCookie(normalizedCookie);
    const cookiePath = getCookiePath(parsed.attributes);
    const isDeletionCookie = isCookieDeletion(parsed.attributes);
    const rootCookie =
      isDeletionCookie && cookiePath !== "/"
        ? serializeSetCookie(
            parsed.nameValue,
            [
              ...parsed.attributes.filter(
                (attribute) => !attribute.toLowerCase().startsWith("path="),
              ),
              "Path=/",
            ],
          )
        : null;

    response.headers.append("set-cookie", normalizedCookie);

    if (rootCookie) {
      response.headers.append("set-cookie", rootCookie);
    }

    if (isDeletionCookie) {
      const domainCookie = getFrontendDomainCookie(normalizedCookie, requestUrl);

      if (domainCookie) {
        response.headers.append("set-cookie", domainCookie);
      }
    }

    if (rootCookie) {
      const rootDomainCookie = getFrontendDomainCookie(rootCookie, requestUrl);

      if (rootDomainCookie) {
        response.headers.append("set-cookie", rootDomainCookie);
      }
    }
  }
}
