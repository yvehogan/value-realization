"use server";

import { redirect } from "next/navigation";
import { checkCredentials, createSession, deleteSession } from "@/lib/auth";

export type LoginState = { error?: string; email?: string } | undefined;

/** Only allow same-site relative paths as a post-login destination. */
function safeNext(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password.", email };

  const account = checkCredentials(email, password);
  if (!account) return { error: "That email and password don't match an account.", email };

  await createSession(account.email);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
