import Link from "next/link";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { StatCard } from "@/components/dashboard/stat-card";
import { WorkstreamCard } from "@/components/dashboard/workstream-card";
import { buttonClasses } from "@/components/ui/button";
import { PageHeader, SectionHeader } from "@/components/ui/headers";
import { Icon } from "@/components/ui/icon";
import { requireViewer } from "@/lib/auth";
import { DASHBOARD_STATS, UPDATES, WORKSTREAMS } from "@/lib/data";

export default async function DashboardPage() {
  const viewer = await requireViewer();

  return (
    // The redesigned dashboard sits 24px below the top bar (other screens: 28px).
    <div className="-mt-1 flex flex-col gap-[31px]">
      <PageHeader
        title={`Good morning, ${viewer.firstName} ⛅️`}
        description="Here's how Innovation is performing across projects and initiatives."
      />

      <section className="flex flex-wrap gap-4" aria-label="Key metrics">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
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
          {WORKSTREAMS.map((workstream) => (
            <WorkstreamCard key={workstream.type} workstream={workstream} />
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
          <ActivityFeed items={UPDATES.slice(0, 5)} />
        </div>
      </section>
    </div>
  );
}
