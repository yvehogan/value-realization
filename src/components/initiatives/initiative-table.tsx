import Link from "next/link";
import { AvatarStack } from "@/components/ui/avatar";
import { InlineProgress } from "@/components/ui/inline-progress";
import { StatusPill } from "@/components/ui/status-pill";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { TypeBadge } from "@/components/ui/type-badge";
import { getPerson, type Initiative, type Person } from "@/lib/data";
import { TYPE_STYLES } from "@/lib/initiative-types";

export function ownersOf(initiative: Initiative): Person[] {
  return initiative.ownerIds.map(getPerson).filter((p): p is Person => !!p);
}

export function InitiativeTable({ initiatives }: { initiatives: Initiative[] }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Initiative</Th>
          <Th>Type</Th>
          <Th>Responsible Person(s)</Th>
          <Th>Status</Th>
          <Th>Progress</Th>
          <Th>Last Updated</Th>
        </tr>
      </thead>
      <tbody>
        {initiatives.map((initiative) => (
          <Tr key={initiative.slug}>
            <Td className="font-semibold text-ink">
              <Link href={`/initiatives/${initiative.slug}`} className="after:absolute after:inset-0 hover:underline">
                {initiative.name}
              </Link>
            </Td>
            <Td>
              <TypeBadge type={initiative.type} />
            </Td>
            <Td>
              <AvatarStack people={ownersOf(initiative)} />
            </Td>
            <Td>
              <StatusPill status={initiative.status} />
            </Td>
            <Td>
              <InlineProgress value={initiative.progress} color={TYPE_STYLES[initiative.type].bg} />
            </Td>
            <Td className="whitespace-nowrap">{initiative.lastUpdated}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
