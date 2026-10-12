"use client";

import { useState } from "react";
import { AddMemberModal } from "@/components/modals/add-member-modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function AddMemberButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon src="/icons/plus.svg" size={15} />
        Add Member
      </Button>
      <AddMemberModal key={open ? "open" : "closed"} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
