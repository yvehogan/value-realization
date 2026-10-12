import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { TypeBadge } from "@/components/ui/type-badge";
import { AddUpdateButton } from "@/components/modals/add-update-button";
import { toProjectSummary } from "@/lib/api/adapters";
import type { ProjectDetail } from "@/lib/api/types";

export function InitiativeHeader({ project }: { project: ProjectDetail }) {
  const summary = toProjectSummary(project);
  return (
    <Card className="flex flex-col-reverse gap-5 rounded-card p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
      <div className="max-w-[672px] min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <TypeBadge type={summary.type} />
          <StatusPill status={summary.status} size="md" />
        </div>
        <h1 className="pt-2 text-display font-black text-ink">{summary.name}</h1>
        {summary.description && <p className="pt-2 text-lead text-muted">{summary.description}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {summary.owners.map((person) => (
            <Link
              key={person.id}
              href={`/team/${person.id}`}
              className="flex items-center gap-2 rounded-full border border-line bg-surface py-[5px] pr-3 pl-[5px] text-meta font-medium text-ink-soft hover:border-plum-muted"
            >
              <Avatar initials={person.initials} color={person.color} size="xs" />
              {person.name}
            </Link>
          ))}
          <span className="pl-4 text-meta text-muted">Last updated {summary.lastUpdated}</span>
        </div>
      </div>

      {/* Phones: progress left, button right, above the title. Wider: a column beside it. */}
      <div className="flex flex-row-reverse items-center justify-between gap-3 sm:flex-col sm:items-center">
        <AddUpdateButton project={summary} />
        <div className="sm:text-center">
          <p className="text-stat leading-10 font-black text-ink">{summary.progress}%</p>
          <p className="text-micro text-muted">Overall Progress</p>
        </div>
      </div>
    </Card>
  );
}
