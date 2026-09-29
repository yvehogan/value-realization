import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/headers";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getObjective } from "@/lib/data";

export function StrategicAlignment({ objectives }: { objectives: Record<string, number> }) {
  const entries = Object.entries(objectives);
  return (
    <Card className="rounded-card p-6">
      <SectionHeader title="Strategic Alignment" />
      {entries.length === 0 ? (
        <p className="pt-4 text-body text-muted">Not linked to an objective yet.</p>
      ) : (
        <ul className="flex flex-col gap-4 pt-4">
          {entries.map(([id, share]) => (
            <li key={id}>
              <Link href={`/value-realization?objective=${id}`} className="group block">
                <span className="flex items-start justify-between gap-3 text-body">
                  <span className="text-ink-soft group-hover:text-ink">{getObjective(id)?.name}</span>
                  <span className="font-medium text-ink">{share}%</span>
                </span>
                <ProgressBar value={share} className="mt-2" label={`Contribution to ${getObjective(id)?.name}`} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
