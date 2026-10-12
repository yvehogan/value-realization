import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { TypeBadge } from "@/components/ui/type-badge";
import { authorOf, timeAgo, typeFromName } from "@/lib/api/adapters";
import type { ProjectUpdateListItem } from "@/lib/api/types";
import { TYPE_STYLES } from "@/lib/initiative-types";
import { staggerStyle } from "@/lib/motion";
import { UpdateTag, updateLines } from "./update-tag";

/** Full update card for the Updates feed. */
export function UpdateCard({ update, index = 0 }: { update: ProjectUpdateListItem; index?: number }) {
  const person = authorOf(update);
  const type = typeFromName(update.projectTypeName);

  return (
    <Card elevated className="flex stagger animate-fade-up gap-3 rounded-2xl p-5" style={staggerStyle(index)}>
      {person && <Avatar initials={person.initials} color={person.color} size="feed" />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {person ? (
            <Link href={`/team/${person.id}`} className="text-base font-bold text-ink hover:underline">
              {person.name}
            </Link>
          ) : (
            <span className="text-base font-bold text-ink">Someone</span>
          )}
          <span className="text-body text-muted">updated</span>
          <Link
            href={`/initiatives/${update.projectId}`}
            className={`text-body font-medium hover:underline ${TYPE_STYLES[type].text}`}
          >
            {update.projectName ?? "a project"}
          </Link>
          <TypeBadge type={type} />
          <span className="ml-auto text-meta text-muted">{timeAgo(update.createdAtUtc)}</span>
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
