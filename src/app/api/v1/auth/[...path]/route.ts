import { NextResponse } from "next/server";

import { applyBackendCookies, getApiBaseUrl } from "../auth-proxy";

export const dynamic = "force-dynamic";

async function proxyAuthRequest(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const backendUrl = new URL(`${getApiBaseUrl()}/auth/${path.join("/")}`);
  const requestUrl = new URL(request.url);

  backendUrl.search = requestUrl.search;

  const response = await fetch(backendUrl, {
    method: request.method,
    headers: {
      Accept: request.headers.get("accept") ?? "*/*",
      "Content-Type": request.headers.get("content-type") ?? "application/json",
      Cookie: request.headers.get("cookie") ?? "",
      ...(request.headers.get("x-skip-auth-refresh")
        ? { "x-skip-auth-refresh": request.headers.get("x-skip-auth-refresh")! }
        : {}),
    },
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
    cache: "no-store",
    redirect: "manual",
  });

  const contentType = response.headers.get("content-type");
  const nextResponse = new NextResponse(await response.text(), {
    status: response.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });

  applyBackendCookies(nextResponse, response.headers, request.url);

  return nextResponse;
}

export const GET = proxyAuthRequest;
export const POST = proxyAuthRequest;
export const PUT = proxyAuthRequest;
export const PATCH = proxyAuthRequest;
export const DELETE = proxyAuthRequest;
