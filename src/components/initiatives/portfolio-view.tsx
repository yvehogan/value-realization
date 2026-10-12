"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { PageLoader } from "@/components/ui/loader";
import { EmptyState, ErrorState } from "@/components/ui/query-state";
import { Pagination } from "@/components/ui/pagination";
import { Segmented, type SegmentOption } from "@/components/ui/segmented";
import { API_STATUS, PROJECT_STATUSES, toPerson, toProjectSummary, typeFromName } from "@/lib/api/adapters";
import { useProjectTypes, useProjects, useUsers } from "@/lib/api/queries";
import type { ProjectStatus } from "@/lib/api/types";
import { TYPE_STYLES, WORKSTREAMS_ORDER, WORKSTREAM_META, type Workstream } from "@/lib/initiative-types";
import { STATUS_STYLES } from "@/lib/status";
import { useDebounced } from "@/lib/use-debounced";
import { InitiativeCard } from "./initiative-card";
import { InitiativeTable } from "./initiative-table";

type TypeFilter = "all" | Workstream;

const PAGE_SIZE = 10;
type View = "table" | "cards";

const TYPE_OPTIONS: SegmentOption<TypeFilter>[] = [
  { value: "all", label: "All", icon: <Icon src="/icons/filter-all.svg" size={15} /> },
  ...WORKSTREAMS_ORDER.map((type) => ({
    value: type,
    label: TYPE_STYLES[type].label,
    icon: <Icon src={WORKSTREAM_META[type].filterIcon} size={15} />,
  })),
];

const VIEW_OPTIONS: SegmentOption<View>[] = [
  { value: "table", label: "Table", icon: <Icon src="/icons/view-table.svg" size={15} /> },
  { value: "cards", label: "Cards", icon: <Icon src="/icons/view-cards.svg" size={15} /> },
];

export function PortfolioView({ initialType = "all" }: { initialType?: TypeFilter }) {
  const [type, setType] = useState<TypeFilter>(initialType);
  const [view, setView] = useState<View>("table");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [person, setPerson] = useState("all");
  const [page, setPage] = useState(1);
  // Any filter change starts again from page 1.
  const filtered = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setPage(1);
  };
  const search = useDebounced(query.trim());

  const types = useProjectTypes();
  const users = useUsers();
  const typeId = type === "all" ? undefined : types.data?.find((t) => typeFromName(t.name) === type)?.id;

  const projects = useProjects(
    {
      ProjectTypeId: typeId,
      Status: status === "all" ? undefined : status,
      AssignedUserId: person === "all" ? undefined : person,
      SearchKey: search || undefined,
      PageNumber: page,
      PageSize: PAGE_SIZE,
    },
    // Wait for the type list so a type filter isn't briefly ignored.
    { enabled: type === "all" || types.isSuccess },
  );
  const initiatives = useMemo(() => (projects.data?.data ?? []).map(toProjectSummary), [projects.data]);
  const people = useMemo(() => (users.data?.data ?? []).map(toPerson), [users.data]);
  const total = projects.data?.meta?.totalCount ?? initiatives.length;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
        <Segmented label="Filter by type" options={TYPE_OPTIONS} value={type} onChange={filtered(setType)} />
        <Segmented label="View" tone="soft" options={VIEW_OPTIONS} value={view} onChange={setView} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-6">
        <label className="relative min-w-[220px] flex-[235]">
          <span className="sr-only">Search initiatives</span>
          <Icon src="/icons/search-input.svg" size={16} className="absolute top-[11px] left-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => filtered(setQuery)(e.target.value)}
            placeholder="Search initiatives…"
            className="h-[38px] w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-body text-ink outline-none placeholder:text-ink/50 focus:border-brand"
          />
        </label>
        <Select
          aria-label="Status"
          value={status}
          onChange={(e) => filtered(setStatus)(e.target.value as ProjectStatus | "all")}
          className="w-[118px]"
        >
          <option value="all">All</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_STYLES[API_STATUS[s]].label}
            </option>
          ))}
        </Select>
        <Select aria-label="Responsible person" value={person} onChange={(e) => filtered(setPerson)(e.target.value)} className="w-[179px]">
          <option value="all">All People</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>

      <p className="pt-6 text-body text-muted" aria-live="polite">
        {projects.isSuccess ? `${total} initiative${total === 1 ? "" : "s"}` : "\u00a0"}
      </p>

      <div className="pt-6">
        {projects.isPending ? (
          <PageLoader label="Loading initiatives…" />
        ) : projects.isError ? (
          <ErrorState error={projects.error} onRetry={() => projects.refetch()} />
        ) : initiatives.length === 0 ? (
          <EmptyState>
            {type === "all" && status === "all" && person === "all" && !search
              ? "No initiatives yet."
              : "No initiatives match these filters."}
          </EmptyState>
        ) : view === "table" ? (
          <Card elevated className="overflow-hidden rounded-2xl">
            <InitiativeTable initiatives={initiatives} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {initiatives.map((initiative, i) => (
              <InitiativeCard key={initiative.id} initiative={initiative} index={i} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        className="pt-5"
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        onPageChange={setPage}
        noun="initiatives"
        loading={projects.isPlaceholderData}
      />
    </>
  );
}
