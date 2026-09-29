import type { InitiativeType, Workstream } from "./initiative-types";
import { placeholderPhases, placeholderUpdates, placeholderValue } from "./placeholders";
import type { Status } from "./status";

// Mock data taken from the Figma designs. Replace with API calls when the
// backend is available.

/* ------------------------------------------------------------------ People */

export type PersonCategory = "engineering" | "design" | "programs" | "others";

export type Person = {
  id: string;
  name: string;
  initials: string;
  role: string;
  category: PersonCategory;
  /** Tailwind bg-* class for the avatar */
  color: string;
};

export const PEOPLE: Person[] = [
  { id: "victor-onwuelu", name: "Victor Onwuelu", initials: "VO", role: "Design Lead", category: "design", color: "bg-success" },
  { id: "moyinoluwa-akindele", name: "Moyinoluwa Akindele", initials: "MA", role: "Product Manager", category: "others", color: "bg-program" },
  { id: "henry-ozomgbachi", name: "Henry Ozomgbachi", initials: "HO", role: "Engineering Lead", category: "engineering", color: "bg-product" },
  { id: "jude-akinyemi", name: "Jude Akinyemi", initials: "JA", role: "Program Analyst", category: "programs", color: "bg-warning" },
  { id: "tomi-olaoye", name: "Tomi Olaoye", initials: "TO", role: "Scrum Master", category: "programs", color: "bg-venture" },
  { id: "ogorchukwu-ofili", name: "Ogorchukwu Ofili", initials: "OO", role: "R&D Analyst", category: "others", color: "bg-rnd" },
  { id: "azeez-abdulyekeen", name: "Azeez Abdulyekeen", initials: "AA", role: "Venture Analyst", category: "others", color: "bg-danger" },
  { id: "tosin-rotimidokun", name: "Tosin Rotimidokun", initials: "TR", role: "Frontend Engineer", category: "engineering", color: "bg-program" },
  { id: "tosin-longe", name: "Tosin Longe", initials: "TL", role: "Program Analyst", category: "programs", color: "bg-brand" },
  { id: "toluwase-obasun", name: "Toluwase Obasun", initials: "TO", role: "Product Designer", category: "design", color: "bg-brand-deep" },
  { id: "dorcas-popoola", name: "Dorcas Popoola", initials: "DP", role: "Product Designer", category: "design", color: "bg-rnd" },
  { id: "godson-okezie", name: "Godson Okezie", initials: "GO", role: "Mobile Engineer", category: "engineering", color: "bg-warning" },
  { id: "tokoni-apapa", name: "Tokoni Apapa", initials: "TA", role: "Product Designer", category: "design", color: "bg-venture" },
  { id: "damilola-ogunboyejo", name: "Damilola Ogunboyejo", initials: "DO", role: "Frontend Engineer", category: "engineering", color: "bg-success" },
  { id: "abisola-smith", name: "Abisola Smith", initials: "AS", role: "Lab Manager", category: "others", color: "bg-plum" },
  { id: "evelyn-ita", name: "Evelyn Ita", initials: "EI", role: "Frontend Engineer", category: "engineering", color: "bg-product" },
  { id: "deborah-aladi", name: "Deborah Aladi", initials: "DA", role: "Frontend Engineer", category: "engineering", color: "bg-danger" },
  { id: "adaeze-onwurah", name: "Adaeze Onwurah", initials: "AO", role: "Backend Engineer", category: "engineering", color: "bg-program" },
  { id: "mary-muoghalu", name: "Mary Muoghalu", initials: "MM", role: "Frontend Engineer", category: "engineering", color: "bg-brand" },
  { id: "luke-duvbuiama", name: "Luke Duvbuiama", initials: "LD", role: "Backend Engineer", category: "engineering", color: "bg-rnd" },
  { id: "izuchukwu-okorie", name: "Izuchukwu Okorie", initials: "IO", role: "Backend Engineer", category: "engineering", color: "bg-warning" },
  { id: "clinton-amadi", name: "Clinton Amadi", initials: "CA", role: "Backend Engineer", category: "engineering", color: "bg-success" },
  { id: "abdulbasit-ogunbayi", name: "Abdulbasit Ogunbayi", initials: "AO", role: "Product Designer", category: "design", color: "bg-venture" },
];

/** Solomon isn't on the team roster but can be made responsible for initiatives. */
export const HEAD_OF_INNOVATION = {
  id: "solomon-adebayo",
  name: "Solomon Adebayo",
  firstName: "Solomon",
  initials: "SA",
  role: "Head of Innovation",
  access: "Admin",
  color: "bg-onyx",
};

/** Everyone who can be made responsible for an initiative (team + current user). */
export const ASSIGNABLE_PEOPLE: Person[] = [
  ...PEOPLE.slice(0, 7),
  {
    id: HEAD_OF_INNOVATION.id,
    name: HEAD_OF_INNOVATION.name,
    initials: HEAD_OF_INNOVATION.initials,
    role: HEAD_OF_INNOVATION.role,
    category: "others",
    color: HEAD_OF_INNOVATION.color,
  },
  ...PEOPLE.slice(7),
];

export function getPerson(id: string) {
  return PEOPLE.find((p) => p.id === id);
}

/* -------------------------------------------------------------- Objectives */

export type Objective = {
  id: string;
  name: string;
  progress: number;
  realized: string;
  target: string;
};

export const OBJECTIVES: Objective[] = [
  { id: "earn-revenue", name: "Earn More Revenue", progress: 78, realized: "₦87M", target: "₦120M" },
  { id: "reduce-costs", name: "Reduce Costs", progress: 65, realized: "₦42M", target: "₦60M" },
  { id: "acquire-customers", name: "Acquire New Customers", progress: 82, realized: "38,400", target: "50,000" },
  { id: "existing-customers", name: "Get More From Existing Customers", progress: 69, realized: "₦31M", target: "₦45M" },
];

export function getObjective(id: string) {
  return OBJECTIVES.find((o) => o.id === id);
}

/* ------------------------------------------------------------- Initiatives */

export type Phase = {
  name: string;
  status: Extract<Status, "completed" | "in-progress" | "upcoming">;
  progress: number;
  target: string;
  completed?: string;
  ownerId: string;
};

export type ValueLine = {
  label: string;
  realized: string;
  expected: string;
  progress: number;
};

export type Initiative = {
  slug: string;
  name: string;
  type: InitiativeType;
  ownerIds: string[];
  status: Status;
  progress: number;
  lastUpdated: string;
  description?: string;
  /** Objective id → share of this initiative's contribution (%) */
  objectives?: Record<string, number>;
  phases?: Phase[];
  value?: { lines: ValueLine[]; overall: number };
  /** Program-only key facts */
  details?: { label: string; value: string }[];
};

/** Initiatives as specified in the designs. Use `INITIATIVES`, which fills in missing detail. */
const SEED_INITIATIVES: Initiative[] = [
  {
    slug: "coophub",
    name: "CoopHub",
    type: "product",
    ownerIds: ["victor-onwuelu", "toluwase-obasun", "abisola-smith"],
    status: "on-track",
    progress: 68,
    lastUpdated: "Today",
    description:
      "A digital platform that helps cooperative societies manage members, contributions and loans in one place.",
    objectives: { "existing-customers": 70, "acquire-customers": 30 },
    phases: [
      { name: "Discovery", status: "completed", progress: 100, target: "Feb 2026", completed: "Feb 2026", ownerId: "moyinoluwa-akindele" },
      { name: "MVP Development", status: "completed", progress: 100, target: "Jun 2026", completed: "Jun 2026", ownerId: "victor-onwuelu" },
      { name: "Beta Testing", status: "in-progress", progress: 70, target: "Nov 2026", ownerId: "victor-onwuelu" },
    ],
    value: {
      overall: 58,
      lines: [
        { label: "Cost Savings", realized: "₦9M", expected: "₦18M", progress: 50 },
        { label: "Customers", realized: "19,400", expected: "30,000", progress: 65 },
      ],
    },
  },
  { slug: "gotap", name: "GoTap", type: "product", ownerIds: ["henry-ozomgbachi", "godson-okezie"], status: "at-risk", progress: 82, lastUpdated: "Today", objectives: { "earn-revenue": 55, "acquire-customers": 45 } },
  { slug: "smebestie", name: "SMEBestie", type: "product", ownerIds: ["moyinoluwa-akindele", "henry-ozomgbachi"], status: "on-track", progress: 61, lastUpdated: "Yesterday", objectives: { "earn-revenue": 50, "existing-customers": 50 } },
  { slug: "bridgee", name: "Bridgee", type: "product", ownerIds: ["moyinoluwa-akindele", "damilola-ogunboyejo"], status: "on-track", progress: 67, lastUpdated: "Yesterday", objectives: { "earn-revenue": 70, "acquire-customers": 30 } },
  { slug: "impave", name: "Impave", type: "product", ownerIds: ["moyinoluwa-akindele"], status: "on-track", progress: 55, lastUpdated: "2 days ago", objectives: { "earn-revenue": 100 } },
  { slug: "geegs", name: "Geegs", type: "product", ownerIds: ["tosin-longe"], status: "at-risk", progress: 47, lastUpdated: "4 days ago", objectives: { "earn-revenue": 40, "existing-customers": 60 } },
  { slug: "account-reup", name: "Account ReUp", type: "product", ownerIds: ["tosin-longe"], status: "on-track", progress: 72, lastUpdated: "Today", objectives: { "earn-revenue": 20, "existing-customers": 80 } },
  { slug: "gl-monitoring", name: "GL Monitoring", type: "product", ownerIds: ["moyinoluwa-akindele"], status: "on-track", progress: 76, lastUpdated: "Yesterday", objectives: { "reduce-costs": 100 } },
  { slug: "alat-flow", name: "ALAT Flow", type: "product", ownerIds: ["tosin-longe"], status: "on-track", progress: 74, lastUpdated: "Today", objectives: { "earn-revenue": 40, "acquire-customers": 60 } },
  { slug: "efams", name: "EFAMS", type: "product", ownerIds: ["tokoni-apapa", "victor-onwuelu"], status: "not-started", progress: 0, lastUpdated: "1 week ago", objectives: { "reduce-costs": 100 } },
  { slug: "wema-analytics", name: "Wema Analytics", type: "product", ownerIds: ["ogorchukwu-ofili"], status: "on-track", progress: 78, lastUpdated: "2 days ago", objectives: { "reduce-costs": 60, "existing-customers": 40 } },
  { slug: "alat-rewards", name: "ALAT Rewards", type: "product", ownerIds: ["moyinoluwa-akindele"], status: "on-track", progress: 63, lastUpdated: "Yesterday", objectives: { "existing-customers": 100 } },
  { slug: "ideas-portal", name: "Ideas Portal", type: "product", ownerIds: ["abisola-smith"], status: "completed", progress: 100, lastUpdated: "1 week ago" },
  {
    slug: "hackaholics",
    name: "Hackaholics",
    type: "program",
    ownerIds: ["jude-akinyemi", "tomi-olaoye"],
    status: "on-track",
    progress: 74,
    lastUpdated: "2 days ago",
    description:
      "Wema's pan-African student hackathon nurturing early-stage innovators and building a pipeline of future talent and customers.",
    objectives: { "acquire-customers": 60, "existing-customers": 40 },
    details: [
      { label: "Program Type", value: "Hackathon" },
      { label: "Target Audience", value: "University students" },
      { label: "Timeline", value: "Mar – Nov 2026" },
      { label: "Tracks", value: "Hackathon · Startup · Social Impact" },
      { label: "Schools Visited", value: "3" },
    ],
    phases: [
      { name: "Registration", status: "completed", progress: 100, target: "Apr 2026", completed: "Apr 2026", ownerId: "jude-akinyemi" },
      { name: "Regional Finals", status: "in-progress", progress: 60, target: "Sep 2026", ownerId: "jude-akinyemi" },
      { name: "Grand Finale", status: "upcoming", progress: 0, target: "Nov 2026", ownerId: "tomi-olaoye" },
    ],
  },
  { slug: "rumble-workshop", name: "Rumble Workshop", type: "program", ownerIds: ["jude-akinyemi"], status: "on-track", progress: 71, lastUpdated: "5 days ago", objectives: { "existing-customers": 100 } },
  { slug: "accelerator-program", name: "Accelerator Program", type: "program", ownerIds: ["jude-akinyemi", "azeez-abdulyekeen"], status: "on-track", progress: 66, lastUpdated: "Yesterday", objectives: { "earn-revenue": 50, "acquire-customers": 50 } },
  { slug: "open-house", name: "Open House", type: "program", ownerIds: ["tomi-olaoye"], status: "at-risk", progress: 48, lastUpdated: "4 days ago", objectives: { "acquire-customers": 100 } },
  { slug: "emergency-response-africa", name: "Emergency Response Africa", type: "venture", ownerIds: ["azeez-abdulyekeen"], status: "on-track", progress: 60, lastUpdated: "2 days ago", objectives: { "acquire-customers": 100 } },
  { slug: "build-africa", name: "Build Africa", type: "venture", ownerIds: ["azeez-abdulyekeen"], status: "at-risk", progress: 42, lastUpdated: "1 week ago", objectives: { "earn-revenue": 100 } },
  { slug: "campus-runz", name: "Campus Runz", type: "venture", ownerIds: ["azeez-abdulyekeen", "tomi-olaoye"], status: "on-track", progress: 66, lastUpdated: "3 days ago", objectives: { "acquire-customers": 100 } },
  { slug: "feegor", name: "Feegor", type: "venture", ownerIds: ["azeez-abdulyekeen"], status: "on-track", progress: 58, lastUpdated: "5 days ago", objectives: { "earn-revenue": 100 } },
  { slug: "learn-pally", name: "Learn Pally", type: "venture", ownerIds: ["azeez-abdulyekeen", "ogorchukwu-ofili"], status: "on-track", progress: 62, lastUpdated: "4 days ago", objectives: { "acquire-customers": 100 } },
  { slug: "dozzia", name: "Dozzia", type: "venture", ownerIds: ["azeez-abdulyekeen"], status: "not-started", progress: 0, lastUpdated: "2 weeks ago" },
  { slug: "innovation-wrap", name: "Innovation Wrap", type: "rnd", ownerIds: ["ogorchukwu-ofili"], status: "on-track", progress: 70, lastUpdated: "5 days ago", objectives: { "earn-revenue": 100 } },
  { slug: "branch-engagement", name: "Branch Engagement", type: "rnd", ownerIds: ["ogorchukwu-ofili", "victor-onwuelu"], status: "off-track", progress: 42, lastUpdated: "3 days ago", objectives: { "existing-customers": 100 } },
  { slug: "innovation-brand-comms", name: "Innovation Brand & Comms", type: "others", ownerIds: ["tomi-olaoye"], status: "on-track", progress: 55, lastUpdated: "6 days ago" },
  { slug: "team-operations-tooling", name: "Team Operations & Tooling", type: "others", ownerIds: ["henry-ozomgbachi"], status: "not-started", progress: 10, lastUpdated: "1 week ago", objectives: { "reduce-costs": 100 } },
];

/** Every initiative, with placeholder phases/value where the designs give none. */
export const INITIATIVES: Initiative[] = SEED_INITIATIVES.map((initiative) => ({
  ...initiative,
  phases: initiative.phases ?? placeholderPhases(initiative),
  value: initiative.value ?? placeholderValue(initiative),
}));

export function getInitiative(slug: string) {
  return INITIATIVES.find((i) => i.slug === slug);
}

export function getInitiativeByName(name: string) {
  return INITIATIVES.find((i) => i.name === name);
}

/** What each person does on an initiative, where it differs from their role default. */
const RESPONSIBILITY_OVERRIDES: Record<string, Record<string, string>> = {
  "victor-onwuelu": { "branch-engagement": "Design Input" },
};

const RESPONSIBILITY_BY_CATEGORY: Record<PersonCategory, string> = {
  design: "Product Design",
  engineering: "Engineering",
  programs: "Program Management",
  others: "Product Management",
};

export function getResponsibility(person: Person, initiativeSlug: string) {
  return RESPONSIBILITY_OVERRIDES[person.id]?.[initiativeSlug] ?? RESPONSIBILITY_BY_CATEGORY[person.category];
}

/* ----------------------------------------------------------------- Updates */

export type UpdateEntry = {
  id: string;
  authorId: string;
  initiativeSlug: string;
  date: string;
  when: string;
  achievement: string;
  next?: string;
  blocker?: string;
  metric?: string;
};

export const UPDATES: UpdateEntry[] = [
  {
    id: "u1",
    authorId: "victor-onwuelu",
    initiativeSlug: "alat-flow",
    date: "September 10, 2026",
    when: "2 hours ago",
    achievement: "Completed beta onboarding redesign.",
    next: "Begin beta user recruitment.",
    blocker: "Awaiting compliance approval.",
    metric: "Active Users: 48,000 → 64,000",
  },
  {
    id: "u2",
    authorId: "moyinoluwa-akindele",
    initiativeSlug: "coophub",
    date: "September 9, 2026",
    when: "Yesterday",
    achievement: "Contribution dashboard milestone completed.",
    next: "Start cooperative onboarding batch 3.",
    metric: "Cooperatives: 98 → 132",
  },
  {
    id: "u3",
    authorId: "jude-akinyemi",
    initiativeSlug: "hackaholics",
    date: "September 9, 2026",
    when: "Yesterday",
    achievement: "Regional finals kicked off.",
    next: "Escalate to procurement.",
    blocker: "Vendor onboarding flagged as a blocker.",
  },
  {
    id: "u4",
    authorId: "ogorchukwu-ofili",
    initiativeSlug: "innovation-wrap",
    date: "September 8, 2026",
    when: "2 days ago",
    achievement: "Published the Q3 innovation trends brief.",
    next: "Begin synthesis phase.",
    metric: "Insights Published: 4 → 6",
  },
  {
    id: "u5",
    authorId: "azeez-abdulyekeen",
    initiativeSlug: "emergency-response-africa",
    date: "September 7, 2026",
    when: "3 days ago",
    achievement: "Series A milestone reviewed with founders.",
    next: "Explore bridge round options.",
    blocker: "Runway shorter than plan.",
  },
  {
    id: "u6",
    authorId: "victor-onwuelu",
    initiativeSlug: "gotap",
    date: "September 7, 2026",
    when: "3 days ago",
    achievement: "Onboarded 300 new merchants this week.",
    metric: "Merchants: 3,600 → 3,900",
  },
];

/** Feed updates for an initiative plus its (placeholder) older history, newest first. */
export function getInitiativeUpdates(slug: string): UpdateEntry[] {
  const initiative = getInitiative(slug);
  if (!initiative) return [];
  return [...UPDATES.filter((u) => u.initiativeSlug === slug), ...placeholderUpdates(initiative)];
}

/* --------------------------------------------------------------- Dashboard */

export type StatDecoration = "waves-sky" | "waves-mint" | "waves-amber";

export type Stat = {
  label: string;
  value: string;
  note: string;
  icon: string;
  /** Tailwind bg-* class for the icon tile */
  tile: string;
  /** Trend notes get the up-arrow and brand colour; plain notes are muted */
  trend: boolean;
  /** Decorative artwork in the card's bottom-right corner */
  decoration?: StatDecoration;
};

export const DASHBOARD_STATS: Stat[] = [
  { label: "Active Initiatives", value: "25", note: "+3 from last quarter", icon: "/icons/stat-active.svg", tile: "bg-tile-sky", trend: true, decoration: "waves-sky" },
  // TODO: add the purple wave artwork (Figma node 68:61298) once it can be exported.
  { label: "Overall Objectives Progress", value: "72%", note: "+6% this quarter", icon: "/icons/stat-objectives.svg", tile: "bg-tile-lilac", trend: true },
  { label: "Value Realized", value: "₦184.5M", note: "₦250M target", icon: "/icons/stat-value.svg", tile: "bg-tile-mint", trend: true, decoration: "waves-mint" },
  { label: "Initiatives At Risk", value: "5", note: "2 require immediate attention", icon: "/icons/stat-risk.svg", tile: "bg-tile-blush", trend: false, decoration: "waves-amber" },
];

export type WorkstreamSummary = {
  type: Workstream;
  initiatives: number;
  progress: number;
};

export const WORKSTREAMS: WorkstreamSummary[] = [
  { type: "product", initiatives: 13, progress: 64 },
  { type: "program", initiatives: 4, progress: 65 },
  { type: "venture", initiatives: 6, progress: 48 },
  { type: "rnd", initiatives: 2, progress: 56 },
];

/* ------------------------------------------------------- Value realization */

export type ValueCategory = {
  label: string;
  value: string;
  change: string;
  /** Share of target realized (%) — drives the Value by Category chart */
  ofTarget: number;
};

export const VALUE_TOTAL = { realized: "₦184.5M", target: "₦250M", progress: 74 };

export const VALUE_CATEGORIES: ValueCategory[] = [
  { label: "Revenue", value: "₦87M", change: "+12%", ofTarget: 73 },
  { label: "Cost Savings", value: "₦42M", change: "+8%", ofTarget: 70 },
  { label: "New Customers", value: "38,400", change: "+15%", ofTarget: 77 },
  { label: "Efficiency", value: "24%", change: "+4pt", ofTarget: 80 },
  { label: "Strategic Value", value: "76%", change: "+6pt", ofTarget: 76 },
];

/* ---------------------------------------------------------------- Settings */

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
