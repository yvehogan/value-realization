import type { Metadata } from "next";
import { ValueView } from "@/components/value/value-view";

export const metadata: Metadata = { title: "Value Realization · Nexus" };

export default async function ValueRealizationPage({ searchParams }: PageProps<"/value-realization">) {
  const { objective } = await searchParams;
  const initialObjective = typeof objective === "string" ? objective : undefined;
  return <ValueView key={initialObjective} initialObjective={initialObjective} />;
}
