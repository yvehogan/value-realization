import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Scroll wrapper + table. Place inside a Card. */
export function Table({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-collapse text-left", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line bg-page/40 px-5 py-3 text-meta font-bold tracking-wide text-muted uppercase",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return <td className={cn("border-b border-line px-5 py-3.5 text-body text-ink-soft", className)} {...props} />;
}

/** Table row that highlights on hover. Pair with a stretched link in the first cell. */
export function Tr({ className, ...props }: ComponentPropsWithoutRef<"tr">) {
  return <tr className={cn("relative transition-colors last:[&>td]:border-b-0 hover:bg-page/50", className)} {...props} />;
}
