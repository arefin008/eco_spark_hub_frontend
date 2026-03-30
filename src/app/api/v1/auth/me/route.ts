import { NextResponse } from "next/server";
import { getApiBaseUrl } from "../auth-proxy";

export async function GET(request: Request) {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return NextResponse.json({ data: null }, { status: 200 });
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  }

  return new NextResponse(await response.text(), {
    status: response.status,
    headers: contentType ? { "content-type": contentType } : undefined,
  });
}
