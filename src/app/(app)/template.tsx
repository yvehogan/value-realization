import type { ReactNode } from "react";

/** Re-mounts on every navigation, so each page eases in. */
export default function AppTemplate({ children }: { children: ReactNode }) {
  return <div className="animate-fade-up">{children}</div>;
}
