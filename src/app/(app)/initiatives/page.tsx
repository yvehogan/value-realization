import type { Metadata } from "next";
import { PortfolioView } from "@/components/initiatives/portfolio-view";
import { PageHeader } from "@/components/ui/headers";
import { isWorkstream } from "@/lib/initiative-types";

export const metadata: Metadata = { title: "Portfolio · Nexus" };

export default async function InitiativesPage({ searchParams }: PageProps<"/initiatives">) {
  const { type } = await searchParams;
  const initialType = typeof type === "string" && isWorkstream(type) ? type : "all";

  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Everything Innovation is building, running, researching and investing in."
      />
      {/* key resets filters when arriving from a dashboard workstream card */}
      <PortfolioView key={initialType} initialType={initialType} />
    </>
  );
}
