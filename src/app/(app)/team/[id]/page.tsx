import type { Metadata } from "next";
import { PersonView } from "@/components/team/person-view";
import { BackLink } from "@/components/ui/back-link";

export const metadata: Metadata = { title: "Team member · Nexus" };

export default async function PersonPage({ params }: PageProps<"/team/[id]">) {
  const { id } = await params;

  return (
    <>
      <BackLink href="/team" label="Team" />
      <PersonView key={id} id={id} />
    </>
  );
}
