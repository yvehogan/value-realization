"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  count?: number;
};

type SegmentedProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** `solid` = magenta active pill (filters); `soft` = pink active pill (view toggles) */
  tone?: "solid" | "soft";
  label: string;
};

/** Bordered pill group used for type filters, team categories and view toggles. */
export function Segmented<T extends string>({ options, value, onChange, tone = "solid", label }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-1 rounded-xl border border-line bg-surface p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-lg py-1.5 text-body font-medium transition-colors",
              tone === "solid" ? "px-3.5" : "gap-1.5 px-3",
              active
                ? tone === "solid"
                  ? "bg-brand text-white"
                  : "bg-page text-ink"
                : cn(tone === "solid" ? "text-ink-soft" : "text-muted", "hover:bg-page"),
            )}
          >
            {option.icon}
            {option.label}
            {option.count !== undefined && (
              <span className={cn("text-meta", active ? "text-white/80" : "text-subtle")}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
