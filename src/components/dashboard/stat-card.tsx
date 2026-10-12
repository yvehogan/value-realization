import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { staggerStyle } from "@/lib/motion";
import { StatDecoration, type StatDecorationKind } from "./stat-decoration";

export type Stat = {
  label: string;
  value: string;
  note: string;
  icon: string;
  /** Tailwind bg-* class for the icon tile */
  tile: string;
  /** Trend notes get the up-arrow and brand colour; plain notes are muted */
  trend: boolean;
  /** Decorative artwork in the card's bottom-right corner */
  decoration?: StatDecorationKind;
};

export function StatCard({ stat, index = 0 }: { stat: Stat; index?: number }) {
  return (
    <Card
      className="relative isolate flex min-w-0 flex-[1_1_240px] stagger animate-fade-up flex-col overflow-hidden rounded-card p-5"
      style={staggerStyle(index)}
    >
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
