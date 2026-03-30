import { NextResponse } from "next/server";
import { applyBackendCookies, getApiBaseUrl } from "../auth-proxy";

async function proxyGoogleAuth(request: Request) {
  const requestUrl = new URL(request.url);
  const backendUrl = new URL(`${getApiBaseUrl()}/auth/google`);

  backendUrl.search = requestUrl.search;

  const response = await fetch(backendUrl, {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") ?? "application/json",
      Accept: request.headers.get("accept") ?? "application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
    redirect: "manual",
    cache: "no-store",
  });

  const location = response.headers.get("location");

  if (location) {
    const nextResponse = NextResponse.redirect(location, {
      status: response.status >= 300 && response.status < 400 ? response.status : 302,
    });

    applyBackendCookies(nextResponse, response.headers);
    return nextResponse;
  }

  const contentType = response.headers.get("content-type");
  const nextResponse = contentType?.includes("application/json")
    ? NextResponse.json(await response.json(), { status: response.status })
    : new NextResponse(await response.text(), { status: response.status });

  applyBackendCookies(nextResponse, response.headers);

  return nextResponse;
}

export const GET = proxyGoogleAuth;
export const POST = proxyGoogleAuth;
