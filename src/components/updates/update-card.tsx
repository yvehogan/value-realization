import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TypeBadge } from "@/components/ui/type-badge";
import { getInitiative, getPerson, type UpdateEntry } from "@/lib/data";
import { TYPE_STYLES } from "@/lib/initiative-types";
import { UpdateTag, updateLines } from "./update-tag";

/** Full update card for the Updates feed. */
export function UpdateCard({ update }: { update: UpdateEntry }) {
  const person = getPerson(update.authorId);
  const initiative = getInitiative(update.initiativeSlug);
  if (!person || !initiative) return null;

  return (
    <Card elevated className="flex gap-3 rounded-2xl p-5">
      <Avatar initials={person.initials} color={person.color} size="feed" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href={`/team/${person.id}`} className="text-base font-bold text-ink hover:underline">
            {person.name}
          </Link>
          <span className="text-body text-muted">updated</span>
          <Link
            href={`/initiatives/${initiative.slug}`}
            className={`text-body font-medium hover:underline ${TYPE_STYLES[initiative.type].text}`}
          >
            {initiative.name}
          </Link>
          <TypeBadge type={initiative.type} />
          <span className="ml-auto text-meta text-muted">{update.when}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-3">
          {updateLines(update).map((line) => (
            <UpdateTag key={line.kind} kind={line.kind}>
              {line.text}
            </UpdateTag>
          ))}
        </div>
      </div>
    </Card>
  );
}
