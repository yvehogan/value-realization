"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/form";
import { NOTIFICATION_PREFERENCES } from "@/lib/data";

export function NotificationSettings() {
  const [enabled, setEnabled] = useState(() =>
    Object.fromEntries(NOTIFICATION_PREFERENCES.map((p) => [p.id, p.enabled])),
  );

  return (
    <Card className="rounded-card">
      <ul className="divide-y divide-line">
        {NOTIFICATION_PREFERENCES.map((pref) => (
          <li key={pref.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-body font-bold text-ink">{pref.label}</p>
              <p className="text-meta text-muted">{pref.description}</p>
            </div>
            <Toggle
              label={pref.label}
              checked={enabled[pref.id]}
              onChange={(value) => setEnabled((e) => ({ ...e, [pref.id]: value }))}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
