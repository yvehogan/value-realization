import type { ReactNode } from "react";
import { errorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import { Button } from "./button";
import { Card } from "./card";

/** Card shown when a query fails, with a retry. */
export function ErrorState({ error, onRetry, className }: { error: unknown; onRetry?: () => void; className?: string }) {
  return (
    <Card role="alert" className={cn("flex animate-fade-in flex-wrap items-center justify-between gap-3 rounded-2xl p-6", className)}>
      <p className="text-body text-danger">{errorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}

/** Muted message card for empty lists. */
export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return <Card className={cn("animate-fade-in rounded-2xl p-10 text-center text-body text-muted", className)}>{children}</Card>;
}
