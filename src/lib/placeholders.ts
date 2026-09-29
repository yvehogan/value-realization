import type { Initiative, Phase, UpdateEntry, ValueLine } from "./data";
import type { InitiativeType } from "./initiative-types";

// Deterministic placeholder detail (phases, value, update history) for
// initiatives the designs don't specify. Seeded from the slug, so numbers are
// stable across reloads. Delete this module once real data is available.

function seed(slug: string) {
  let h = 2166136261;
  for (const ch of slug) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** Pseudo-random 0–1 from the slug and a salt. */
function rand(slug: string, salt: number) {
  const x = Math.sin(seed(slug) + salt * 97.13) * 10000;
  return x - Math.floor(x);
}

const PHASE_TEMPLATES: Record<InitiativeType, string[]> = {
  product: ["Discovery", "MVP Development", "Beta Testing", "Launch"],
  program: ["Planning", "Execution", "Showcase"],
  venture: ["Due Diligence", "Investment", "Portfolio Support"],
  rnd: ["Research", "Prototype", "Findings Report"],
  others: ["Planning", "Rollout", "Review"],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(index: number) {
  const year = 2026 + Math.floor(index / 12);
  return `${MONTHS[index % 12]} ${year}`;
}

export function placeholderPhases(initiative: Initiative): Phase[] {
  const names = PHASE_TEMPLATES[initiative.type];
  const segment = 100 / names.length;
  const startMonth = Math.floor(rand(initiative.slug, 1) * 3); // Jan–Mar 2026
  const span = names.length === 4 ? 3 : 4; // months per phase

  return names.map((name, i) => {
    const target = monthLabel(startMonth + span * (i + 1) - 1);
    const ownerId = initiative.ownerIds[i % initiative.ownerIds.length];
    let progress = Math.round(Math.min(100, Math.max(0, ((initiative.progress - i * segment) / segment) * 100)));
    if (initiative.status === "completed") progress = 100;
    if (initiative.status === "not-started") progress = 0;

    const status: Phase["status"] = progress >= 100 ? "completed" : progress > 0 ? "in-progress" : "upcoming";
    return { name, status, progress, target, completed: status === "completed" ? target : undefined, ownerId };
  });
}

function naira(millions: number) {
  return `₦${millions >= 10 ? Math.round(millions) : Math.round(millions * 10) / 10}M`;
}

function count(n: number) {
  return (Math.round(n / 100) * 100).toLocaleString("en-US");
}

const OBJECTIVE_VALUE: Record<string, { label: string; kind: "money" | "count"; min: number; max: number }> = {
  "earn-revenue": { label: "Revenue", kind: "money", min: 6, max: 30 },
  "reduce-costs": { label: "Cost Savings", kind: "money", min: 4, max: 18 },
  "acquire-customers": { label: "New Customers", kind: "count", min: 3000, max: 25000 },
  "existing-customers": { label: "Cross-sell Revenue", kind: "money", min: 3, max: 15 },
};

export function placeholderValue(initiative: Initiative): NonNullable<Initiative["value"]> {
  const objectiveIds = Object.keys(initiative.objectives ?? {});
  const lines: ValueLine[] = (objectiveIds.length ? objectiveIds : ["efficiency"]).map((id, i) => {
    const spec = OBJECTIVE_VALUE[id];
    // Realized value trails delivery progress a little.
    const pace = 0.55 + rand(initiative.slug, 10 + i) * 0.4;
    const progress = Math.min(100, Math.round(initiative.progress * pace));

    if (!spec) {
      return { label: "Efficiency Gain", realized: `${Math.round(progress * 0.3)}%`, expected: "30%", progress };
    }
    const expected = spec.min + rand(initiative.slug, 20 + i) * (spec.max - spec.min);
    const realized = (expected * progress) / 100;
    return spec.kind === "money"
      ? { label: spec.label, realized: naira(realized), expected: naira(expected), progress }
      : { label: spec.label, realized: count(realized), expected: count(expected), progress };
  });

  const overall = Math.round(lines.reduce((sum, l) => sum + l.progress, 0) / lines.length);
  return { lines, overall };
}

/** One older update per initiative, so every Updates tab has history. */
export function placeholderUpdates(initiative: Initiative): UpdateEntry[] {
  const phases = initiative.phases ?? placeholderPhases(initiative);
  const current = phases.find((p) => p.status === "in-progress") ?? phases.find((p) => p.status === "upcoming");
  const lastDone = [...phases].reverse().find((p) => p.status === "completed");
  const before = Math.max(0, initiative.progress - 6 - Math.round(rand(initiative.slug, 30) * 6));

  const achievement =
    initiative.status === "not-started"
      ? "Initiative scoped and responsible team assigned."
      : lastDone
        ? `${lastDone.name} phase signed off.`
        : `${phases[0].name} phase kicked off with the team.`;

  const next =
    initiative.status === "completed"
      ? "Hand over to business-as-usual owners."
      : current
        ? `Move ${current.name} to its next milestone.`
        : undefined;

  const blocker = initiative.status === "at-risk" || initiative.status === "off-track"
    ? "Timeline slipping; awaiting decision from stakeholders."
    : undefined;

  return [
    {
      id: `${initiative.slug}-history-1`,
      authorId: initiative.ownerIds[0],
      initiativeSlug: initiative.slug,
      date: "September 1, 2026",
      when: "1 week ago",
      achievement,
      next,
      blocker,
      metric: `Overall Progress: ${before}% → ${initiative.progress}%`,
    },
  ];
}
