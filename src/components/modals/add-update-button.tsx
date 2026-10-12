"use client";

import { useMemo, useState } from "react";
import { useViewer } from "@/components/auth/viewer-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toProjectSummary, type ProjectSummary } from "@/lib/api/adapters";
import { useProjects } from "@/lib/api/queries";
import { canUpdateProject, isAdmin } from "@/lib/viewer";
import { AddUpdateModal } from "./add-update-modal";

/**
 * “Add Update” button that owns its modal. Pass a project to update that one; without it the
 * viewer picks from the projects they can update. Hidden when there's nothing they can update.
 */
export function AddUpdateButton({ project, className }: { project?: ProjectSummary; className?: string }) {
  const [open, setOpen] = useState(false);
  const viewer = useViewer();

  // Global mode only: admins can update any project, members only their own.
  const list = useProjects(isAdmin(viewer) ? {} : { AssignedUserId: viewer.id }, { enabled: !project });
  const updatable = useMemo(() => (list.data?.data ?? []).map(toProjectSummary), [list.data]);

  if (project ? !canUpdateProject(viewer, project) : updatable.length === 0) return null;

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
        project={project}
        projects={updatable}
      />
    </>
  );
}
