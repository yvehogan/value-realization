import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { TypeBadge } from "@/components/ui/type-badge";
import { AddUpdateButton } from "@/components/modals/add-update-button";
import { ownersOf } from "@/components/initiatives/initiative-table";
import type { Initiative } from "@/lib/data";

export function InitiativeHeader({ initiative }: { initiative: Initiative }) {
  return (
    <Card className="flex flex-wrap items-start justify-between gap-6 rounded-card p-6">
      <div className="max-w-[672px] min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <TypeBadge type={initiative.type} />
          <StatusPill status={initiative.status} size="md" />
        </div>
        <h1 className="pt-2 text-display font-black text-ink">{initiative.name}</h1>
        {initiative.description && <p className="pt-2 text-lead text-muted">{initiative.description}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {ownersOf(initiative).map((person) => (
            <Link
              key={person.id}
              href={`/team/${person.id}`}
              className="flex items-center gap-2 rounded-full border border-line bg-surface py-[5px] pr-3 pl-[5px] text-meta font-medium text-ink-soft hover:border-plum-muted"
            >
              <Avatar initials={person.initials} color={person.color} size="xs" />
              {person.name}
            </Link>
          ))}
          <span className="pl-4 text-meta text-muted">Last updated {initiative.lastUpdated}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <AddUpdateButton initiativeSlug={initiative.slug} />
        <div className="text-center">
          <p className="text-stat leading-10 font-black text-ink">{initiative.progress}%</p>
          <p className="text-micro text-muted">Overall Progress</p>
        </div>
      </div>
    </Card>
  );
}
