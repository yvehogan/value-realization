import { cn } from "@/lib/cn";
import { STATUS_STYLES, type Status } from "@/lib/status";

type StatusPillProps = {
  status: Status;
  /** `md` is the larger pill used in page headers */
  size?: "sm" | "md";
  className?: string;
};

export function StatusPill({ status, size = "sm", className }: StatusPillProps) {
  const style = STATUS_STYLES[status];
  return <Pill label={style.label} text={style.text} bg={style.bg} dot={style.dot} size={size} className={className} />;
}

type PillProps = {
  label: string;
  text: string;
  bg: string;
  dot: string;
  size?: "sm" | "md";
  className?: string;
};

/** Tinted rounded pill with a leading dot — used for statuses and team categories. */
export function Pill({ label, text, bg, dot, size = "sm", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-micro" : "px-2.5 py-1 text-meta",
        text,
        bg,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
