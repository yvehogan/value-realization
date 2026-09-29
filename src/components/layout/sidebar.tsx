"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/login/actions";
import { useViewer } from "@/components/auth/viewer-context";
import { Avatar } from "@/components/ui/avatar";
import { Icon, MaskIcon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { ROLE_LABEL } from "@/lib/viewer";
import { PRIMARY_NAV, SETTINGS_NAV, SETTINGS_RAIL_ICON, isActive, type NavItem } from "./nav-items";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

// Figma: two 336px circles (#981D87 @ 50%, heavily blurred). The exported SVG
// includes the blur's bleed, so it's 3.33× the circle and offset by the bleed.
const GLOW_SIZE = 1119.67;
const GLOW_BLEED = 391.84;
const GLOWS = [
  { left: -196, top: -111 },
  { left: 108, top: 586 },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const viewer = useViewer();

  return (
    <aside
      className={cn(
        "sticky top-0 isolate flex h-screen shrink-0 flex-col overflow-hidden bg-sidebar text-white transition-[width] duration-200",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar",
      )}
    >
      {GLOWS.map((glow) => (
        // eslint-disable-next-line @next/next/no-img-element -- decorative, sized beyond the viewport
        <img
          key={glow.top}
          src="/decor/sidebar-glow.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -z-10 max-w-none"
          style={{
            width: GLOW_SIZE,
            height: GLOW_SIZE,
            left: glow.left - GLOW_BLEED,
            top: glow.top - GLOW_BLEED,
          }}
        />
      ))}

      {/* Brand + collapse toggle */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-3 px-3 py-5">
          <Link href="/" aria-label="Nexus home">
            <Icon src="/brand/logo-mark.svg" size={47} />
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand sidebar"
            aria-expanded={false}
            className="flex size-7 items-center justify-center rounded-lg hover:bg-white/10"
          >
            <Icon src="/icons/expand.svg" size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Nexus home">
            <Icon src="/brand/logo-mark.svg" size={47} />
            <span className="flex flex-col items-end gap-1">
              <span className="text-[2rem] leading-[1.45rem] font-black tracking-[-0.03em]">Nexus</span>
              <span className="text-[0.5625rem] tracking-[0.02em]">by IDEAx Labs</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            aria-expanded
            className="flex size-7 items-center justify-center rounded-lg hover:bg-white/10"
          >
            <Icon src="/icons/collapse.svg" size={16} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-3 pt-8 pb-3" aria-label="Main">
        <ul className="flex flex-col gap-4">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(pathname, item.href)} collapsed={collapsed} />
            </li>
          ))}
        </ul>
        <div className="pt-4">
          <div className="border-t border-plum-line" />
        </div>
        {collapsed ? (
          <Link
            href={SETTINGS_NAV.href}
            title={SETTINGS_NAV.label}
            aria-current={isActive(pathname, SETTINGS_NAV.href) ? "page" : undefined}
            className="flex justify-center pt-6 hover:opacity-80"
          >
            <Icon src={SETTINGS_RAIL_ICON} size={19} />
            <span className="sr-only">{SETTINGS_NAV.label}</span>
          </Link>
        ) : (
          <div className="pt-3.5">
            <NavLink item={SETTINGS_NAV} active={isActive(pathname, SETTINGS_NAV.href)} collapsed={false} />
          </div>
        )}
      </nav>

      {/* Signed-in user */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-[15px] border-t border-plum-line px-3 py-[15px]">
          <Avatar initials={viewer.initials} color={viewer.color} size="md" />
          <SignOutButton />
        </div>
      ) : (
        <div className="border-t border-plum-line p-3">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <Avatar initials={viewer.initials} color={viewer.color} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-body font-bold">{viewer.name}</p>
              <p className="truncate text-micro leading-[0.86rem] text-plum-muted">
                {ROLE_LABEL[viewer.role].short} · {viewer.title}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      )}
    </aside>
  );
}

function SignOutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        aria-label="Sign out"
        title="Sign out"
        className="flex size-8 items-center justify-center rounded-lg hover:bg-white/10"
      >
        <Icon src="/icons/logout.svg" size={16} />
      </button>
    </form>
  );
}

function NavLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  // The active item uses the 20px bold glyph; idle items keep their drawn size.
  const iconSize = active ? { width: 20, height: 20 } : item.iconSize;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex h-[50px] items-center px-[15px] text-body transition-colors",
        collapsed ? "w-fit" : active ? "gap-2.5" : "gap-3",
        active
          ? "rounded-2xl bg-surface font-medium text-plum"
          : "rounded-lg text-white hover:bg-white/10",
      )}
    >
      <MaskIcon src={item.icon} {...iconSize} />
      {collapsed ? <span className="sr-only">{item.label}</span> : item.label}
    </Link>
  );
}
