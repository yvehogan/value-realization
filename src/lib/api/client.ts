// Browser-side fetch helper. Calls go to this app's /api/nexus proxy, which attaches the session token.

import type { BaseResponse, FieldError, PageMeta } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors: FieldError[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Query;
  /** Sent as JSON */
  json?: unknown;
  /** Sent as multipart/form-data */
  form?: FormData;
  signal?: AbortSignal;
};

function toSearch(query?: Query) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const search = params.toString();
  return search ? `?${search}` : "";
}

/** Calls the API and unwraps its `{ isSuccess, responseData, metaData }` envelope. Throws `ApiError` on failure. */
export async function apiRequest<T>(path: string, { method = "GET", query, json, form, signal }: RequestOptions = {}) {
  const res = await fetch(`/api/nexus/${path.replace(/^\//, "")}${toSearch(query)}`, {
    method,
    headers: json !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: json !== undefined ? JSON.stringify(json) : form,
    signal,
  });

  if (res.status === 401) {
    // Session expired and couldn't be refreshed: start over at the login page. A full load (not
    // router.push) drops every cached query along with the old session.
    const next = window.location.pathname + window.location.search;
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?next=${encodeURIComponent(next)}`);
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  let body: BaseResponse<T> | null = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON error page from the API host.
  }

  // Some endpoints (profile-user) answer 200 with an empty body.
  if (!body && res.ok) return { data: undefined as T, meta: null };

  if (!body || !res.ok || !body.isSuccess) {
    const fieldErrors = Array.isArray(body?.responseData) ? (body.responseData as FieldError[]).filter((e) => e?.errorMessage) : [];
    const fallback =
      res.status >= 500 ? "The Nexus server is having problems right now. Please try again in a few minutes." : `Request failed (${res.status}).`;
    throw new ApiError(body?.responseMessage || fallback, res.status, fieldErrors);
  }

  return { data: body.responseData, meta: body.metaData as PageMeta | null };
}

/** Plain-language message for an error thrown by a query or mutation. */
export function errorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.fieldErrors.length ? error.fieldErrors.map((e) => e.errorMessage).join(" ") : error.message;
  }
  return "Something went wrong. Please try again.";
}
