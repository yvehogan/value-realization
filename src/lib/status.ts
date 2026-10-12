export type Status =
  | "on-track"
  | "at-risk"
  | "on-hold"
  | "not-started"
  | "completed";

/** Label + tinted pill colours. Status colours are reserved for state only. */
export const STATUS_STYLES: Record<Status, { label: string; text: string; bg: string; dot: string }> = {
  "on-track": { label: "On Track", text: "text-success", bg: "bg-success/10", dot: "bg-success" },
  "at-risk": { label: "At Risk", text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" },
  "on-hold": { label: "On Hold", text: "text-danger", bg: "bg-danger/10", dot: "bg-danger" },
  "not-started": { label: "Not Started", text: "text-muted", bg: "bg-track", dot: "bg-subtle" },
  completed: { label: "Completed", text: "text-success", bg: "bg-success/10", dot: "bg-success" },
};
