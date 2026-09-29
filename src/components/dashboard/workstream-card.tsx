import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TypeBadge } from "@/components/ui/type-badge";
import { TYPE_STYLES, WORKSTREAM_META } from "@/lib/initiative-types";
import type { WorkstreamSummary } from "@/lib/data";

export function WorkstreamCard({ workstream }: { workstream: WorkstreamSummary }) {
  const meta = WORKSTREAM_META[workstream.type];
  return (
    <Link href={`/initiatives?type=${workstream.type}`} className="group block">
      <Card className="flex h-[180px] flex-col rounded-card p-5 transition-colors group-hover:border-plum-muted">
        <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-lg">
            <Icon src={meta.icon} size={18} />
          </span>
          <TypeBadge type={workstream.type} />
        </div>
        <h3 className="pt-4 text-title font-black text-ink">{meta.plural}</h3>
        <p className="pt-5 text-body text-ink-soft">
          <span className="font-semibold text-ink">{workstream.initiatives}</span> initiatives
        </p>
        <ProgressBar
          value={workstream.progress}
          color={TYPE_STYLES[workstream.type].bg}
          className="mt-2"
          label={`${meta.plural}: ${workstream.progress}% progress`}
        />
      </Card>
    </Link>
  );
}
