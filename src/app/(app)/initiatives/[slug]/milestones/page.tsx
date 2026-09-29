import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/cn";
import { getInitiative, getPerson } from "@/lib/data";

export default async function MilestonesPage({ params }: PageProps<"/initiatives/[slug]/milestones">) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();
  const phases = initiative.phases ?? [];

  return (
    <Card className="rounded-card p-6">
      {phases.length === 0 ? (
        <p className="text-body text-muted">No milestones recorded yet.</p>
      ) : (
        <ol>
          {phases.map((phase, i) => {
            const owner = getPerson(phase.ownerId);
            const done = phase.status === "completed";
            const last = i === phases.length - 1;
            return (
              <li key={phase.name} className="flex gap-4">
                {/* Timeline marker + connector */}
                <div className="flex w-7 flex-col items-center">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-body font-bold",
                      done
                        ? "bg-success text-white"
                        : phase.status === "in-progress"
                          ? "bg-program/10 text-program"
                          : "bg-track text-subtle",
                    )}
                    aria-hidden
                  >
                    {done ? "✓" : "●"}
                  </span>
                  {!last && <span className="my-1 w-px flex-1 bg-line" />}
                </div>
                <div className={cn("min-w-0 flex-1", !last && "pb-6")}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-base font-bold text-ink">{phase.name}</h3>
                    <StatusPill status={phase.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1.5 text-meta text-muted">
                    <span>Target: {phase.target}</span>
                    {phase.completed && <span>Completed: {phase.completed}</span>}
                    {owner && (
                      <span className="flex items-center gap-1.5">
                        <Avatar initials={owner.initials} color={owner.color} size="2xs" />
                        {owner.name}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
