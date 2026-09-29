"use client";

import { useState } from "react";
import { useViewer } from "@/components/auth/viewer-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { INITIATIVES } from "@/lib/data";
import { canUpdateInitiative } from "@/lib/viewer";
import { AddUpdateModal } from "./add-update-modal";

/**
 * “Add Update” button that owns its modal. Pass an initiative to preselect it.
 * Hidden when the viewer can't update it (members: only their own initiatives).
 */
export function AddUpdateButton({ initiativeSlug, className }: { initiativeSlug?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const viewer = useViewer();
  const initiative = INITIATIVES.find((i) => i.slug === initiativeSlug);
  const updatable = INITIATIVES.filter((i) => canUpdateInitiative(viewer, i));

  if (initiative ? !canUpdateInitiative(viewer, initiative) : updatable.length === 0) return null;

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className}>
        <Icon src="/icons/plus.svg" size={16} />
        Add Update
      </Button>
      <AddUpdateModal
        key={open ? "open" : "closed"}
        open={open}
        onClose={() => setOpen(false)}
        initiative={initiative}
        initiatives={updatable}
      />
    </>
  );
}
