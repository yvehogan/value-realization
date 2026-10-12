"use client";

import { cn } from "@/lib/cn";
import { MaskIcon } from "./icon";
import { Spinner } from "./loader";

type PaginationProps = {
  /** 1-based */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Plural noun for the summary, e.g. "initiatives" */
  noun?: string;
  /** Shows a spinner while the next page loads */
  loading?: boolean;
  className?: string;
};

/** Page numbers to show: always first, last and the current ±1, with gaps as "…". */
function pageItems(page: number, pages: number): (number | "gap")[] {
  const wanted = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...wanted].sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) items.push(p - sorted[i - 1] === 2 ? p - 1 : "gap");
    items.push(p);
  });
  return items;
}

// No display class here: page numbers hide on phones, the arrows never do.
const control =
  "size-9 items-center justify-center rounded-lg border text-body font-medium transition-colors disabled:pointer-events-none disabled:opacity-40";

/** "Showing 11–20 of 42" with previous/next and page-number buttons. Hidden when everything fits on one page. */
export function Pagination({ page, pageSize, total, onPageChange, noun = "results", loading, className }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(total, page * pageSize);

  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <p className="flex items-center gap-2 text-body text-muted" aria-live="polite">
        Showing {first}–{last} of {total} {noun}
        {loading && <Spinner size={14} className="text-brand" />}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={cn(control, "inline-flex border-line bg-surface text-ink hover:bg-page")}
        >
          <MaskIcon src="/icons/arrow-right.svg" size={14} className="rotate-180" />
        </button>
        {pageItems(page, pages).map((item, i) =>
          item === "gap" ? (
            <span key={`gap-${i}`} aria-hidden className="hidden w-6 text-center text-body text-subtle sm:inline">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              aria-label={`Page ${item}`}
              className={cn(
                control,
                "hidden sm:inline-flex",
                item === page ? "border-brand bg-brand text-white" : "border-line bg-surface text-ink-soft hover:bg-page",
              )}
            >
              {item}
            </button>
          ),
        )}
        <span className="px-2 text-body text-muted sm:hidden">
          {page} / {pages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
          className={cn(control, "inline-flex border-line bg-surface text-ink hover:bg-page")}
        >
          <MaskIcon src="/icons/arrow-right.svg" size={14} />
        </button>
      </div>
    </nav>
  );
}
