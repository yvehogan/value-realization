import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in · Nexus" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    // Figma: the group sits 33px above true centre (163px top / 229px bottom at 1440×833).
    <main className="flex min-h-screen flex-col items-center justify-center bg-sidebar bg-[url(/login/background.svg)] bg-cover bg-center px-4 pt-12 pb-[114px]">
      <Image src="/brand/logo-mark-login.png" alt="Nexus" width={47} height={47} priority />
      <h1 className="pt-[15px] text-2xl leading-8 font-bold text-white">Welcome to Nexus</h1>
      <p className="pt-[5px] text-body text-lavender">Innovation Value Realization Portal</p>

      <div className="mt-[33px] w-full max-w-[420px] rounded-2xl bg-surface p-[25px] shadow-[0_24px_64px_rgb(0_0_0/0.7)]">
        <LoginForm next={typeof next === "string" ? next : undefined} />
      </div>
    </main>
  );
}
