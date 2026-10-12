import Link from "next/link";
import { AvatarStack } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusPill } from "@/components/ui/status-pill";
import { TypeBadge } from "@/components/ui/type-badge";
import type { ProjectSummary } from "@/lib/api/adapters";
import { TYPE_STYLES } from "@/lib/initiative-types";
import { staggerStyle } from "@/lib/motion";

export function InitiativeCard({ initiative, index = 0 }: { initiative: ProjectSummary; index?: number }) {
  const style = TYPE_STYLES[initiative.type];
  return (
    <Link href={`/initiatives/${initiative.id}`} className="group block stagger animate-fade-up" style={staggerStyle(index)}>
      <Card elevated className="flex h-full flex-col gap-4 rounded-xl p-5 transition-transform duration-200 group-hover:-translate-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <TypeBadge type={initiative.type} />
          <StatusPill status={initiative.status} />
        </div>
        <h3 className="text-heading font-black text-ink">{initiative.name}</h3>
        <div className="mt-auto flex items-center justify-between">
          <AvatarStack people={initiative.owners} />
          <span className="text-micro text-muted">{initiative.lastUpdated}</span>
        </div>
        <div>
          <div className="flex justify-between pb-2 text-body">
            <span className="text-muted">Progress</span>
            <span className={`font-medium ${style.text}`}>{initiative.progress}%</span>
          </div>
          <ProgressBar value={initiative.progress} color={style.bg} label={`${initiative.name} progress`} />
        </div>
      </Card>
    </Link>
  );
}
