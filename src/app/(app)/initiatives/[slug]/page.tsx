import { notFound } from "next/navigation";
import { PhaseProgress } from "@/components/initiative-detail/phase-progress";
import { StrategicAlignment } from "@/components/initiative-detail/strategic-alignment";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/headers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getInitiative } from "@/lib/data";

export default async function InitiativeOverviewPage({ params }: PageProps<"/initiatives/[slug]">) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,541fr)_minmax(0,259fr)]">
      <div className="flex flex-col gap-6">
        {initiative.details && (
          <Card className="rounded-card p-6">
            <SectionHeader title="Program Details" />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4 sm:grid-cols-4">
              {initiative.details.map((detail) => (
                <div key={detail.label}>
                  <dt className="text-meta text-muted">{detail.label}</dt>
                  <dd className="pt-0.5 text-body font-medium text-ink">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        )}
        <PhaseProgress phases={initiative.phases ?? []} />
      </div>

      <div className="flex flex-col gap-6">
        <StrategicAlignment objectives={initiative.objectives ?? {}} />
        <Card className="rounded-card p-6 text-center">
          <p className="text-body text-muted">Overall Progress</p>
          <p className="pt-3 text-[2.5rem] leading-12 font-black text-ink">{initiative.progress}%</p>
          <ProgressBar value={initiative.progress} size="lg" className="mt-3" label="Overall progress" />
        </Card>
      </div>
    </div>
  );
}
