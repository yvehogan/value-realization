import { DashboardView } from "@/components/dashboard/dashboard-view";
import { Greeting } from "@/components/dashboard/greeting";
import { PageHeader } from "@/components/ui/headers";
import { requireViewer } from "@/lib/auth";

export default async function DashboardPage() {
  const viewer = await requireViewer();

  return (
    // The redesigned dashboard sits 24px below the top bar (other screens: 28px).
    <div className="-mt-1 flex flex-col gap-7.75">
      <PageHeader
        title={<Greeting name={viewer.firstName} />}
        description="Here's how Innovation is performing across projects and initiatives."
      />
      <DashboardView />
    </div>
  );
}
