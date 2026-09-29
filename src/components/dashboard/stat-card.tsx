import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Stat } from "@/lib/data";
import { StatDecoration } from "./stat-decoration";

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <Card className="relative isolate flex min-w-0 flex-1 flex-col overflow-hidden rounded-card p-5">
      {stat.decoration && <StatDecoration kind={stat.decoration} />}
      <div className="flex items-center justify-between">
        <p className="text-body text-muted">{stat.label}</p>
        <span className={cn("flex rounded-button p-[5px]", stat.tile)}>
          <Icon src={stat.icon} size={24} />
        </span>
      </div>
      <p className="pt-3 text-stat font-black text-ink">{stat.value}</p>
      <p
        className={cn(
          "flex items-center gap-2.5 pt-1 text-meta font-medium",
          stat.trend ? "text-brand" : "text-muted",
        )}
      >
        {stat.trend && <Icon src="/icons/trend-up.svg" size={13} />}
        {stat.note}
      </p>
    </Card>
  );
}
