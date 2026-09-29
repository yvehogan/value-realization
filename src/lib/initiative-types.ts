export type InitiativeType = "product" | "program" | "venture" | "rnd" | "others";
export type Workstream = Exclude<InitiativeType, "others">;

/** Label and theme-colour classes for every initiative type (badges, links, bars). */
export const TYPE_STYLES: Record<InitiativeType, { label: string; text: string; bg: string }> = {
  product: { label: "Product", text: "text-product", bg: "bg-product" },
  program: { label: "Program", text: "text-program", bg: "bg-program" },
  venture: { label: "Venture", text: "text-venture", bg: "bg-venture" },
  rnd: { label: "R&D", text: "text-rnd", bg: "bg-rnd" },
  others: { label: "Others", text: "text-muted", bg: "bg-muted" },
};

/** Extra copy + icons for the four strategic workstreams. */
export const WORKSTREAM_META: Record<
  Workstream,
  { plural: string; description: string; pickerDescription: string; icon: string; filterIcon: string }
> = {
  product: {
    plural: "Products",
    description: "Internal and Bank-agnostics products in build & market",
    pickerDescription: "Customer-facing product",
    icon: "/icons/type-product.svg",
    filterIcon: "/icons/filter-product.svg",
  },
  program: {
    plural: "Programs",
    description: "Innovation programs & capability building",
    pickerDescription: "Innovation program",
    icon: "/icons/type-program.svg",
    filterIcon: "/icons/filter-program.svg",
  },
  venture: {
    plural: "Ventures",
    description: "Strategic startup investments",
    pickerDescription: "Strategic investment",
    icon: "/icons/type-venture.svg",
    filterIcon: "/icons/filter-venture.svg",
  },
  rnd: {
    plural: "R&D",
    description: "Applied research & foresight",
    pickerDescription: "Applied research",
    icon: "/icons/type-rnd.svg",
    filterIcon: "/icons/filter-rnd.svg",
  },
};

export const WORKSTREAMS_ORDER: Workstream[] = ["product", "program", "venture", "rnd"];

export function isWorkstream(value: string | undefined): value is Workstream {
  return !!value && (WORKSTREAMS_ORDER as string[]).includes(value);
}
