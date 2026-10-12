"use client";

import { useState } from "react";
import { useViewer } from "@/components/auth/viewer-context";
import { NewInitiativeModal } from "@/components/modals/new-initiative-modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { isAdmin } from "@/lib/viewer";

/** “New Project” for the Projects page header. Admins only. */
export function NewProjectButton() {
  const viewer = useViewer();
  const [open, setOpen] = useState(false);
  if (!isAdmin(viewer)) return null;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon src="/icons/plus.svg" size={16} />
        New Project
      </Button>
      <NewInitiativeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
