"use client";

import Link from "next/link";
import { useState } from "react";
import { useViewer } from "@/components/auth/viewer-context";
import { RemoveMemberModal } from "@/components/modals/remove-member-modal";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/loader";
import { EmptyState, ErrorState } from "@/components/ui/query-state";
import { Segmented, type SegmentOption } from "@/components/ui/segmented";
import { Pill } from "@/components/ui/status-pill";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { API_CATEGORY, toPerson } from "@/lib/api/adapters";
import { useUsers } from "@/lib/api/queries";
import type { TeamCategory } from "@/lib/api/types";
import { CATEGORY_ORDER, CATEGORY_STYLES, type PersonCategory } from "@/lib/people";
import { isAdmin } from "@/lib/viewer";

type Filter = "all" | PersonCategory;

const PAGE_SIZE = 10;

const API_FILTER: Record<PersonCategory, TeamCategory> = {
  engineering: "Engineering",
  design: "Design",
  programs: "Programs",
  others: "Others",
};

export function TeamView() {
  const viewer = useViewer();
  const admin = isAdmin(viewer);
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState<{ id: string; name: string } | null>(null);
  const users = useUsers({
    Category: filter === "all" ? undefined : API_FILTER[filter],
    PageNumber: page,
    PageSize: PAGE_SIZE,
  });
  // Category counts come back with every page, whatever the filter.
  const counts = users.data?.meta?.categoryCounts;

  const options: SegmentOption<Filter>[] = [
    { value: "all", label: "All", count: counts?.all },
    ...CATEGORY_ORDER.map((c) => ({ value: c, label: CATEGORY_STYLES[c].label, count: counts?.[c] })),
  ];

  const people = users.data?.data ?? [];
  const total = users.data?.meta?.totalCount ?? people.length;

  return (
    <>
      <div className="pt-6">
        <Segmented
          label="Filter by category"
          options={options}
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setPage(1);
          }}
        />
      </div>
      <p className="pt-6 text-body text-muted" aria-live="polite">
        {users.isSuccess ? `${total} team member${total === 1 ? "" : "s"}` : " "}
      </p>
      {users.isPending ? (
        <PageLoader label="Loading team…" className="mt-6" />
      ) : users.isError ? (
        <ErrorState className="mt-6" error={users.error} onRetry={() => users.refetch()} />
      ) : people.length === 0 ? (
        <EmptyState className="mt-6">No team members in this category.</EmptyState>
      ) : (
        <Card elevated className="mt-6 overflow-hidden rounded-2xl">
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Category</Th>
                <Th>Active Projects</Th>
                {admin && (
                  <Th>
                    <span className="sr-only">Remove</span>
                  </Th>
                )}
              </tr>
            </thead>
            <tbody>
              {people.map((member) => {
                const person = toPerson(member);
                const category = CATEGORY_STYLES[member.category ? API_CATEGORY[member.category] : "unassigned"];
                return (
                  <Tr key={member.id}>
                    <Td>
                      <Link href={`/team/${member.id}`} className="flex items-center gap-3 font-semibold text-ink after:absolute after:inset-0">
                        <Avatar initials={person.initials} color={person.color} size="list" />
                        {person.name}
                      </Link>
                    </Td>
                    <Td>{member.teamRoleName ?? "—"}</Td>
                    <Td>
                      <Pill {...category} />
                    </Td>
                    <Td className="tabular-nums">{member.activeProjectCount}</Td>
                    {admin && (
                      <Td className="text-right">
                        {/* Sits above the row's stretched link; admins can't remove themselves. */}
                        {member.id !== viewer.id && (
                          <button
                            type="button"
                            onClick={() => setRemoving({ id: member.id, name: person.name })}
                            aria-label={`Remove ${person.name}`}
                            title="Remove member"
                            className="relative z-10 inline-flex size-[27px] items-center justify-center rounded-lg border border-line bg-surface hover:border-danger hover:bg-danger/5"
                          >
                            <Icon src="/icons/trash.svg" size={15} />
                          </button>
                        )}
                      </Td>
                    )}
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}
      <Pagination
        className="pt-5"
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
        noun="team members"
        loading={users.isPlaceholderData}
      />
      {removing && (
        <RemoveMemberModal
          open
          onClose={() => setRemoving(null)}
          id={removing.id}
          name={removing.name}
          onRemoved={() => {
            setRemoving(null);
            // Removing the only person on a later page would leave it empty.
            if (people.length === 1 && page > 1) setPage(page - 1);
          }}
        />
      )}
    </>
  );
}
