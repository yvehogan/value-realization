import Link from "next/link";
import { AvatarStack } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusPill } from "@/components/ui/status-pill";
import { TypeBadge } from "@/components/ui/type-badge";
import type { Initiative } from "@/lib/data";
import { TYPE_STYLES } from "@/lib/initiative-types";
import { ownersOf } from "./initiative-table";

export function InitiativeCard({ initiative }: { initiative: Initiative }) {
  const style = TYPE_STYLES[initiative.type];
  return (
    <Link href={`/initiatives/${initiative.slug}`} className="group block">
      <Card elevated className="flex h-full flex-col gap-4 rounded-xl p-5 transition-transform group-hover:-translate-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <TypeBadge type={initiative.type} />
          <StatusPill status={initiative.status} />
        </div>
        <h3 className="text-heading font-black text-ink">{initiative.name}</h3>
        <div className="mt-auto flex items-center justify-between">
          <AvatarStack people={ownersOf(initiative)} />
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
