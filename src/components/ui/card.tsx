import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  /** Adds the soft drop shadow used on raised cards and list panels */
  elevated?: boolean;
};

/** White surface with the standard hairline border. Radius is set by the caller. */
export function Card({ elevated, className, ...props }: CardProps) {
  return (
    <div
      className={cn("border border-line bg-surface", elevated && "shadow-card", className)}
      {...props}
    />
  );
}
