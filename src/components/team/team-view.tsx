"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MaskIcon } from "@/components/ui/icon";
import { Segmented, type SegmentOption } from "@/components/ui/segmented";
import { Pill } from "@/components/ui/status-pill";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { PEOPLE, type PersonCategory } from "@/lib/data";
import { CATEGORY_ORDER, CATEGORY_STYLES, activeInitiativesFor } from "@/lib/people";

type Filter = "all" | PersonCategory;

const OPTIONS: SegmentOption<Filter>[] = [
  { value: "all", label: "All", count: PEOPLE.length },
  ...CATEGORY_ORDER.map((c) => ({
    value: c,
    label: CATEGORY_STYLES[c].label,
    count: PEOPLE.filter((p) => p.category === c).length,
  })),
];

export function TeamView() {
  const [filter, setFilter] = useState<Filter>("all");
  const people = useMemo(() => PEOPLE.filter((p) => filter === "all" || p.category === filter), [filter]);

  return (
    <>
      <div className="pt-6">
        <Segmented label="Filter by category" options={OPTIONS} value={filter} onChange={setFilter} />
      </div>
      <p className="pt-6 text-body text-muted" aria-live="polite">
        {people.length} team members
      </p>
      <Card elevated className="mt-6 overflow-hidden rounded-2xl">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Category</Th>
              <Th>Active Projects</Th>
              <Th>
                <span className="sr-only">Open</span>
              </Th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const category = CATEGORY_STYLES[person.category];
              return (
                <Tr key={person.id}>
                  <Td>
                    <Link href={`/team/${person.id}`} className="flex items-center gap-3 font-semibold text-ink after:absolute after:inset-0">
                      <Avatar initials={person.initials} color={person.color} size="list" />
                      {person.name}
                    </Link>
                  </Td>
                  <Td>{person.role}</Td>
                  <Td>
                    <Pill {...category} />
                  </Td>
                  <Td className="tabular-nums">{activeInitiativesFor(person.id).length}</Td>
                  <Td className="text-right">
                    <span className="inline-flex size-[27px] items-center justify-center rounded-lg border border-line text-muted">
                      <MaskIcon src="/icons/arrow-right.svg" size={15} />
                    </span>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
