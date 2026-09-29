import { notFound } from "next/navigation";
import { DetailTabs } from "@/components/initiative-detail/detail-tabs";
import { InitiativeHeader } from "@/components/initiative-detail/initiative-header";
import { BackLink } from "@/components/ui/back-link";
import { INITIATIVES, getInitiative } from "@/lib/data";

export function generateStaticParams() {
  return INITIATIVES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: LayoutProps<"/initiatives/[slug]">) {
  const { slug } = await params;
  return { title: `${getInitiative(slug)?.name ?? "Initiative"} · Nexus` };
}

export default async function InitiativeLayout({ params, children }: LayoutProps<"/initiatives/[slug]">) {
  const { slug } = await params;
  const initiative = getInitiative(slug);
  if (!initiative) notFound();

  return (
    <>
      <BackLink href="/initiatives" label="Portfolio" />
      <div className="pt-6">
        <InitiativeHeader initiative={initiative} />
      </div>
      <div className="pt-6">
        <DetailTabs slug={slug} />
      </div>
      <div className="pt-6">{children}</div>
    </>
  );
}
