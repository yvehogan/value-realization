"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/headers";
import { InlineProgress } from "@/components/ui/inline-progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusPill } from "@/components/ui/status-pill";
import { TypeBadge } from "@/components/ui/type-badge";
import { cn } from "@/lib/cn";
import { INITIATIVES, OBJECTIVES } from "@/lib/data";
import { TYPE_STYLES } from "@/lib/initiative-types";

function contributorsTo(objectiveId: string) {
  return INITIATIVES.filter((i) => i.objectives && objectiveId in i.objectives);
}

export function ObjectivesExplorer({ initialObjective }: { initialObjective: string }) {
  const [selected, setSelected] = useState(initialObjective);
  const objective = OBJECTIVES.find((o) => o.id === selected) ?? OBJECTIVES[0];
  const contributors = contributorsTo(objective.id);

  return (
    <>
      <section className="pt-8">
        <SectionHeader title="Strategic Objectives" description="Select an objective to see contributing initiatives" />
        <div className="grid gap-4 pt-4 md:grid-cols-2" role="radiogroup" aria-label="Strategic objectives">
          {OBJECTIVES.map((o) => {
            const active = o.id === objective.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(o.id)}
                className={cn(
                  "rounded-2xl border bg-surface p-5 text-left transition-colors",
                  active ? "border-brand ring-1 ring-brand" : "border-line hover:border-plum-muted",
                )}
              >
                <span className="block text-base font-bold text-ink">{o.name}</span>
                <span className="block pt-3 text-stat leading-8 font-black text-ink">{o.progress}%</span>
                <span className="block pt-1 text-meta text-muted">
                  {o.realized} / {o.target}
                </span>
                <ProgressBar value={o.progress} className="mt-3" label={`${o.name} progress`} />
                <span className="block pt-2 text-meta text-muted">{contributorsTo(o.id).length} initiatives</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="pt-8" aria-live="polite">
        <SectionHeader
          title={`Contributing to “${objective.name}”`}
          description={`${contributors.length} initiatives`}
        />
        <Card elevated className="mt-4 rounded-2xl">
          <ul className="divide-y divide-line">
            {contributors.map((initiative) => (
              <li key={initiative.slug} className="relative flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3.5 hover:bg-page/50">
                <Link
                  href={`/initiatives/${initiative.slug}`}
                  className="w-40 text-base font-semibold text-ink after:absolute after:inset-0"
                >
                  {initiative.name}
                </Link>
                <TypeBadge type={initiative.type} />
                <StatusPill status={initiative.status} />
                <span className="ml-auto flex items-center gap-3">
                  <span className="text-meta text-muted">Contribution {initiative.objectives![objective.id]}%</span>
                  <InlineProgress value={initiative.progress} color={TYPE_STYLES[initiative.type].bg} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </>
  );
}
