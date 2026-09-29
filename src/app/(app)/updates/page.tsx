import type { Metadata } from "next";
import { AddUpdateButton } from "@/components/modals/add-update-button";
import { UpdateCard } from "@/components/updates/update-card";
import { PageHeader } from "@/components/ui/headers";
import { UPDATES, type UpdateEntry } from "@/lib/data";

export const metadata: Metadata = { title: "Updates · Nexus" };

function groupByDate(updates: UpdateEntry[]) {
  const groups = new Map<string, UpdateEntry[]>();
  for (const update of updates) {
    groups.set(update.date, [...(groups.get(update.date) ?? []), update]);
  }
  return [...groups];
}

export default function UpdatesPage() {
  return (
    <>
      <PageHeader
        title="Updates"
        description="A live feed of progress across the Innovation portfolio."
        action={<AddUpdateButton />}
      />
      <div className="flex flex-col gap-8 pt-6">
        {groupByDate(UPDATES).map(([date, updates]) => (
          <section key={date} aria-label={date}>
            <h2 className="text-body font-bold text-muted">{date}</h2>
            <div className="flex flex-col gap-3 pt-3">
              {updates.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
