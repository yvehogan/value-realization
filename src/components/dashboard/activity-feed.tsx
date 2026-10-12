import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { timeAgo, toPerson } from "@/lib/api/adapters";
import type { DashboardUpdate } from "@/lib/api/types";

/** Compact one-line-per-update feed used on the dashboard. */
export function ActivityFeed({ items }: { items: DashboardUpdate[] }) {
  return (
    <Card className="rounded-2xl">
      <ul className="divide-y divide-line">
        {items.map((item) => {
          const person = item.authorId
            ? toPerson({ id: item.authorId, fullName: item.authorName, initials: item.authorInitials })
            : null;
          return (
            <li key={item.updateId} className="flex items-start gap-3 px-4 py-3.5">
              {person && <Avatar initials={person.initials} color={person.color} />}
              <div className="min-w-0 flex-1 text-caption">
                <p className="font-medium text-ink">
                  {person?.name.split(" ")[0] ?? "Someone"}
                  <span className="font-normal text-ink-soft"> updated </span>
                  <Link href={`/initiatives/${item.projectId}`} className="text-brand hover:underline">
                    {item.projectName ?? "a project"}
                  </Link>
                </p>
                {item.summary && <p className="truncate pt-0.5 text-meta text-muted">{item.summary}</p>}
                <p className="pt-1 text-micro text-muted">{timeAgo(item.createdAtUtc)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
