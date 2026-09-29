export type Status =
  | "on-track"
  | "at-risk"
  | "off-track"
  | "not-started"
  | "completed"
  | "in-progress"
  | "upcoming";

/** Label + tinted pill colours. Status colours are reserved for state only. */
export const STATUS_STYLES: Record<Status, { label: string; text: string; bg: string; dot: string }> = {
  "on-track": { label: "On Track", text: "text-success", bg: "bg-success/10", dot: "bg-success" },
  "at-risk": { label: "At Risk", text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" },
  "off-track": { label: "Off Track", text: "text-danger", bg: "bg-danger/10", dot: "bg-danger" },
  "not-started": { label: "Not Started", text: "text-muted", bg: "bg-track", dot: "bg-subtle" },
  completed: { label: "Completed", text: "text-success", bg: "bg-success/10", dot: "bg-success" },
  "in-progress": { label: "In Progress", text: "text-program", bg: "bg-program/10", dot: "bg-program" },
  upcoming: { label: "Upcoming", text: "text-muted", bg: "bg-track", dot: "bg-subtle" },
};

/** Statuses a user can pick for an initiative */
export const INITIATIVE_STATUSES: Status[] = ["not-started", "on-track", "at-risk", "off-track", "completed"];
