"use client";

import Link from "next/link";
import { UpdateLabel, updateLines } from "@/components/updates/update-tag";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MaskIcon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/headers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/query-state";
import { authorOf, formatDate, timeAgo, typeFromName } from "@/lib/api/adapters";
import type { ProjectDetail, ProjectUpdateFeedItem } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { TYPE_STYLES } from "@/lib/initiative-types";
import { useLoadedProject } from "./project-shell";

const PRIORITY_STYLES = { High: "text-danger", Medium: "text-warning", Low: "text-muted" } as const;

/** Objectives this project has reported against, with how many updates referenced each. */
function linkedObjectives(project: ProjectDetail) {
  const counts = new Map<string, { name: string; count: number }>();
  for (const update of [...project.value, ...project.updates]) {
    if (!update.objectiveId) continue;
    const entry = counts.get(update.objectiveId) ?? { name: update.objectiveName ?? "Objective", count: 0 };
    entry.count += 1;
    counts.set(update.objectiveId, entry);
  }
  return [...counts].map(([id, entry]) => ({ id, ...entry }));
}

export function ProjectOverview() {
  const project = useLoadedProject();
  const objectives = linkedObjectives(project);
  const latestMilestones = project.milestones.slice(0, 3);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,541fr)_minmax(0,259fr)]">
      <div className="flex flex-col gap-6">
        <Card className="rounded-card p-6">
          <SectionHeader title="Details" />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4 sm:grid-cols-4">
            {[
              { label: "Type", value: TYPE_STYLES[typeFromName(project.projectTypeName)].label },
              { label: "Priority", value: project.priority, className: PRIORITY_STYLES[project.priority] },
              { label: "Start Date", value: formatDate(project.startDate) },
              { label: "Target Date", value: formatDate(project.targetDate) },
            ].map((detail) => (
              <div key={detail.label}>
                <dt className="text-meta text-muted">{detail.label}</dt>
                <dd className={cn("pt-0.5 text-body font-medium text-ink", detail.className)}>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="rounded-card p-6">
          <SectionHeader
            title="Latest Milestones"
            action={
              project.milestones.length > 3 && (
                <Link href={`/initiatives/${project.id}/milestones`} className="text-body font-medium text-brand-deep hover:underline">
                  View all
                </Link>
              )
            }
          />
          {latestMilestones.length === 0 ? (
            <p className="pt-4 text-body text-muted">No milestones recorded yet.</p>
          ) : (
            <ul className="flex flex-col gap-3 pt-4">
              {latestMilestones.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-4 text-body">
                  <span className="flex items-center gap-2.5 text-ink">
                    <span aria-hidden className="flex size-5 items-center justify-center rounded-full bg-success text-[10px] text-white">
                      ✓
                    </span>
                    {m.milestoneName}
                  </span>
                  <span className="shrink-0 text-meta text-muted">{formatDate(m.milestoneDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="rounded-card p-6">
          <SectionHeader title="Strategic Alignment" />
          {objectives.length === 0 ? (
            <p className="pt-4 text-body text-muted">Not linked to an objective yet.</p>
          ) : (
            <ul className="flex flex-col gap-3 pt-4">
              {objectives.map((o) => (
                <li key={o.id}>
                  <Link href={`/value-realization?objective=${o.id}`} className="group flex items-start justify-between gap-3 text-body">
                    <span className="text-ink-soft group-hover:text-ink">{o.name}</span>
                    <span className="shrink-0 text-meta text-muted">
                      {o.count} update{o.count === 1 ? "" : "s"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="rounded-card p-6 text-center">
          <p className="text-body text-muted">Overall Progress</p>
          <p className="pt-3 text-[2.5rem] leading-12 font-black text-ink">{project.progressPercentage}%</p>
          <ProgressBar value={project.progressPercentage} size="lg" className="mt-3" label="Overall progress" />
        </Card>
      </div>
    </div>
  );
}

function Recorder({ update }: { update: ProjectUpdateFeedItem }) {
  const author = authorOf(update);
  if (!author) return null;
  return (
    <Link href={`/team/${author.id}`} className="flex items-center gap-1.5 hover:underline">
      <Avatar initials={author.initials} color={author.color} size="2xs" />
      {author.name}
    </Link>
  );
}

export function ProjectMilestones() {
  const project = useLoadedProject();
  if (project.milestones.length === 0) return <EmptyState className="rounded-card p-6 text-left">No milestones recorded yet.</EmptyState>;

  return (
    <Card className="rounded-card p-6">
      <ol>
        {project.milestones.map((milestone, i) => {
          const last = i === project.milestones.length - 1;
          return (
            <li key={milestone.id} className="flex gap-4">
              {/* Timeline marker + connector */}
              <div className="flex w-7 flex-col items-center">
                <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success text-body font-bold text-white">
                  ✓
                </span>
                {!last && <span className="my-1 w-px flex-1 bg-line" />}
              </div>
              <div className={cn("min-w-0 flex-1", !last && "pb-6")}>
                <h3 className="text-base font-bold text-ink">{milestone.milestoneName}</h3>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1.5 text-meta text-muted">
                  <span>Achieved: {formatDate(milestone.milestoneDate)}</span>
                  <span>Recorded {timeAgo(milestone.createdAtUtc)}</span>
                  <Recorder update={milestone} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export function ProjectValue() {
  const project = useLoadedProject();
  if (project.value.length === 0) {
    return <EmptyState className="rounded-card p-6 text-left">No value has been tracked for this initiative yet.</EmptyState>;
  }

  return (
    <Card className="rounded-card p-6">
      <SectionHeader title="Value Realization" description="Value metrics reported for this initiative" />
      <ul className="divide-y divide-line pt-2">
        {project.value.map((entry) => (
          <li key={entry.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1 py-4">
            <div>
              <p className="text-base font-bold text-ink">{entry.metric}</p>
              {entry.objectiveName && <p className="pt-0.5 text-body text-ink-soft">{entry.objectiveName}</p>}
            </div>
            <div className="flex items-center gap-4 text-meta text-muted">
              <Recorder update={entry} />
              <span>{formatDate(entry.createdAtUtc)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function ProjectUpdates() {
  const project = useLoadedProject();

  return (
    <div className="flex flex-col gap-4">
      {project.updates.length === 0 ? (
        <EmptyState className="rounded-card p-6 text-left">No updates yet. Be the first to share progress.</EmptyState>
      ) : (
        project.updates.map((update) => {
          const author = authorOf(update);
          return (
            <Card key={update.id} className="rounded-card p-5">
              <div className="flex items-center gap-3">
                {author && <Avatar initials={author.initials} color={author.color} size="md" />}
                <div>
                  <p className="text-body font-bold text-ink">{author?.name ?? "Unknown"}</p>
                  <p className="text-meta text-muted">
                    {formatDate(update.createdAtUtc)} · {timeAgo(update.createdAtUtc)}
                  </p>
                </div>
                {update.progressPercentage !== null && (
                  <span className="ml-auto text-meta text-muted">Progress {update.progressPercentage}%</span>
                )}
              </div>
              <dl className="flex flex-col gap-2.5 pt-4">
                {updateLines(update).map((line) => (
                  <div key={line.kind} className="flex items-start gap-3">
                    <dt>
                      <UpdateLabel kind={line.kind} long />
                    </dt>
                    <dd className="text-body text-ink-soft">{line.text}</dd>
                  </div>
                ))}
              </dl>
              {update.evidenceAttachmentUrl && (
                <a
                  href={update.evidenceAttachmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-body font-medium text-brand-deep hover:underline"
                >
                  <MaskIcon src="/icons/paperclip.svg" size={14} />
                  View evidence
                </a>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
