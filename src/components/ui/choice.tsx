import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ChoiceCardProps = ComponentPropsWithoutRef<"button"> & { selected: boolean };

/** Selectable bordered tile (type picker, people picker, objective picker). */
export function ChoiceCard({ selected, className, type = "button", ...props }: ChoiceCardProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        "rounded-xl border bg-surface text-left transition-colors",
        selected ? "border-brand" : "border-line hover:border-plum-muted",
        className,
      )}
      {...props}
    />
  );
}
