import { notFound } from "next/navigation";
import { Donut } from "@/components/charts/donut";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/headers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getInitiative } from "@/lib/data";

export default async function InitiativeValuePage({ params }: PageProps<"/initiatives/[slug]/value">) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();

  if (!initiative.value) {
    return <Card className="rounded-card p-6 text-body text-muted">No value has been tracked for this initiative yet.</Card>;
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,541fr)_minmax(0,259fr)]">
      <Card className="rounded-card p-6">
        <SectionHeader title="Value Realization" description="Expected versus realized value" />
        <ul className="flex flex-col gap-5 pt-5">
          {initiative.value.lines.map((line) => (
            <li key={line.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-base font-bold text-ink">{line.label}</span>
                <span className="text-body text-ink-soft">
                  {line.realized} / {line.expected}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <ProgressBar value={line.progress} size="lg" className="flex-1" label={`${line.label} realized`} />
                <span className="w-9 text-right text-body font-medium text-ink">{line.progress}%</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="flex flex-col items-center gap-4 rounded-card p-6 text-center">
        <p className="text-body font-medium text-ink">Overall Value Realization</p>
        <Donut value={initiative.value.overall} label="Overall value realization" />
        <p className="text-body text-muted">of expected value realized to date</p>
      </Card>
    </div>
  );
}
