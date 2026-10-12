"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { MaskIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/loader";

const fieldClass =
  "h-10 w-full rounded-xl border border-line bg-surface px-3 text-body text-ink outline-none placeholder:text-ink/30 focus:border-brand aria-invalid:border-danger";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined);
  const invalid = !!state?.error;
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? "login-error" : undefined}
            placeholder="***"
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
          >
            <MaskIcon src={showPassword ? "/icons/eye-off.svg" : "/icons/eye.svg"} size={20} />
          </button>
        </div>
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
        {pending ? <Spinner size={16} /> : <MaskIcon src="/icons/arrow-right.svg" size={16} />}
      </Button>
    </form>
  );
}
