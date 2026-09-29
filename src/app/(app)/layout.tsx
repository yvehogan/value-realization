import { AppShell } from "@/components/layout/app-shell";
import { requireViewer } from "@/lib/auth";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const viewer = await requireViewer();
  return <AppShell viewer={viewer}>{children}</AppShell>;
}
