import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/headers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusPill } from "@/components/ui/status-pill";
import type { Phase } from "@/lib/data";
import { STATUS_STYLES } from "@/lib/status";

export function PhaseProgress({ phases }: { phases: Phase[] }) {
  return (
    <Card className="rounded-card p-6">
      <SectionHeader title="Progress by Phase" />
      {phases.length === 0 ? (
        <p className="pt-4 text-body text-muted">No phases recorded yet.</p>
      ) : (
        <ul className="flex flex-col gap-5 pt-5">
          {phases.map((phase) => (
            <li key={phase.name} className="grid grid-cols-[160px_1fr_96px] items-center gap-4">
              <span className="text-body text-ink-soft">{phase.name}</span>
              <ProgressBar value={phase.progress} color={STATUS_STYLES[phase.status].dot} label={`${phase.name} progress`} />
              <StatusPill status={phase.status} className="justify-self-end" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
