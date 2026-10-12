import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE } from "@/lib/session-cookie";

// Optimistic check only (cookie present?). The API validates the tokens on every
// call; /api/nexus answers 401 itself so the client can send the user to /login.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_COOKIE);

  if (pathname === "/login") {
    return hasSession ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }
  if (!hasSession) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next internals, API routes and static files in /public.
  matcher: ["/((?!_next/|api/|icons/|decor/|brand/|login/|favicon.ico|icon.svg|apple-icon.png).*)"],
};
