import type { NextRequest } from "next/server";
import { API_BASE_URL, clearSession, getAccessToken } from "@/lib/api/server";

/*
 * Same-origin proxy to the Nexus API: /api/nexus/<path> → <NEXUS_API_URL>/<path>.
 * The browser never sees the tokens; this handler attaches the access token from the
 * httpOnly cookie, refreshing it when it's about to expire or the API rejects it.
 */

const SESSION_EXPIRED = { isSuccess: false, responseCode: "401", responseMessage: "Your session has expired. Please sign in again.", responseData: null, metaData: null };

async function forward(request: NextRequest, ctx: RouteContext<"/api/nexus/[...path]">) {
  const { path } = await ctx.params;
  const target = `${API_BASE_URL}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  // Buffer the body so it can be replayed after a token refresh.
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();
  const contentType = request.headers.get("content-type");

  const send = (token: string) =>
    fetch(target, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body,
      cache: "no-store",
    });

  let token = await getAccessToken();
  if (!token) {
    await clearSession();
    return Response.json(SESSION_EXPIRED, { status: 401 });
  }

  let upstream: Response;
  try {
    upstream = await send(token);
    if (upstream.status === 401) {
      token = await getAccessToken({ forceRefresh: true });
      if (!token) {
        await clearSession();
        return Response.json(SESSION_EXPIRED, { status: 401 });
      }
      upstream = await send(token);
    }
  } catch {
    return Response.json(
      { isSuccess: false, responseCode: "502", responseMessage: "Couldn't reach the Nexus server.", responseData: null, metaData: null },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
