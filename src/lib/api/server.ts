import "server-only";

import { cookies } from "next/headers";
import { ACCESS_COOKIE, PROFILE_COOKIE, REFRESH_COOKIE, SESSION_MAX_AGE } from "@/lib/session-cookie";
import type { BaseResponse, LoginModel } from "./types";

/** Base URL of the Nexus API, including the version segment. */
export const API_BASE_URL = (process.env.NEXUS_API_URL ?? "https://www.nexus-api.somee.com/api/v1").replace(/\/$/, "");

type Tokens = { accessToken: string; refreshToken: string };

/** What the UI needs about the signed-in user, kept in a cookie so server components can read it without an API call. */
export type SessionProfile = {
  id: string;
  email: string;
  fullName: string | null;
  teamRoleName: string | null;
  roles: string[];
};

type CookieStore = Awaited<ReturnType<typeof cookies>>;

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

/** Decodes a JWT payload without verifying it — the API verifies; we only read claims. */
function claims(token: string): { exp?: number; unique_name?: string } {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  } catch {
    return {};
  }
}

/** True when the token expires within the next 30 seconds. */
function isExpiring(token: string) {
  const exp = claims(token).exp;
  return !exp || exp * 1000 - Date.now() < 30_000;
}

function writeTokens(store: CookieStore, tokens: Tokens) {
  store.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions);
  store.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(PROFILE_COOKIE);
}

/** Signs in against the API and stores the session cookies. Returns an error message on failure. */
export async function signIn(email: string, password: string): Promise<{ error: string } | { ok: true }> {
  let body: BaseResponse<LoginModel | unknown>;
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { error: "Couldn't reach the Nexus server. Check your connection and try again." };
  }
  try {
    body = await res.json();
  } catch {
    // The host answers with an HTML error page when the API itself is down.
    return { error: "The Nexus server is having problems right now. Please try again in a few minutes." };
  }

  const data = body.responseData as LoginModel | null;
  if (!body.isSuccess || !data?.accessToken || !data.refreshToken) {
    return { error: body.responseMessage || "That email and password don't match an account." };
  }

  const store = await cookies();
  writeTokens(store, { accessToken: data.accessToken, refreshToken: data.refreshToken });
  const profile: SessionProfile = {
    id: claims(data.accessToken).unique_name ?? "",
    email: data.email,
    fullName: data.fullName,
    teamRoleName: data.teamRoleName,
    roles: data.roles ?? [],
  };
  store.set(PROFILE_COOKIE, JSON.stringify(profile), cookieOptions);
  return { ok: true };
}

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const store = await cookies();
  if (!store.has(REFRESH_COOKIE)) return null;
  try {
    return JSON.parse(store.get(PROFILE_COOKIE)?.value ?? "null");
  } catch {
    return null;
  }
}

/*
 * Refresh tokens are single-use: once exchanged, the old one is rejected. Parallel requests that all
 * see an expired token must therefore share one refresh, and requests still holding the old cookie
 * (sent before the new one arrived) must get the same new pair rather than refreshing again.
 */
const inflight = new Map<string, Promise<Tokens | null>>();
const recent = new Map<string, { tokens: Tokens; at: number }>();

async function exchange(accessToken: string, refreshToken: string): Promise<Tokens | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
      cache: "no-store",
    });
    const body: BaseResponse<LoginModel | null> = await res.json();
    const data = body.responseData;
    return body.isSuccess && data?.accessToken && data.refreshToken
      ? { accessToken: data.accessToken, refreshToken: data.refreshToken }
      : null;
  } catch {
    return null;
  }
}

function refreshOnce(accessToken: string, refreshToken: string) {
  const cached = recent.get(refreshToken);
  if (cached && Date.now() - cached.at < 60_000) return Promise.resolve(cached.tokens);

  let pending = inflight.get(refreshToken);
  if (!pending) {
    pending = exchange(accessToken, refreshToken).then((tokens) => {
      inflight.delete(refreshToken);
      if (tokens) recent.set(refreshToken, { tokens, at: Date.now() });
      for (const [key, value] of recent) if (Date.now() - value.at > 60_000) recent.delete(key);
      return tokens;
    });
    inflight.set(refreshToken, pending);
  }
  return pending;
}

/**
 * A usable access token for the current request, refreshing (and updating the cookies) when needed.
 * Only call from Route Handlers or Server Functions, where cookies can be written.
 */
export async function getAccessToken({ forceRefresh = false } = {}): Promise<string | null> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (!access || !refresh) return null;
  if (!forceRefresh && !isExpiring(access)) return access;

  const tokens = await refreshOnce(access, refresh);
  if (!tokens) return null;
  writeTokens(store, tokens);
  return tokens.accessToken;
}
