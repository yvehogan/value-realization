import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { avatarColor, displayName, initialsOf } from "./api/adapters";
import { getSessionProfile } from "./api/server";
import type { Viewer } from "./viewer";

/** The signed-in viewer, or null. Memoised per request. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const profile = await getSessionProfile();
  if (!profile) return null;
  const name = displayName(profile.fullName, profile.email);
  const admin = profile.roles.some((r) => r === "Admin" || r === "SuperAdmin");
  return {
    id: profile.id,
    name,
    firstName: name.split(" ")[0],
    initials: initialsOf(name),
    title: profile.teamRoleName ?? "Team member",
    role: admin ? "admin" : "user",
    color: avatarColor(profile.id),
  };
});

/** The signed-in viewer; redirects to /login when there's no session. */
export async function requireViewer() {
  const viewer = await getViewer();
  if (!viewer) redirect("/login");
  return viewer;
}
