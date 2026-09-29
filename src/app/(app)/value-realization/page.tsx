import type { Metadata } from "next";
import { ColumnChart } from "@/components/charts/column-chart";
import { ObjectivesExplorer } from "@/components/value/objectives-explorer";
import { Card } from "@/components/ui/card";
import { PageHeader, SectionHeader } from "@/components/ui/headers";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";
import { OBJECTIVES, VALUE_CATEGORIES, VALUE_TOTAL } from "@/lib/data";

export const metadata: Metadata = { title: "Value Realization · Nexus" };

export default async function ValueRealizationPage({ searchParams }: PageProps<"/value-realization">) {
  const { objective } = await searchParams;
  const initialObjective =
    typeof objective === "string" && OBJECTIVES.some((o) => o.id === objective) ? objective : OBJECTIVES[0].id;

  return (
    <>
      <PageHeader title="Value Realization" description="Measurable value the Innovation portfolio has created." />

      <div className="grid items-stretch gap-6 pt-8 lg:grid-cols-[minmax(0,541fr)_minmax(0,259fr)]">
        <Card className="rounded-card p-6">
          <SectionHeader title="Value by Category" description="Percentage of target realized" />
          <div className="pt-6">
            <ColumnChart
              label="Value by category, percentage of target realized"
              data={VALUE_CATEGORIES.map((c) => ({ label: c.label, value: c.ofTarget, detail: `${c.value} realized` }))}
            />
          </div>
        </Card>

        <Card className="rounded-card p-6">
          <SectionHeader title="Total Realized" />
          <p className="pt-4 text-[2rem] leading-10 font-black text-ink">{VALUE_TOTAL.realized}</p>
          <p className="text-body text-muted">of {VALUE_TOTAL.target} target</p>
          <ProgressBar value={VALUE_TOTAL.progress} size="lg" className="mt-4" label="Total value realized" />
          <dl className="pt-2">
            {VALUE_CATEGORIES.map((c) => (
              <div key={c.label} className="flex items-center justify-between pt-3 text-body">
                <dt className="text-ink-soft">{c.label}</dt>
                <dd className="flex items-center gap-2">
                  <span className="font-bold text-ink">{c.value}</span>
                  <span className="flex items-center gap-0.5 text-meta font-medium text-brand">
                    <Icon src="/icons/trend-up.svg" size={11} />
                    {c.change}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <ObjectivesExplorer key={initialObjective} initialObjective={initialObjective} />
    </>
  );
}
