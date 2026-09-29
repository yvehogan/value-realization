import { cn } from "@/lib/cn";

export type UpdateKind = "achievement" | "next" | "blocker" | "metric";

const KIND_STYLES: Record<UpdateKind, { short: string; long: string; text: string; bg: string }> = {
  achievement: { short: "Achievement", long: "Achievement", text: "text-success", bg: "bg-success/10" },
  next: { short: "Next", long: "Next Step", text: "text-program", bg: "bg-program/10" },
  blocker: { short: "Blocker", long: "Blocker", text: "text-danger", bg: "bg-danger/10" },
  metric: { short: "Metric", long: "Metric Update", text: "text-product", bg: "bg-product/10" },
};

/** Coloured label chip for a line of an update. */
export function UpdateLabel({ kind, long }: { kind: UpdateKind; long?: boolean }) {
  const style = KIND_STYLES[kind];
  return (
    <span className={cn("inline-flex shrink-0 rounded-md px-2 py-0.5 text-meta font-bold", style.text, style.bg)}>
      {long ? style.long : style.short}
    </span>
  );
}

/** Label + text in a single tinted tag (Updates feed). */
export function UpdateTag({ kind, children }: { kind: UpdateKind; children: string }) {
  const style = KIND_STYLES[kind];
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-page px-2.5 py-1 text-meta text-ink-soft">
      <span className={cn("font-bold", style.text)}>{style.short}</span>
      {children}
    </span>
  );
}

export function updateLines(update: { achievement: string; next?: string; blocker?: string; metric?: string }) {
  const lines: { kind: UpdateKind; text: string }[] = [{ kind: "achievement", text: update.achievement }];
  if (update.next) lines.push({ kind: "next", text: update.next });
  if (update.blocker) lines.push({ kind: "blocker", text: update.blocker });
  if (update.metric) lines.push({ kind: "metric", text: update.metric });
  return lines;
}
