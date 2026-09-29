import { TYPE_STYLES, type InitiativeType } from "@/lib/initiative-types";
import { cn } from "@/lib/cn";

export function TypeBadge({ type, className }: { type: InitiativeType; className?: string }) {
  const style = TYPE_STYLES[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-micro font-medium whitespace-nowrap",
        style.text,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
