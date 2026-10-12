import type { Metadata } from "next";
import { AddMemberButton } from "@/components/team/add-member-button";
import { TeamView } from "@/components/team/team-view";
import { PageHeader } from "@/components/ui/headers";
import { requireViewer } from "@/lib/auth";
import { isAdmin } from "@/lib/viewer";

export const metadata: Metadata = { title: "Team · Nexus" };

export default async function TeamPage() {
  const viewer = await requireViewer();

  return (
    <>
      <PageHeader
        title="Team"
        description="The Innovation team and what everyone is working on."
        action={isAdmin(viewer) && <AddMemberButton />}
      />
      <TeamView />
    </>
  );
}
