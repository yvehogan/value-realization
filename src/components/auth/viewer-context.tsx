"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Viewer } from "@/lib/viewer";

const ViewerContext = createContext<Viewer | null>(null);

export function ViewerProvider({ viewer, children }: { viewer: Viewer; children: ReactNode }) {
  return <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>;
}

/** The signed-in viewer. Only available inside the authenticated app shell. */
export function useViewer() {
  const viewer = useContext(ViewerContext);
  if (!viewer) throw new Error("useViewer must be used inside <ViewerProvider>");
  return viewer;
}
