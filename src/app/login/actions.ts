"use server";

import { redirect } from "next/navigation";
import { clearSession, signIn } from "@/lib/api/server";

export type LoginState = { error?: string; email?: string } | undefined;

/** Only allow same-site relative paths as a post-login destination. */
function safeNext(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password.", email };

  const result = await signIn(email, password);
  if ("error" in result) return { error: result.error, email };

  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await clearSession();
  redirect("/login");
}
