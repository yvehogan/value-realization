import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

// Optimistic check only (cookie present?). The app layout verifies the
// session signature on the server before rendering anything.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

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
  // Everything except Next internals and static files in /public.
  matcher: ["/((?!_next/|icons/|decor/|brand/|login/|favicon.ico|icon.svg|apple-icon.png).*)"],
};
