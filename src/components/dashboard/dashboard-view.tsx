"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/headers";
import { Icon } from "@/components/ui/icon";
import { PageLoader } from "@/components/ui/loader";
import { EmptyState, ErrorState } from "@/components/ui/query-state";
import { typeFromName } from "@/lib/api/adapters";
import { useDashboard, useValueRealization } from "@/lib/api/queries";
import type { Dashboard, Period } from "@/lib/api/types";
import { WORKSTREAMS_ORDER } from "@/lib/initiative-types";
import { ActivityFeed } from "./activity-feed";
import { StatCard, type Stat } from "./stat-card";
import { WorkstreamCard, type WorkstreamSummary } from "./workstream-card";

const PERIOD_NOUN: Record<Period, string> = { Weekly: "week", Monthly: "month", Quarterly: "quarter", Annually: "year" };

const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

function stats(dashboard: Dashboard, valueMetrics: number | undefined): Stat[] {
  const noun = PERIOD_NOUN[dashboard.period];
  const { activeProjects, objectivesProgress, projectsAtRisk, projectsNeedingAttention } = dashboard;
  return [
    {
      label: "Active Initiatives",
      value: String(activeProjects.current),
      note: `${signed(activeProjects.change)} from last ${noun}`,
      icon: "/icons/stat-active.svg",
      tile: "bg-tile-sky",
      trend: true,
      decoration: "waves-sky",
    },
    // TODO: add the purple wave artwork (Figma node 68:61298) once it can be exported.
    {
      label: "Overall Objectives Progress",
      value: `${objectivesProgress.current}%`,
      note: `${signed(objectivesProgress.change)}% this ${noun}`,
      icon: "/icons/stat-objectives.svg",
      tile: "bg-tile-lilac",
      trend: true,
    },
    // The API reports value as free-text metrics, so this card counts them rather than summing an amount.
    {
      label: "Value Metrics",
      value: valueMetrics === undefined ? "—" : String(valueMetrics),
      note: `recorded this ${noun}`,
      icon: "/icons/stat-value.svg",
      tile: "bg-tile-mint",
      trend: false,
      decoration: "waves-mint",
    },
    {
      label: "Initiatives At Risk",
      value: String(projectsAtRisk.current),
      note: `${projectsNeedingAttention} require${projectsNeedingAttention === 1 ? "s" : ""} immediate attention`,
      icon: "/icons/stat-risk.svg",
      tile: "bg-tile-blush",
      trend: false,
      decoration: "waves-amber",
    },
  ];
}

function workstreams(dashboard: Dashboard): WorkstreamSummary[] {
  return WORKSTREAMS_ORDER.map((type) => {
    const match = dashboard.projectTypes.find((t) => typeFromName(t.name) === type);
    return { type, initiatives: match?.projectCount ?? 0, progress: match?.averageProgress ?? 0 };
  });
}

export function DashboardView() {
  const dashboard = useDashboard("Annually");
  const value = useValueRealization({ Year: new Date().getFullYear(), PageSize: 1 });

  if (dashboard.isPending) return <PageLoader label="Loading dashboard…" className="min-h-[420px]" />;
  if (dashboard.isError) return <ErrorState error={dashboard.error} onRetry={() => dashboard.refetch()} />;

  const data = dashboard.data;
  return (
    <>
      <section className="flex flex-wrap gap-4" aria-label="Key metrics">
        {stats(data, value.data?.meta?.totalCount).map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </section>

      <section>
        <SectionHeader
          title="Innovation Initiatives"
          description="Four workstreams, one strategic framework"
          action={
            <Link href="/initiatives" className={buttonClasses("link")}>
              View all
              <Icon src="/icons/arrow-right.svg" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 pt-[15px] sm:grid-cols-2 xl:grid-cols-4">
          {workstreams(data).map((workstream, i) => (
            <WorkstreamCard key={workstream.type} workstream={workstream} index={i} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Recent Updates"
          action={
            <Link href="/updates" className={buttonClasses("link")}>
              All
            </Link>
          }
        />
        <div className="pt-4">
          {data.recentUpdates.length === 0 ? (
            <EmptyState>No updates yet. They&apos;ll appear here as teams share progress.</EmptyState>
          ) : (
            <ActivityFeed items={data.recentUpdates} />
          )}
        </div>
      </section>
    </>
  );
}
