import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Page-level H1 + subtitle, with an optional right-aligned action. */
export function PageHeader({ title, description, action, className }: HeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        <h1 className="text-display font-black text-ink">{title}</h1>
        {description && <p className="pt-1 text-lead text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Section H2 + optional description, with an optional right-aligned action. */
export function SectionHeader({ title, description, action, className }: HeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-heading font-black text-ink">{title}</h2>
        {description && <p className="pt-0.5 text-body text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
