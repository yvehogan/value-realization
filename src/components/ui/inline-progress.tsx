import { ProgressBar } from "./progress-bar";

/** Compact 80px bar + percentage, used in table cells and lists. */
export function InlineProgress({ value, color = "bg-brand" }: { value: number; color?: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className="w-20 shrink-0">
        <ProgressBar value={value} color={color} size="sm" />
      </span>
      <span className="w-9 text-meta font-medium text-ink-soft tabular-nums">{value}%</span>
    </span>
  );
}
