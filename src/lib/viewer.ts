// The signed-in person as the UI sees them. Safe to pass to client components.

export type Role = "admin" | "user";

export type Viewer = {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  /** Job title, e.g. “Head of Innovation” */
  title: string;
  role: Role;
  /** Tailwind bg-* class for the avatar */
  color: string;
};

export const ROLE_LABEL: Record<Role, { short: string; access: string }> = {
  admin: { short: "Admin", access: "Full access" },
  user: { short: "Member", access: "Updates own initiatives" },
};

export const isAdmin = (viewer: Viewer) => viewer.role === "admin";

/** Admins can update anything; members only initiatives they're responsible for. */
export function canUpdateInitiative(viewer: Viewer, initiative: { ownerIds: string[] }) {
  return isAdmin(viewer) || initiative.ownerIds.includes(viewer.id);
}
