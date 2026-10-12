"use client";

import Link from "next/link";
import { useViewer } from "@/components/auth/viewer-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type TopbarProps = {
  /** Opens the sidebar drawer (below lg) */
  onOpenMenu: () => void;
};

export function Topbar({ onOpenMenu }: TopbarProps) {
  const viewer = useViewer();

  return (
    <header className="sticky top-0 z-20 flex h-topbar items-center justify-between gap-3 border-b border-line px-4 backdrop-blur-md sm:px-6 lg:justify-end lg:gap-4 lg:px-8">
      <Button variant="icon" aria-label="Open menu" onClick={onOpenMenu} className="lg:hidden">
        <Icon src="/icons/menu.svg" size={20} />
      </Button>

      <div className="flex items-center gap-2">
        <span className="hidden sm:contents">
          <Button variant="secondary" size="tight" radius="rounded-button">
            This Year
            <Icon src="/icons/chevron-down.svg" size={15} />
          </Button>
        </span>
        <Button variant="icon" aria-label="Notifications" className="relative">
          <Icon src="/icons/bell.svg" size={17} />
          <span className="absolute top-2 left-5 size-1.5 rounded-full bg-danger" />
        </Button>
        <Link href="/settings" aria-label={`${viewer.name} — profile and settings`} title={viewer.name} className="rounded-full">
          <Avatar initials={viewer.initials} color={viewer.color} size="feed" />
        </Link>
      </div>
    </header>
  );
}
