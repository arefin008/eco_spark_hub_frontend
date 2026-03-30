import { NextResponse } from "next/server";

import { applyBackendCookies, getApiBaseUrl, getSetCookieHeaders } from "../../auth-proxy";

function getRedirectStatus(status: number) {
  return status >= 300 && status < 400 ? status : 302;
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const backendUrl = new URL(`${getApiBaseUrl()}/auth/google/callback`);

  backendUrl.search = requestUrl.search;

  const response = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Accept: request.headers.get("accept") ?? "text/html,application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    redirect: "manual",
    cache: "no-store",
  });

  const setCookies = getSetCookieHeaders(response.headers);
  const locationHeader = response.headers.get("location");
  const redirectTo = locationHeader ?? requestUrl.searchParams.get("redirectTo") ?? "/";
  const redirectUrl = new URL(redirectTo, request.url);

  console.log("google callback proxy", {
    backendUrl: backendUrl.toString(),
    status: response.status,
    location: locationHeader,
    resolvedRedirectUrl: redirectUrl.toString(),
    setCookieCount: setCookies.length,
    hasSetCookie: setCookies.length > 0,
  });

  const nextResponse = NextResponse.redirect(redirectUrl, getRedirectStatus(response.status));

  nextResponse.headers.set("Cache-Control", "no-store");
  applyBackendCookies(nextResponse, response.headers, request.url);

  return nextResponse;
}
