import { INITIATIVES, UPDATES, type PersonCategory } from "./data";

export const CATEGORY_STYLES: Record<PersonCategory, { label: string; text: string; bg: string; dot: string }> = {
  engineering: { label: "Engineering", text: "text-program", bg: "bg-program/10", dot: "bg-program" },
  design: { label: "Design", text: "text-product", bg: "bg-product/10", dot: "bg-product" },
  programs: { label: "Programs", text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" },
  others: { label: "Others", text: "text-muted", bg: "bg-track", dot: "bg-subtle" },
};

export const CATEGORY_ORDER: PersonCategory[] = ["engineering", "design", "programs", "others"];

export function initiativesFor(personId: string) {
  return INITIATIVES.filter((i) => i.ownerIds.includes(personId));
}

export function activeInitiativesFor(personId: string) {
  return initiativesFor(personId).filter((i) => i.status !== "completed");
}

export function personStats(personId: string) {
  const owned = initiativesFor(personId);
  return [
    { label: "Active initiatives", value: owned.filter((i) => i.status !== "completed").length },
    { label: "On-track", value: owned.filter((i) => i.status === "on-track").length },
    { label: "Completed", value: owned.filter((i) => i.status === "completed").length },
    { label: "Updates submitted", value: UPDATES.filter((u) => u.authorId === personId).length },
    { label: "Objectives contributed", value: new Set(owned.flatMap((i) => Object.keys(i.objectives ?? {}))).size },
  ];
}
