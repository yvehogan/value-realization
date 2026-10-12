// The signed-in person as the UI sees them. Safe to pass to client components.

export type Role = "admin" | "user";

export type Viewer = {
  /** API user id */
  id: string;
  name: string;
  firstName: string;
  initials: string;
  /** Team role, e.g. “Backend Engineer” */
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

/** Admins can update anything; members only projects they're assigned to. */
export function canUpdateProject(viewer: Viewer, project: { owners: { id: string }[] }) {
  return isAdmin(viewer) || project.owners.some((owner) => owner.id === viewer.id);
}
