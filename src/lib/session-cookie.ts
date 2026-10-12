/** Cookie names shared by the proxy (optimistic check) and the server session code. */
export const ACCESS_COOKIE = "nexus_access";
export const REFRESH_COOKIE = "nexus_refresh";
export const PROFILE_COOKIE = "nexus_profile";

/** Cookie lifetime. Access tokens expire after minutes and are refreshed on use; this caps an idle session. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
