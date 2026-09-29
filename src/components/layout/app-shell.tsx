"use client";

import { useState, type ReactNode } from "react";
import { ViewerProvider } from "@/components/auth/viewer-context";
import { NewInitiativeModal } from "@/components/modals/new-initiative-modal";
import { isAdmin, type Viewer } from "@/lib/viewer";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [creating, setCreating] = useState(false);
  const admin = isAdmin(viewer);

  return (
    <ViewerProvider viewer={viewer}>
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Only admins can create projects */}
          <Topbar onNewProject={admin ? () => setCreating(true) : undefined} />
          <main className="w-full max-w-content px-8 py-7">{children}</main>
        </div>
        {admin && <NewInitiativeModal open={creating} onClose={() => setCreating(false)} />}
      </div>
    </ViewerProvider>
  );
}
