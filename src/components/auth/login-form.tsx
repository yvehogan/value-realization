"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { MaskIcon } from "@/components/ui/icon";

const fieldClass =
  "h-10 w-full rounded-xl border border-line bg-surface px-3 text-body text-ink outline-none placeholder:text-ink/30 focus:border-brand aria-invalid:border-danger";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  const invalid = !!state?.error;

  return (
    <form action={action} noValidate>
      {next && <input type="hidden" name="next" value={next} />}

      <div className="flex flex-col gap-[5px]">
        <label htmlFor="email" className="text-body font-bold text-ink">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "login-error" : undefined}
          placeholder="e.g peter@wemabank.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-[5px] pt-[30px]">
        <label htmlFor="password" className="text-body font-bold text-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "login-error" : undefined}
          placeholder="***"
          className={fieldClass}
        />
      </div>

      {invalid && (
        <p id="login-error" role="alert" className="mt-4 rounded-button bg-danger/10 px-3 py-2 text-meta font-medium text-danger">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        size="wide"
        radius="rounded-xl"
        disabled={pending}
        className="mt-10 h-10 w-full justify-center gap-3"
      >
        {pending ? "Signing in…" : "Sign in"}
        <MaskIcon src="/icons/arrow-right.svg" size={16} />
      </Button>
    </form>
  );
}
