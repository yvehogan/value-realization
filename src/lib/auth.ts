// Dummy authentication for demos. Swap for a real identity provider before launch.

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { HEAD_OF_INNOVATION, getPerson } from "./data";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./session-cookie";
import type { Role, Viewer } from "./viewer";

type Account = { email: string; password: string; role: Role; personId: string };

const ACCOUNTS: Account[] = [
  { email: "admin@nexus.test", password: "Admin@123", role: "admin", personId: HEAD_OF_INNOVATION.id },
  { email: "user@nexus.test", password: "User@123", role: "user", personId: "victor-onwuelu" },
];

const SECRET = process.env.SESSION_SECRET ?? "nexus-dev-only-secret-change-me";

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

function encode(email: string, expires: number) {
  const payload = Buffer.from(JSON.stringify({ email, expires })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decode(token: string): { email: string } | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.email === "string" && data.expires > Date.now() ? { email: data.email } : null;
  } catch {
    return null;
  }
}

function toViewer(account: Account): Viewer | null {
  if (account.personId === HEAD_OF_INNOVATION.id) {
    const p = HEAD_OF_INNOVATION;
    return { id: p.id, name: p.name, firstName: p.firstName, initials: p.initials, title: p.role, role: account.role, color: p.color };
  }
  const person = getPerson(account.personId);
  if (!person) return null;
  return {
    id: person.id,
    name: person.name,
    firstName: person.name.split(" ")[0],
    initials: person.initials,
    title: person.role,
    role: account.role,
    color: person.color,
  };
}

/** Returns the account for valid credentials, otherwise null. */
export function checkCredentials(email: string, password: string) {
  const account = ACCOUNTS.find((a) => a.email === email.trim().toLowerCase());
  if (!account) return null;
  const a = Buffer.from(account.password);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b) ? account : null;
}

export async function createSession(email: string) {
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  (await cookies()).set(SESSION_COOKIE, encode(email, expires), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in viewer, or null. Memoised per request. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? decode(token) : null;
  const account = session && ACCOUNTS.find((a) => a.email === session.email);
  return account ? toViewer(account) : null;
});

/** The signed-in viewer; redirects to /login when there's no valid session. */
export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return viewer;
}
