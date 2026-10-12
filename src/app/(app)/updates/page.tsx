import type { Metadata } from "next";
import { AddUpdateButton } from "@/components/modals/add-update-button";
import { UpdatesFeed } from "@/components/updates/updates-feed";
import { PageHeader } from "@/components/ui/headers";

export const metadata: Metadata = { title: "Updates · Nexus" };

export default function UpdatesPage() {
  return (
    <>
      <PageHeader
        title="Updates"
        description="A live feed of progress across the Innovation portfolio."
        action={<AddUpdateButton />}
      />
      <UpdatesFeed />
    </>
  );
}
