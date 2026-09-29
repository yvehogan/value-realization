import { cn } from "@/lib/cn";

// Font sizes follow Figma's 0.4 × diameter ratio.
const SIZES = {
  "2xs": "size-4 text-[0.4rem]", // 16
  xs: "size-[22px] text-[0.55rem]", // 22
  stack: "size-[26px] text-[0.65rem]", // 26
  sm: "size-8 text-[0.8rem]", // 32
  list: "size-[34px] text-[0.85rem]", // 34
  md: "size-9 text-[0.9rem]", // 36
  feed: "size-10 text-body", // 40
  lg: "size-16 text-[1.6rem]", // 64
} as const;

export type AvatarSize = keyof typeof SIZES;

type AvatarProps = {
  initials: string;
  /** Tailwind bg-* class, e.g. `bg-success` */
  color?: string;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ initials, color = "bg-onyx", size = "sm", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full leading-none font-medium text-white",
        SIZES[size],
        color,
        className,
      )}
    >
      {initials}
    </span>
  );
}

type AvatarStackProps = {
  people: { id: string; initials: string; color: string; name: string }[];
  size?: AvatarSize;
};

export function AvatarStack({ people, size = "stack" }: AvatarStackProps) {
  return (
    <span className="flex items-center" aria-label={people.map((p) => p.name).join(", ")}>
      {people.map((person, i) => (
        <span key={person.id} title={person.name} className={cn(i > 0 && "-ml-2")}>
          <Avatar initials={person.initials} color={person.color} size={size} className="ring-2 ring-surface" />
        </span>
      ))}
    </span>
  );
}
