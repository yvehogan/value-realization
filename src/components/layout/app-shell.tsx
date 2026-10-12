"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ViewerProvider } from "@/components/auth/viewer-context";
import { QueryProvider } from "@/components/providers/query-provider";
import type { Viewer } from "@/lib/viewer";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Below lg the sidebar is a slide-in drawer; it closes whenever the route changes.
  const pathname = usePathname();
  const [menu, setMenu] = useState({ open: false, path: pathname });
  const menuOpen = menu.open && menu.path === pathname;
  const setMenuOpen = (open: boolean) => setMenu({ open, path: pathname });

  return (
    <QueryProvider>
      <ViewerProvider viewer={viewer}>
        <div className="flex min-h-screen">
          <Sidebar
            collapsed={collapsed && !menuOpen}
            onToggle={() => setCollapsed((c) => !c)}
            mobileOpen={menuOpen}
            onMobileClose={() => setMenuOpen(false)}
          />
          {menuOpen && (
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-30 animate-fade-in bg-scrim backdrop-blur-[2px] lg:hidden"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar onOpenMenu={() => setMenuOpen(true)} />
            <main className="w-full max-w-content px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main>
          </div>
        </div>
      </ViewerProvider>
    </QueryProvider>
  );
}
