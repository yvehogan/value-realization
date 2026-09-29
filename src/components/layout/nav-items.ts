export type NavItem = {
  href: string;
  label: string;
  icon: string;
  /** Icon box in px as drawn in Figma */
  iconSize: { width: number; height: number };
};

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "/icons/nav-dashboard.svg", iconSize: { width: 20, height: 20 } },
  { href: "/initiatives", label: "Initiatives", icon: "/icons/nav-initiatives.svg", iconSize: { width: 24, height: 24 } },
  { href: "/team", label: "Team", icon: "/icons/nav-team.svg", iconSize: { width: 24, height: 24 } },
  { href: "/value-realization", label: "Value Realization", icon: "/icons/nav-value.svg", iconSize: { width: 24, height: 24 } },
  { href: "/updates", label: "Updates", icon: "/icons/nav-updates.svg", iconSize: { width: 23, height: 24 } },
];

export const SETTINGS_NAV: NavItem = {
  href: "/settings",
  label: "Settings",
  icon: "/icons/nav-settings.svg",
  iconSize: { width: 23, height: 24 },
};

/** The collapsed rail still uses the older, lighter settings glyph at 19px. */
export const SETTINGS_RAIL_ICON = "/icons/nav-settings-rail.svg";

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
