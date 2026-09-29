"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import { Segmented, type SegmentOption } from "@/components/ui/segmented";
import { INITIATIVES, OBJECTIVES, PEOPLE } from "@/lib/data";
import { TYPE_STYLES, WORKSTREAMS_ORDER, WORKSTREAM_META, type Workstream } from "@/lib/initiative-types";
import { INITIATIVE_STATUSES, STATUS_STYLES } from "@/lib/status";
import { InitiativeCard } from "./initiative-card";
import { InitiativeTable } from "./initiative-table";

type TypeFilter = "all" | Workstream;
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
  const [status, setStatus] = useState("all");
  const [person, setPerson] = useState("all");
  const [objective, setObjective] = useState("all");

  const initiatives = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INITIATIVES.filter(
      (i) =>
        (type === "all" || i.type === type) &&
        (status === "all" || i.status === status) &&
        (person === "all" || i.ownerIds.includes(person)) &&
        (objective === "all" || (i.objectives && objective in i.objectives)) &&
        (!q || i.name.toLowerCase().includes(q)),
    );
  }, [type, status, person, objective, query]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
        <Segmented label="Filter by type" options={TYPE_OPTIONS} value={type} onChange={setType} />
        <Segmented label="View" tone="soft" options={VIEW_OPTIONS} value={view} onChange={setView} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-6">
        <label className="relative min-w-[220px] flex-[235]">
          <span className="sr-only">Search initiatives</span>
          <Icon src="/icons/search-input.svg" size={16} className="absolute top-[11px] left-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search initiatives…"
            className="h-[38px] w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-body text-ink outline-none placeholder:text-ink/50 focus:border-brand"
          />
        </label>
        <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-[118px]">
          <option value="all">All</option>
          {INITIATIVE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_STYLES[s].label}
            </option>
          ))}
        </Select>
        <Select aria-label="Responsible person" value={person} onChange={(e) => setPerson(e.target.value)} className="w-[179px]">
          <option value="all">All People</option>
          {PEOPLE.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select aria-label="Objective" value={objective} onChange={(e) => setObjective(e.target.value)} className="w-[262px]">
          <option value="all">All Objectives</option>
          {OBJECTIVES.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Select>
      </div>

      <p className="pt-6 text-body text-muted" aria-live="polite">
        {initiatives.length} initiatives
      </p>

      <div className="pt-6">
        {initiatives.length === 0 ? (
          <Card className="rounded-2xl p-10 text-center text-body text-muted">No initiatives match these filters.</Card>
        ) : view === "table" ? (
          <Card elevated className="overflow-hidden rounded-2xl">
            <InitiativeTable initiatives={initiatives} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {initiatives.map((initiative) => (
              <InitiativeCard key={initiative.slug} initiative={initiative} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
