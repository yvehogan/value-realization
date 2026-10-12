import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { staggerStyle } from "@/lib/motion";

export const metadata: Metadata = { title: "Sign in · Nexus" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    // Figma: the group sits 33px above true centre (163px top / 229px bottom at 1440×833).
    <main className="flex min-h-screen flex-col items-center justify-center bg-sidebar bg-[url(/login/background.svg)] bg-cover bg-center px-4 pt-12 pb-[114px]">
      <Image src="/brand/logo-mark-login.png" alt="Nexus" width={47} height={47} priority className="animate-fade-up" />
      <h1 className="stagger animate-fade-up pt-[15px] text-2xl leading-8 font-bold text-white" style={staggerStyle(1)}>
        Welcome to Nexus
      </h1>
      <p className="stagger animate-fade-up pt-[5px] text-body text-lavender" style={staggerStyle(2)}>
        Innovation Value Realization Portal
      </p>

      <div
        className="stagger mt-[33px] w-full max-w-[420px] animate-fade-up rounded-2xl bg-surface p-[25px] shadow-[0_24px_64px_rgb(0_0_0/0.7)]"
        style={staggerStyle(3)}
      >
        <LoginForm next={typeof next === "string" ? next : undefined} />
      </div>
    </main>
  );
}
