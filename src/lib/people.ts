export type PersonCategory = "engineering" | "design" | "programs" | "others";

export const CATEGORY_STYLES: Record<PersonCategory | "unassigned", { label: string; text: string; bg: string; dot: string }> = {
  engineering: { label: "Engineering", text: "text-program", bg: "bg-program/10", dot: "bg-program" },
  design: { label: "Design", text: "text-product", bg: "bg-product/10", dot: "bg-product" },
  programs: { label: "Programs", text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" },
  others: { label: "Others", text: "text-muted", bg: "bg-track", dot: "bg-subtle" },
  unassigned: { label: "Unassigned", text: "text-muted", bg: "bg-track", dot: "bg-subtle" },
};

export const CATEGORY_ORDER: PersonCategory[] = ["engineering", "design", "programs", "others"];
