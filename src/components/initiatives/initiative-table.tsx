import Link from "next/link";
import { AvatarStack } from "@/components/ui/avatar";
import { InlineProgress } from "@/components/ui/inline-progress";
import { StatusPill } from "@/components/ui/status-pill";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { TypeBadge } from "@/components/ui/type-badge";
import type { ProjectSummary } from "@/lib/api/adapters";
import { TYPE_STYLES } from "@/lib/initiative-types";

export function InitiativeTable({ initiatives }: { initiatives: ProjectSummary[] }) {
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
          <Tr key={initiative.id}>
            <Td className="font-semibold text-ink">
              <Link href={`/initiatives/${initiative.id}`} className="after:absolute after:inset-0 hover:underline">
                {initiative.name}
              </Link>
            </Td>
            <Td>
              <TypeBadge type={initiative.type} />
            </Td>
            <Td>
              <AvatarStack people={initiative.owners} />
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
