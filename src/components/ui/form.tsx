import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

const control =
  "w-full rounded-xl border border-line bg-surface px-3 text-body text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand";

type FieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

/** Label + control + optional hint, stacked. */
export function Field({ label, hint, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-body font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-meta text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(control, "h-[38px]", className)} {...props} />;
}

export function TextArea({ className, rows = 3, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea rows={rows} className={cn(control, "resize-none py-2", className)} {...props} />;
}

/** Native select styled to match the Figma dropdowns. */
export function Select({ className, children, ...props }: ComponentPropsWithoutRef<"select">) {
  return (
    <span className={cn("relative block", className)}>
      <select className={cn(control, "h-[38px] appearance-none pr-9 font-medium")} {...props}>
        {children}
      </select>
      <Icon src="/icons/select-chevron.svg" size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
    </span>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-brand" : "bg-line",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-surface shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
