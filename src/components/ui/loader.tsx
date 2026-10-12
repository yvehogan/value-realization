import { cn } from "@/lib/cn";

/**
 * Animated loading ring. Inherits the text colour, so it's white inside primary buttons and
 * brand-coloured in page loaders. Swap the SVG for a branded GIF here if one is designed.
 */
export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0 animate-spin", className)}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Centred loader shown while a page's data is on its way. */
export function PageLoader({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex min-h-[240px] flex-col items-center justify-center gap-3", className)}>
      <Spinner size={36} className="text-brand" />
      <span className="text-body text-muted">{label}</span>
    </div>
  );
}
