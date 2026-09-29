import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getInitiative, getPerson, type UpdateEntry } from "@/lib/data";
import { TYPE_STYLES } from "@/lib/initiative-types";

/** Compact one-line-per-update feed used on the dashboard. */
export function ActivityFeed({ items }: { items: UpdateEntry[] }) {
  return (
    <Card className="rounded-2xl">
      <ul className="divide-y divide-line">
        {items.map((item) => {
          const person = getPerson(item.authorId);
          const initiative = getInitiative(item.initiativeSlug);
          if (!person || !initiative) return null;
          return (
            <li key={item.id} className="flex items-start gap-3 px-4 py-3.5">
              <Avatar initials={person.initials} color={person.color} />
              <div className="min-w-0 flex-1 text-caption">
                <p className="font-medium text-ink">
                  {person.name.split(" ")[0]}
                  <span className="font-normal text-ink-soft"> updated </span>
                  <Link href={`/initiatives/${initiative.slug}`} className={`${TYPE_STYLES[initiative.type].text} hover:underline`}>
                    {initiative.name}
                  </Link>
                </p>
                <p className="truncate pt-0.5 text-meta text-muted">{item.achievement}</p>
                <p className="pt-1 text-micro text-muted">{item.when}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
