"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useViewer } from "@/components/auth/viewer-context";
import { RemoveMemberModal } from "@/components/modals/remove-member-modal";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/headers";
import { InlineProgress } from "@/components/ui/inline-progress";
import { PageLoader } from "@/components/ui/loader";
import { Pagination } from "@/components/ui/pagination";
import { ErrorState } from "@/components/ui/query-state";
import { StatusPill } from "@/components/ui/status-pill";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { TypeBadge } from "@/components/ui/type-badge";
import { API_STATUS, timeAgo, toPerson, typeFromName } from "@/lib/api/adapters";
import { ApiError } from "@/lib/api/client";
import { useUser } from "@/lib/api/queries";
import { TYPE_STYLES } from "@/lib/initiative-types";
import { isAdmin } from "@/lib/viewer";

const PAGE_SIZE = 10;

export function PersonView({ id }: { id: string }) {
  const viewer = useViewer();
  const router = useRouter();
  const user = useUser(id);
  const [confirming, setConfirming] = useState(false);
  const [page, setPage] = useState(1);

  if (user.isPending) {
    return <PageLoader label="Loading profile…" className="mt-6 min-h-[420px]" />;
  }
  if (user.isError) {
    const missing = user.error instanceof ApiError && user.error.status === 404;
    return (
      <ErrorState
        className="mt-6"
        error={missing ? new ApiError("This team member doesn't exist or has been removed.", 404) : user.error}
        onRetry={missing ? undefined : () => user.refetch()}
      />
    );
  }

  const detail = user.data;
  // The API returns every responsibility at once, so page through them here.
  const responsibilities = detail.currentResponsibilities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const person = toPerson(detail);
  const stats = [
    { label: "Active initiatives", value: detail.stats.activeInitiatives },
    { label: "On-track", value: detail.stats.onTrack },
    { label: "Completed", value: detail.stats.completed },
    { label: "Updates submitted", value: detail.stats.updatesSubmitted },
    { label: "Objectives contributed", value: detail.stats.objectivesContributed },
  ];

  return (
    <>
      <Card className="mt-6 rounded-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar initials={person.initials} color={person.color} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-title font-black text-ink">{person.name}</h1>
            <p className="text-base text-muted">{detail.teamRoleName ?? detail.department ?? "Team member"}</p>
          </div>
          {isAdmin(viewer) && viewer.id !== detail.id && (
            <Button variant="outline" radius="rounded-xl" onClick={() => setConfirming(true)}>
              Remove member
            </Button>
          )}
        </div>
        <dl className="flex flex-wrap gap-8 pt-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-[111px] flex-col-reverse text-center">
              <dt className="text-meta whitespace-nowrap text-muted">{stat.label}</dt>
              <dd className="text-title font-black text-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <section className="pt-6">
        <SectionHeader title="Current Responsibilities" />
        <Card elevated className="mt-4 overflow-hidden rounded-2xl">
          {detail.currentResponsibilities.length === 0 ? (
            <p className="p-6 text-body text-muted">Not responsible for any initiatives yet.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Initiative</Th>
                  <Th>Type</Th>
                  <Th>Responsibility</Th>
                  <Th>Progress</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {responsibilities.map((r) => {
                  const type = typeFromName(r.projectTypeName);
                  return (
                    <Tr key={r.projectId}>
                      <Td className="font-semibold text-ink">
                        <Link href={`/initiatives/${r.projectId}`} className="after:absolute after:inset-0 hover:underline">
                          {r.projectName}
                        </Link>
                      </Td>
                      <Td>
                        <TypeBadge type={type} />
                      </Td>
                      <Td>{r.responsibility ?? "—"}</Td>
                      <Td>
                        <InlineProgress value={r.progressPercentage} color={TYPE_STYLES[type].bg} />
                      </Td>
                      <Td>
                        <StatusPill status={API_STATUS[r.status]} />
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
        <Pagination
          className="pt-4"
          page={page}
          pageSize={PAGE_SIZE}
          total={detail.currentResponsibilities.length}
          onPageChange={setPage}
          noun="initiatives"
        />
      </section>

      <section className="pt-6">
        <SectionHeader title="Recent Activity" />
        <Card elevated className="mt-4 rounded-2xl">
          {detail.recentActivity.length === 0 ? (
            <p className="p-6 text-body text-muted">No updates submitted yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {detail.recentActivity.map((activity) => (
                <li key={activity.updateId} className="flex gap-3 px-5 py-3.5">
                  <Avatar initials={person.initials} color={person.color} />
                  <div className="text-body">
                    <p className="text-ink">
                      <Link href={`/initiatives/${activity.projectId}`} className="font-semibold hover:underline">
                        {activity.projectName}
                      </Link>
                      <span className="text-muted"> · {timeAgo(activity.createdAtUtc)}</span>
                    </p>
                    {activity.summary && <p className="pt-0.5 text-ink-soft">{activity.summary}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {isAdmin(viewer) && (
        <RemoveMemberModal
          key={String(confirming)}
          open={confirming}
          onClose={() => setConfirming(false)}
          id={detail.id}
          name={person.name}
          onRemoved={() => router.push("/team")}
        />
      )}
    </>
  );
}
