import { formatDate } from "@/lib/api/adapters";
import type { ProjectUpdateFeedItem } from "@/lib/api/types";
import { cn } from "@/lib/cn";

export type UpdateKind = "achievement" | "next" | "blocker" | "milestone" | "metric";

const KIND_STYLES: Record<UpdateKind, { short: string; long: string; text: string; bg: string }> = {
  achievement: { short: "Achievement", long: "Achievement", text: "text-success", bg: "bg-success/10" },
  next: { short: "Next", long: "Next Step", text: "text-program", bg: "bg-program/10" },
  blocker: { short: "Blocker", long: "Blocker", text: "text-danger", bg: "bg-danger/10" },
  milestone: { short: "Milestone", long: "Milestone", text: "text-venture", bg: "bg-venture/10" },
  metric: { short: "Metric", long: "Value Metric", text: "text-product", bg: "bg-product/10" },
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

type UpdateFields = Pick<
  ProjectUpdateFeedItem,
  "achievement" | "nextStep" | "blocker" | "milestoneName" | "milestoneDate" | "metric" | "objectiveName"
>;

/** The labelled lines an update shows, in display order. */
export function updateLines(update: UpdateFields) {
  const lines: { kind: UpdateKind; text: string }[] = [];
  if (update.achievement) lines.push({ kind: "achievement", text: update.achievement });
  if (update.nextStep) lines.push({ kind: "next", text: update.nextStep });
  if (update.blocker) lines.push({ kind: "blocker", text: update.blocker });
  if (update.milestoneName) {
    const date = update.milestoneDate ? ` · ${formatDate(update.milestoneDate)}` : "";
    lines.push({ kind: "milestone", text: update.milestoneName + date });
  }
  if (update.metric) {
    lines.push({ kind: "metric", text: update.objectiveName ? `${update.metric} → ${update.objectiveName}` : update.metric });
  }
  return lines;
}
