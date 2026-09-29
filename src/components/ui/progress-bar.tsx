import { cn } from "@/lib/cn";

const SIZES = {
  sm: "h-[5px]", // table cells
  md: "h-1.5", // cards, lists
  lg: "h-2", // headline totals
} as const;

type ProgressBarProps = {
  /** 0–100 */
  value: number;
  /** Tailwind bg-* class for the fill */
  color?: string;
  size?: keyof typeof SIZES;
  /** Spacing/flex classes only — width is full, height comes from `size` */
  className?: string;
  label?: string;
};

export function ProgressBar({ value, color = "bg-brand", size = "md", className, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("w-full overflow-hidden rounded-full bg-track", SIZES[size], className)}
    >
      <div className={cn("h-full rounded-full", color)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
