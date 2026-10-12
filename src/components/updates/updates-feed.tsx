"use client";

import { Button } from "@/components/ui/button";
import { Spinner, PageLoader } from "@/components/ui/loader";
import { EmptyState, ErrorState } from "@/components/ui/query-state";
import { formatDate } from "@/lib/api/adapters";
import { useUpdatesFeed } from "@/lib/api/queries";
import type { ProjectUpdateListItem } from "@/lib/api/types";
import { UpdateCard } from "./update-card";

function groupByDate(updates: ProjectUpdateListItem[]) {
  const groups = new Map<string, ProjectUpdateListItem[]>();
  for (const update of updates) {
    const date = formatDate(update.createdAtUtc);
    groups.set(date, [...(groups.get(date) ?? []), update]);
  }
  return [...groups];
}

export function UpdatesFeed() {
  const feed = useUpdatesFeed();

  if (feed.isPending) return <PageLoader label="Loading updates…" className="mt-6" />;
  if (feed.isError) return <ErrorState className="mt-6" error={feed.error} onRetry={() => feed.refetch()} />;

  const updates = feed.data.pages.flatMap((page) => page.data);
  if (updates.length === 0) return <EmptyState className="mt-6">No updates yet. They&apos;ll appear here as teams share progress.</EmptyState>;

  return (
    <div className="flex flex-col gap-8 pt-6">
      {groupByDate(updates).map(([date, group]) => (
        <section key={date} aria-label={date}>
          <h2 className="text-body font-bold text-muted">{date}</h2>
          <div className="flex flex-col gap-3 pt-3">
            {group.map((update, i) => (
              <UpdateCard key={update.id} update={update} index={i} />
            ))}
          </div>
        </section>
      ))}
      {feed.hasNextPage && (
        <Button variant="secondary" className="self-center" disabled={feed.isFetchingNextPage} onClick={() => feed.fetchNextPage()}>
          {feed.isFetchingNextPage && <Spinner size={14} />}
          {feed.isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}
