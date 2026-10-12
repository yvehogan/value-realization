"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useViewer } from "@/components/auth/viewer-context";
import { NewObjectiveModal } from "@/components/modals/new-objective-modal";
import { AvatarStack } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { PageHeader } from "@/components/ui/headers";
import { Icon } from "@/components/ui/icon";
import { PageLoader } from "@/components/ui/loader";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState, ErrorState } from "@/components/ui/query-state";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { toPerson } from "@/lib/api/adapters";
import { useObjectives, useProjects, useValueRealization } from "@/lib/api/queries";
import { isAdmin } from "@/lib/viewer";

const PAGE_SIZE = 10;

function NewObjectiveButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icon src="/icons/plus.svg" size={15} />
        New Objective
      </Button>
      <NewObjectiveModal key={String(open)} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Value Realization: every reported value metric, filterable by objective and initiative. */
export function ValueView({ initialObjective }: { initialObjective?: string }) {
  const viewer = useViewer();
  const [objective, setObjective] = useState(initialObjective ?? "all");
  const [project, setProject] = useState("all");
  const [page, setPage] = useState(1);

  const objectives = useObjectives();
  const projects = useProjects();
  const value = useValueRealization({
    ObjectiveId: objective === "all" ? undefined : objective,
    ProjectId: project === "all" ? undefined : project,
    PageNumber: page,
    PageSize: PAGE_SIZE,
  });

  const rows = value.data?.data ?? [];
  const total = value.data?.meta?.totalCount ?? rows.length;
  const projectOptions = useMemo(
    () => [...(projects.data?.data ?? [])].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "")),
    [projects.data],
  );

  return (
    <>
      <PageHeader
        title="Value Realization"
        description="Measurable value the Innovation portfolio has created against target."
        action={isAdmin(viewer) && <NewObjectiveButton />}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-8">
        <p className="text-body text-muted" aria-live="polite">
          {value.isSuccess ? `${total} value metric${total === 1 ? "" : "s"}` : " "}
        </p>
        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            aria-label="Affiliated objective"
            value={objective}
            onChange={(e) => {
              setObjective(e.target.value);
              setPage(1);
            }}
            className="w-[150px]"
          >
            <option value="all">All</option>
            {(objectives.data ?? []).map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Initiative"
            value={project}
            onChange={(e) => {
              setProject(e.target.value);
              setPage(1);
            }}
            className="w-[170px]"
          >
            <option value="all">All Initiative</option>
            {projectOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="pt-4">
        {value.isPending ? (
          <PageLoader label="Loading value realization…" />
        ) : value.isError ? (
          <ErrorState error={value.error} onRetry={() => value.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState>
            {objective === "all" && project === "all"
              ? "No value has been reported yet. It appears here when teams post Value Metric updates."
              : "No value metrics match these filters."}
          </EmptyState>
        ) : (
          <Card elevated className="overflow-hidden rounded-2xl">
            <Table>
              <thead>
                <tr>
                  <Th>Value</Th>
                  <Th>Initiative</Th>
                  <Th>Affiliated Objective</Th>
                  <Th>Responsible Person(s)</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((entry) => (
                  <Tr key={entry.id} className="h-[55px]">
                    <Td className="min-w-[260px]">
                      <span className="text-ink">{entry.value}</span>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <Link
                        href={`/initiatives/${entry.projectId}/value`}
                        className="text-ink after:absolute after:inset-0 hover:underline"
                      >
                        {entry.projectName}
                      </Link>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <span className="text-meta text-venture">{entry.objectiveName ?? "—"}</span>
                    </Td>
                    <Td>
                      <AvatarStack people={entry.responsiblePersons.map(toPerson)} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </div>

      <Pagination
        className="pt-5"
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
        noun="value metrics"
        loading={value.isPlaceholderData}
      />
    </>
  );
}
