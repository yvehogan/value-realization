import type { ReactNode } from "react";

/** Fades between a project's tabs; the header above stays put. */
export default function ProjectTabTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
