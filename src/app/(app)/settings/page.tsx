import type { Metadata } from "next";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { PageHeader, SectionHeader } from "@/components/ui/headers";
import { requireViewer } from "@/lib/auth";
import { WORKSPACE_SETTINGS } from "@/lib/data";
import { ROLE_LABEL } from "@/lib/viewer";

export const metadata: Metadata = { title: "Settings · Nexus" };

export default async function SettingsPage() {
  const viewer = await requireViewer();

  return (
    <div className="max-w-[768px]">
      <PageHeader title="Settings" description="Manage your profile and workspace preferences." />

      <Card className="mt-6 rounded-card p-6">
        <SectionHeader title="Profile" />
        <div className="flex items-center gap-4 pt-4">
          <Avatar initials={viewer.initials} color={viewer.color} size="lg" />
          <div>
            <p className="text-heading font-black text-ink">{viewer.name}</p>
            <p className="text-base text-muted">{viewer.title}</p>
            <span className="mt-2 inline-flex rounded-md bg-page px-2 py-0.5 text-meta font-medium text-brand">
              {ROLE_LABEL[viewer.role].short} · {ROLE_LABEL[viewer.role].access}
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-6">
        <NotificationSettings />
      </div>

      <Card className="mt-6 rounded-card p-6">
        <SectionHeader title="Workspace" />
        <dl className="grid gap-4 pt-4 sm:grid-cols-2">
          {WORKSPACE_SETTINGS.map((setting) => (
            <div key={setting.label}>
              <dt className="text-meta text-muted">{setting.label}</dt>
              <dd className="pt-0.5 text-body font-medium text-ink">{setting.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
