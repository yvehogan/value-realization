import type { Metadata } from "next";
import { TeamView } from "@/components/team/team-view";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/headers";
import { Icon } from "@/components/ui/icon";
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
        action={
          isAdmin(viewer) && (
            <Button>
              <Icon src="/icons/plus.svg" size={15} />
              Add Member
            </Button>
          )
        }
      />
      <TeamView />
    </>
  );
}
