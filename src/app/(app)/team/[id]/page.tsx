import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { BackLink } from "@/components/ui/back-link";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/headers";
import { InlineProgress } from "@/components/ui/inline-progress";
import { StatusPill } from "@/components/ui/status-pill";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { TypeBadge } from "@/components/ui/type-badge";
import { PEOPLE, UPDATES, getInitiative, getPerson, getResponsibility } from "@/lib/data";
import { TYPE_STYLES } from "@/lib/initiative-types";
import { initiativesFor, personStats } from "@/lib/people";

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/team/[id]">) {
  const { id } = await params;
  return { title: `${getPerson(id)?.name ?? "Team member"} · Nexus` };
}

export default async function PersonPage({ params }: PageProps<"/team/[id]">) {
  const { id } = await params;
  const person = getPerson(id);
  if (!person) notFound();

  const owned = initiativesFor(person.id);
  const activity = UPDATES.filter((u) => u.authorId === person.id);

  return (
    <>
      <BackLink href="/team" label="Team" />

      <Card className="mt-6 rounded-card p-6">
        <div className="flex items-center gap-4">
          <Avatar initials={person.initials} color={person.color} size="lg" />
          <div>
            <h1 className="text-title font-black text-ink">{person.name}</h1>
            <p className="text-base text-muted">{person.role}</p>
          </div>
        </div>
        <dl className="flex flex-wrap gap-8 pt-4">
          {personStats(person.id).map((stat) => (
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
          {owned.length === 0 ? (
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
                {owned.map((initiative) => (
                  <Tr key={initiative.slug}>
                    <Td className="font-semibold text-ink">
                      <Link href={`/initiatives/${initiative.slug}`} className="after:absolute after:inset-0 hover:underline">
                        {initiative.name}
                      </Link>
                    </Td>
                    <Td>
                      <TypeBadge type={initiative.type} />
                    </Td>
                    <Td>{getResponsibility(person, initiative.slug)}</Td>
                    <Td>
                      <InlineProgress value={initiative.progress} color={TYPE_STYLES[initiative.type].bg} />
                    </Td>
                    <Td>
                      <StatusPill status={initiative.status} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </section>

      <section className="pt-6">
        <SectionHeader title="Recent Activity" />
        <Card elevated className="mt-4 rounded-2xl">
          {activity.length === 0 ? (
            <p className="p-6 text-body text-muted">No updates submitted yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {activity.map((update) => {
                const initiative = getInitiative(update.initiativeSlug);
                return (
                  <li key={update.id} className="flex gap-3 px-5 py-3.5">
                    <Avatar initials={person.initials} color={person.color} />
                    <div className="text-body">
                      <p className="text-ink">
                        <Link href={`/initiatives/${update.initiativeSlug}`} className="font-semibold hover:underline">
                          {initiative?.name}
                        </Link>
                        <span className="text-muted"> · {update.when}</span>
                      </p>
                      <p className="pt-0.5 text-ink-soft">{update.achievement}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>
    </>
  );
}
