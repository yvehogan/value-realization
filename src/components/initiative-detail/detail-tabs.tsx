"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { segment: "", label: "Overview" },
  { segment: "/milestones", label: "Milestones" },
  { segment: "/value", label: "Value" },
  { segment: "/updates", label: "Updates" },
];

export function DetailTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/initiatives/${slug}`;

  return (
    <nav aria-label="Initiative sections" className="flex gap-1 border-b border-line">
      {TABS.map((tab) => {
        const href = base + tab.segment;
        const active = pathname === href;
        return (
          <Link
            key={tab.label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative px-3.5 py-2.5 text-body font-medium transition-colors",
              active ? "text-brand" : "text-muted hover:text-ink",
            )}
          >
            {tab.label}
            {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" />}
          </Link>
        );
      })}
    </nav>
  );
}
