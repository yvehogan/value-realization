"use client";

import { createContext, useContext, type ReactNode } from "react";
import { PageLoader } from "@/components/ui/loader";
import { ErrorState } from "@/components/ui/query-state";
import { ApiError } from "@/lib/api/client";
import { useProject } from "@/lib/api/queries";
import type { ProjectDetail } from "@/lib/api/types";
import { DetailTabs } from "./detail-tabs";
import { InitiativeHeader } from "./initiative-header";

const ProjectContext = createContext<ProjectDetail | null>(null);

/** The project loaded by the surrounding <ProjectShell>. */
export function useLoadedProject() {
  const project = useContext(ProjectContext);
  if (!project) throw new Error("useLoadedProject must be used inside <ProjectShell>");
  return project;
}

/** Loads a project once and renders its header, tabs and the active tab. */
export function ProjectShell({ id, children }: { id: string; children: ReactNode }) {
  const project = useProject(id);

  if (project.isPending) {
    return <PageLoader label="Loading initiative…" className="mt-6 min-h-[420px]" />;
  }
  if (project.isError) {
    const missing = project.error instanceof ApiError && project.error.status === 404;
    return (
      <div className="pt-6">
        {missing ? (
          <ErrorState error={new ApiError("This initiative doesn't exist or has been removed.", 404)} />
        ) : (
          <ErrorState error={project.error} onRetry={() => project.refetch()} />
        )}
      </div>
    );
  }

  return (
    <ProjectContext.Provider value={project.data}>
      <div className="pt-6">
        <InitiativeHeader project={project.data} />
      </div>
      <div className="pt-6">
        <DetailTabs id={id} />
      </div>
      <div className="pt-6">{children}</div>
    </ProjectContext.Provider>
  );
}
