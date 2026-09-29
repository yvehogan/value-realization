"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Select, TextArea, TextInput } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { OBJECTIVES, VALUE_CATEGORIES, type Initiative } from "@/lib/data";
import { INITIATIVE_STATUSES, STATUS_STYLES } from "@/lib/status";

type Props = {
  open: boolean;
  onClose: () => void;
  /** When omitted (global “Add Update”), the user picks the initiative. */
  initiative?: Initiative;
  initiatives?: Initiative[];
};

export function AddUpdateModal({ open, onClose, initiative, initiatives = [] }: Props) {
  const [selectedSlug, setSelectedSlug] = useState(initiative?.slug ?? "");
  const current = initiative ?? initiatives.find((i) => i.slug === selectedSlug);

  const linked = current?.objectives ? OBJECTIVES.filter((o) => o.id in current.objectives!) : OBJECTIVES;
  const [objectiveId, setObjectiveId] = useState(linked[0]?.id ?? "");
  const objective = linked.find((o) => o.id === objectiveId) ?? linked[0];

  const [progress, setProgress] = useState(initiative?.progress ?? 50);
  const [milestones, setMilestones] = useState<{ name: string; date: string }[]>([]);
  const [milestoneName, setMilestoneName] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  function addMilestone() {
    if (!milestoneName.trim()) return;
    setMilestones((m) => [...m, { name: milestoneName.trim(), date: milestoneDate }]);
    setMilestoneName("");
    setMilestoneDate("");
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    // No backend yet — the update is not persisted.
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Initiative"
      description="Share progress in under two minutes"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-update">
            Publish Update
          </Button>
        </>
      }
    >
      <form id="add-update" onSubmit={submit} className="flex flex-col gap-4">
        {!initiative && (
          <Field label="Initiative" htmlFor="au-initiative">
            <Select
              id="au-initiative"
              required
              value={selectedSlug}
              onChange={(e) => {
                setSelectedSlug(e.target.value);
                setObjectiveId("");
              }}
            >
              <option value="" disabled>
                Select initiative…
              </option>
              {initiatives.map((i) => (
                <option key={i.slug} value={i.slug}>
                  {i.name}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <Field label="Project Status" htmlFor="au-status">
          <Select id="au-status" name="status" defaultValue={current?.status ?? "on-track"}>
            {INITIATIVE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_STYLES[s].label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Linked Strategic Objective"
          htmlFor="au-objective"
          hint="Every update must tie to an objective this initiative contributes to."
        >
          <Select id="au-objective" name="objective" value={objective?.id ?? ""} onChange={(e) => setObjectiveId(e.target.value)}>
            {linked.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Overall Progress" htmlFor="au-progress">
          <div className="flex items-center gap-3">
            <input
              id="au-progress"
              name="progress"
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="h-1.5 flex-1 accent-brand"
            />
            <span className="w-12 text-right text-heading font-black text-ink tabular-nums">{progress}%</span>
          </div>
        </Field>

        <Field label="What did you achieve?" htmlFor="au-achievement">
          <TextArea id="au-achievement" name="achievement" rows={2} required placeholder="Key achievement since last update" />
        </Field>
        <Field label="What are you working on next?" htmlFor="au-next">
          <TextArea id="au-next" name="next" rows={2} placeholder="Next step" />
        </Field>
        <Field label="Are there any blockers?" htmlFor="au-blocker">
          <TextInput id="au-blocker" name="blocker" placeholder="Optional" />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Metric" htmlFor="au-metric">
            <TextInput id="au-metric" name="metric" placeholder="e.g. Active Users" />
          </Field>
          <Field label="New value" htmlFor="au-metric-value">
            <TextInput id="au-metric-value" name="metricValue" placeholder="e.g. 710" />
          </Field>
          <Field label={`Value Realized (${objective?.name ?? "Objective"})`} htmlFor="au-value" className="justify-end">
            <TextInput id="au-value" name="value" placeholder="e.g. ₦4.5M" />
          </Field>
          <Field label="Value Type" htmlFor="au-value-type" className="justify-end">
            <Select id="au-value-type" name="valueType" defaultValue="Revenue">
              {VALUE_CATEGORIES.map((c) => (
                <option key={c.label}>{c.label}</option>
              ))}
            </Select>
          </Field>
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-body font-medium text-ink">Add Milestone</legend>
          <div className="mt-1.5 flex gap-2">
            <TextInput
              aria-label="Milestone name"
              placeholder="Milestone name"
              value={milestoneName}
              onChange={(e) => setMilestoneName(e.target.value)}
              className="flex-1"
            />
            <TextInput
              aria-label="Milestone date"
              type="date"
              value={milestoneDate}
              onChange={(e) => setMilestoneDate(e.target.value)}
              className="w-[150px]"
            />
            <Button variant="secondary" onClick={addMilestone}>
              Add
            </Button>
          </div>
          {milestones.length > 0 && (
            <ul className="flex flex-col gap-1 pt-1 text-meta text-ink-soft">
              {milestones.map((m, i) => (
                <li key={i}>
                  • {m.name}
                  {m.date && <span className="text-muted"> — {m.date}</span>}
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <label className="flex h-[46px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-line text-body font-medium text-ink-soft hover:border-brand hover:text-brand">
          {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} attached` : "Attach evidence"}
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.target.files ?? [], (f) => f.name))}
          />
        </label>
      </form>
    </Modal>
  );
}
