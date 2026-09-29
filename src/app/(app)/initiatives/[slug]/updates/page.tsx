import { notFound } from "next/navigation";
import { UpdateLabel, updateLines } from "@/components/updates/update-tag";
import { AddUpdateButton } from "@/components/modals/add-update-button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getInitiative, getInitiativeUpdates, getPerson } from "@/lib/data";

export default async function InitiativeUpdatesPage({ params }: PageProps<"/initiatives/[slug]/updates">) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();
  const updates = getInitiativeUpdates(slug);

  return (
    <div className="flex flex-col gap-4">
      {/* Collapses when the viewer can't update this initiative */}
      <div className="flex justify-end empty:hidden">
        <AddUpdateButton initiativeSlug={slug} />
      </div>
      {updates.length === 0 ? (
        <Card className="rounded-card p-6 text-body text-muted">No updates yet. Be the first to share progress.</Card>
      ) : (
        updates.map((update) => {
          const author = getPerson(update.authorId);
          return (
            <Card key={update.id} className="rounded-card p-5">
              {author && (
                <div className="flex items-center gap-3">
                  <Avatar initials={author.initials} color={author.color} size="md" />
                  <div>
                    <p className="text-body font-bold text-ink">{author.name}</p>
                    <p className="text-meta text-muted">
                      {update.date} · {update.when}
                    </p>
                  </div>
                </div>
              )}
              <dl className="flex flex-col gap-2.5 pt-4">
                {updateLines(update).map((line) => (
                  <div key={line.kind} className="flex items-start gap-3">
                    <dt>
                      <UpdateLabel kind={line.kind} long />
                    </dt>
                    <dd className="text-body text-ink-soft">{line.text}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          );
        })
      )}
    </div>
  );
}
