// Static settings content. Everything else comes from the Nexus API (see src/lib/api).

export const NOTIFICATION_PREFERENCES = [
  { id: "digest", label: "Weekly portfolio digest", description: "Summary of progress and value every Monday", enabled: true },
  { id: "risk", label: "At-risk alerts", description: "Notify me when an initiative moves off track", enabled: true },
  { id: "reminders", label: "Update reminders", description: "Remind responsible persons of overdue updates", enabled: false },
];

export const WORKSPACE_SETTINGS = [
  { label: "Currency", value: "Nigerian Naira (₦)" },
  { label: "Fiscal Year", value: "January – December" },
  { label: "Team", value: "Innovation" },
  { label: "Terminology", value: "Responsible Person(s)" },
];
