import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  /** Magenta call-to-action, e.g. “New Projects” */
  primary: "gap-1.5 bg-brand font-bold text-white hover:bg-brand-deep disabled:opacity-40 disabled:hover:bg-brand",
  /** White bordered button, e.g. “This Year”, “Cancel” */
  secondary: "gap-1.5 border border-line bg-surface font-medium text-ink-soft hover:bg-page",
  /** Transparent bordered button with ink label, e.g. modal “Back” */
  outline: "gap-1.5 border border-line font-medium text-ink hover:bg-page",
  /** Bordered square icon button */
  icon: "size-9 justify-center rounded-xl border border-line bg-surface hover:bg-page",
  /** Inline text link-style button, e.g. “View all →” */
  link: "gap-1 text-body font-medium text-brand-deep hover:underline",
} as const;

const SIZES = {
  /** Top-bar CTA: 12px label */
  sm: "px-5 py-2.5 text-meta",
  /** Page/modal actions: 14px label */
  md: "px-4 py-2 text-body",
  /** Modal primary actions: 14px, 20px side padding */
  wide: "px-5 py-2 text-body",
  /** Compact 14px, e.g. the “This Year” period picker */
  tight: "px-3 py-2 text-body",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Corner radius for primary/secondary buttons (Figma varies it per context) */
  radius?: string;
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  className?: string,
  size: ButtonSize = "md",
  radius = "rounded-lg",
) {
  return cn(
    "inline-flex shrink-0 items-center whitespace-nowrap transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    VARIANTS[variant],
    variant !== "icon" && variant !== "link" && cn(SIZES[size], radius),
    className,
  );
}

export function Button({ variant = "primary", size = "md", radius, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className, size, radius)} {...props} />;
}
