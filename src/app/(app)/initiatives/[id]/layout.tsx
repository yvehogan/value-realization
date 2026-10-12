import type { Metadata } from "next";
import { ProjectShell } from "@/components/initiative-detail/project-shell";
import { BackLink } from "@/components/ui/back-link";

export const metadata: Metadata = { title: "Initiative · Nexus" };

export default async function InitiativeLayout({ params, children }: LayoutProps<"/initiatives/[id]">) {
  const { id } = await params;

  return (
    <>
      <BackLink href="/initiatives" label="Portfolio" />
      {/* key: a different project starts from a fresh loading state */}
      <ProjectShell key={id} id={id}>
        {children}
      </ProjectShell>
    </>
  );
}
