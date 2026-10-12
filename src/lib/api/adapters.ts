// Maps Nexus API values onto the UI's vocabulary (status styles, type colours, avatars, dates).

import type { InitiativeType, Workstream } from "@/lib/initiative-types";
import type { PersonCategory } from "@/lib/people";
import type { Status } from "@/lib/status";
import type { AssignedUser, ProjectListItem, ProjectStatus, TeamCategory, TeamRole } from "./types";

/* ---------------------------------------------------------------- Statuses */

export const API_STATUS: Record<ProjectStatus, Status> = {
  OnTrack: "on-track",
  AtRisk: "at-risk",
  OnHold: "on-hold",
  NotStarted: "not-started",
  Completed: "completed",
};

/** Order used in status pickers and filters. */
export const PROJECT_STATUSES: ProjectStatus[] = ["NotStarted", "OnTrack", "AtRisk", "OnHold", "Completed"];

/* ------------------------------------------------------------ Project types */

const TYPE_BY_NAME: Record<string, Workstream> = {
  product: "product",
  program: "program",
  venture: "venture",
  rnd: "rnd",
  "r&d": "rnd",
};

/** UI type for an API project-type name ("Product", "RnD", …). Unknown names fall back to "others". */
export function typeFromName(name: string | null | undefined): InitiativeType {
  return TYPE_BY_NAME[(name ?? "").trim().toLowerCase()] ?? "others";
}

/* ------------------------------------------------------------------ People */

export const API_CATEGORY: Record<TeamCategory, PersonCategory> = {
  Engineering: "engineering",
  Design: "design",
  Programs: "programs",
  Others: "others",
};

const AVATAR_COLORS = ["bg-success", "bg-program", "bg-product", "bg-warning", "bg-venture", "bg-rnd", "bg-danger", "bg-brand", "bg-plum"];

/** Stable avatar colour per user id. */
export function avatarColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Full name, or a name derived from the email ("evelyn.ita@…" → "Evelyn Ita") when none is set. */
export function displayName(fullName: string | null | undefined, email?: string | null) {
  if (fullName?.trim()) return fullName.trim();
  const local = email?.split("@")[0] ?? "";
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ") || "Unknown"
  );
}

export function initialsOf(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "?";
}

export type PersonRef = { id: string; name: string; initials: string; color: string };

export function toPerson(user: { id: string; fullName: string | null; email?: string | null; initials?: string | null }): PersonRef {
  const name = displayName(user.fullName, user.email);
  return { id: user.id, name, initials: user.initials?.trim() || initialsOf(name), color: avatarColor(user.id) };
}

/** Author of an update, when the API names one. */
export function authorOf(update: { updatedByUserId: string | null; updatedByName: string | null; updatedByInitials: string | null }) {
  if (!update.updatedByUserId) return null;
  return toPerson({ id: update.updatedByUserId, fullName: update.updatedByName, initials: update.updatedByInitials });
}

/* ---------------------------------------------------------------- Projects */

/** The fields the portfolio, cards and headers need from any project shape. */
export type ProjectSummary = {
  id: string;
  name: string;
  description: string | null;
  type: InitiativeType;
  status: Status;
  progress: number;
  lastUpdated: string;
  owners: PersonRef[];
};

export function toProjectSummary(project: ProjectListItem): ProjectSummary {
  return {
    id: project.id,
    name: project.name?.trim() || "Untitled project",
    description: project.description,
    type: typeFromName(project.projectTypeName),
    status: API_STATUS[project.status] ?? "not-started",
    progress: project.progressPercentage,
    lastUpdated: timeAgo(project.lastUpdatedAtUtc),
    owners: project.assignedUsers.map(toPerson),
  };
}

export function isOwner(project: { assignedUsers: AssignedUser[] } | { owners: PersonRef[] }, userId: string) {
  const people = "owners" in project ? project.owners : project.assignedUsers;
  return people.some((p) => p.id === userId);
}

/* ------------------------------------------------------------------- Dates */

const DAY = 24 * 60 * 60 * 1000;

/** Parses an API timestamp. The API sends UTC without a zone ("2026-10-08T13:46:30.94"), so add one. */
export function parseApiDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00`); // date-only: local calendar date
  return new Date(/[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`);
}

/** "Just now", "2 hours ago", "Yesterday", "3 days ago", "2 weeks ago", or a date for older items. */
export function timeAgo(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return "—";
  const then = parseApiDate(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(diff / DAY);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  return formatDate(iso);
}

/** "September 10, 2026". Date-only strings ("2026-09-10") are read as local dates. */
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = parseApiDate(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** "Sep 2026" */
export function formatMonth(value: string | null | undefined) {
  if (!value) return "—";
  const date = parseApiDate(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/* -------------------------------------------------------------- Team roles */

export const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  HeadOfInnovation: "Head of Innovation",
  LabManager: "Lab Manager",
  ProductManager: "Product Manager",
  ProgramAnalyst: "Program Analyst",
  ScrumMaster: "Scrum Master",
  VentureAnalyst: "Venture Analyst",
  RnDAnalyst: "R&D Analyst",
  DesignLead: "Design Lead",
  ProductDesigner: "Product Designer",
  EngineeringLead: "Engineering Lead",
  FrontendEngineer: "Frontend Engineer",
  BackendEngineer: "Backend Engineer",
  MobileEngineer: "Mobile Engineer",
  QAEngineer: "QA Engineer",
};
