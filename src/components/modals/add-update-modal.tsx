"use client";

import { useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MenuSelect, type MenuOption } from "@/components/ui/dropdown";
import { MaskIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { API_STATUS, PROJECT_STATUSES, type ProjectSummary } from "@/lib/api/adapters";
import { errorMessage } from "@/lib/api/client";
import { useCreateProjectUpdate, useObjectives, useProject } from "@/lib/api/queries";
import type { ProjectStatus, UpdateType } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { STATUS_STYLES } from "@/lib/status";

const UPDATE_TYPES: { value: UpdateType; label: string }[] = [
  { value: "ProgressUpdate", label: "Progress Update" },
  { value: "Milestone", label: "Milestone" },
  { value: "ValueMetric", label: "Value Metric" },
];

const STATUS_OPTIONS: MenuOption<ProjectStatus>[] = PROJECT_STATUSES.map((s) => ({ value: s, label: STATUS_STYLES[API_STATUS[s]].label }));

const STATUS_FROM_UI = Object.fromEntries(Object.entries(API_STATUS).map(([api, ui]) => [ui, api])) as Record<string, ProjectStatus>;

// Figma: 40px fields, 12px radius, placeholder at 30% ink.
const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-3 text-body text-ink outline-none placeholder:text-ink/30 focus:border-brand";

type Props = {
  open: boolean;
  onClose: () => void;
  /** When omitted (global “Add Update”), the user picks one of `projects`. */
  project?: ProjectSummary;
  projects?: ProjectSummary[];
};

/** “Update Project” dialog. The fields shown depend on the selected update type. */
export function AddUpdateModal({ open, onClose, project, projects = [] }: Props) {
  const [updateType, setUpdateType] = useState<UpdateType>("ProgressUpdate");
  const [selectedId, setSelectedId] = useState(project?.id ?? projects[0]?.id ?? "");
  const current = project ?? projects.find((p) => p.id === selectedId);

  const [status, setStatus] = useState<ProjectStatus>(STATUS_FROM_UI[current?.status ?? "on-track"] ?? "OnTrack");
  const [progress, setProgress] = useState(current?.progress ?? 0);
  const [evidence, setEvidence] = useState<File | undefined>();

  const objectives = useObjectives();
  // Objectives this project already reports against come first in the picker.
  const detail = useProject(current?.id ?? "");
  const objectiveOptions = useMemo(() => {
    const linked = new Set((detail.data ? [...detail.data.value, ...detail.data.updates] : []).map((u) => u.objectiveId));
    return [...(objectives.data ?? [])]
      .sort((a, b) => Number(linked.has(b.id)) - Number(linked.has(a.id)))
      .map((o): MenuOption<string> => ({ value: o.id, label: o.name ?? "Untitled objective" }));
  }, [objectives.data, detail.data]);
  const [objectiveChoice, setObjectiveChoice] = useState<string>();
  const objectiveId = objectiveChoice ?? objectiveOptions[0]?.value ?? "";

  const create = useCreateProjectUpdate(current?.id ?? "");

  function selectProject(id: string) {
    const next = projects.find((p) => p.id === id);
    setSelectedId(id);
    if (!next) return;
    setStatus(STATUS_FROM_UI[next.status] ?? "OnTrack");
    setProgress(next.progress);
    setObjectiveChoice(undefined);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!current) return;
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim() || undefined;

    create.mutate(
      updateType === "ProgressUpdate"
        ? {
            updateType,
            projectStatus: status,
            progressPercentage: progress,
            achievement: text("achievement"),
            nextStep: text("next"),
            blocker: text("blocker"),
            evidence,
          }
        : updateType === "Milestone"
          ? { updateType, milestoneName: text("milestone"), milestoneDate: text("milestoneDate") }
          : { updateType, metric: text("metric"), objectiveId },
      { onSuccess: onClose },
    );
  }

  const noObjectives = updateType === "ValueMetric" && objectives.isSuccess && objectiveOptions.length === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Update Project"
      description="Share progress in under two minutes"
      footer={
        <>
          <Button variant="outline" radius="rounded-xl" onClick={onClose} className="h-[38px]">
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-update"
            size="wide"
            radius="rounded-xl"
            className="h-[38px]"
            disabled={!current || create.isPending || noObjectives}
          >
            {create.isPending && <Spinner size={14} />}
            {create.isPending ? "Publishing…" : "Publish Update"}
          </Button>
        </>
      }
    >
      <form id="add-update" onSubmit={submit} className="flex flex-col">
        {!project && (
          <FieldGroup label="Project" labelId="au-project-label" gap="loose" className="pb-[30px]">
            <MenuSelect
              value={selectedId}
              onChange={selectProject}
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              labelledBy="au-project-label"
              variant="field"
            />
          </FieldGroup>
        )}

        <fieldset className="flex flex-col gap-2.5">
          <legend className="pb-2.5 text-body font-bold text-ink">Update Type</legend>
          {UPDATE_TYPES.map((t) => (
            <Radio
              key={t.value}
              name="type"
              value={t.value}
              checked={updateType === t.value}
              onChange={() => setUpdateType(t.value)}
              label={t.label}
            />
          ))}
        </fieldset>

        <hr className="mt-5 mb-[19px] border-line" />

        {updateType === "ProgressUpdate" && (
          <div className="flex flex-col gap-[30px]">
            <FieldGroup label="Project Status" labelId="au-status-label" gap="loose">
              <MenuSelect value={status} onChange={setStatus} options={STATUS_OPTIONS} labelledBy="au-status-label" variant="field" />
            </FieldGroup>

            <FieldGroup label="Overall Progress" htmlFor="au-progress" gap="loose">
              <ProgressSlider id="au-progress" name="progress" value={progress} onChange={setProgress} />
            </FieldGroup>

            <FieldGroup label="What did you achieve?" htmlFor="au-achievement">
              <textarea
                id="au-achievement"
                name="achievement"
                required
                placeholder="Key achievement since last update"
                className={cn(fieldClass, "h-[72px] resize-none py-2")}
              />
            </FieldGroup>

            <FieldGroup label="What are you working on next?" htmlFor="au-next">
              <textarea id="au-next" name="next" required placeholder="Next step" className={cn(fieldClass, "h-[72px] resize-none py-2")} />
            </FieldGroup>

            <FieldGroup label="Are there any blockers?" htmlFor="au-blocker" optional>
              <input id="au-blocker" name="blocker" placeholder="Share blocker" className={cn(fieldClass, "h-10")} />
            </FieldGroup>

            <FieldGroup label="Attach Evidence" labelId="au-evidence-label" optional>
              <EvidencePicker labelledBy="au-evidence-label" file={evidence} onChange={setEvidence} />
            </FieldGroup>
          </div>
        )}

        {updateType === "Milestone" && (
          <div className="flex flex-col gap-[30px]">
            <FieldGroup label="Add Milestone" htmlFor="au-milestone">
              <input id="au-milestone" name="milestone" required placeholder="Milestone Name" className={cn(fieldClass, "h-10")} />
            </FieldGroup>
            <FieldGroup label="Date Achieved" htmlFor="au-milestone-date" gap="loose">
              <DateInput id="au-milestone-date" name="milestoneDate" />
            </FieldGroup>
          </div>
        )}

        {updateType === "ValueMetric" && (
          <div className="flex flex-col gap-[30px]">
            <FieldGroup label="Metric" htmlFor="au-metric">
              <input id="au-metric" name="metric" required placeholder="e.g Active Users" className={cn(fieldClass, "h-10")} />
            </FieldGroup>
            <FieldGroup label="Linked Strategic Objective" labelId="au-objective-label" gap="loose">
              {noObjectives ? (
                <p className="text-body text-muted">
                  No strategic objectives yet. An admin can add them on the Value Realization page.
                </p>
              ) : (
                <MenuSelect
                  value={objectiveId}
                  onChange={setObjectiveChoice}
                  options={objectiveOptions}
                  labelledBy="au-objective-label"
                  placement="top"
                  variant="field"
                />
              )}
            </FieldGroup>
          </div>
        )}

        {create.isError && (
          <p role="alert" className="pt-5 text-body text-danger">
            {errorMessage(create.error)}
          </p>
        )}
      </form>
    </Modal>
  );
}

type FieldGroupProps = {
  label: string;
  /** For native controls */
  htmlFor?: string;
  /** For custom controls labelled via aria-labelledby */
  labelId?: string;
  optional?: boolean;
  /** Figma: text inputs sit 5px under the label, dropdown-style controls 10px */
  gap?: "tight" | "loose";
  className?: string;
  children: ReactNode;
};

function FieldGroup({ label, htmlFor, labelId, optional, gap = "tight", className, children }: FieldGroupProps) {
  const text = (
    <>
      {label}
      {optional && <span className="pl-[5px] text-tag font-normal text-venture">Optional</span>}
    </>
  );
  return (
    <div className={cn("flex flex-col", gap === "tight" ? "gap-[5px]" : "gap-2.5", className)}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-body font-bold text-ink">
          {text}
        </label>
      ) : (
        <p id={labelId} className="text-body font-bold text-ink">
          {text}
        </p>
      )}
      {children}
    </div>
  );
}

type RadioProps = { name: string; value: string; checked: boolean; onChange: () => void; label: string };

/** 20px radio: muted ring, or a filled brand disc with a white tick when selected. */
function Radio({ name, value, checked, onChange, label }: RadioProps) {
  return (
    <label className="flex h-6 cursor-pointer items-center gap-2 text-body text-ink">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
          checked ? "bg-brand" : "border border-muted",
        )}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4.2L3.6 6.6L9 1.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

type SliderProps = { id: string; name: string; value: number; onChange: (value: number) => void };

/** 6px track with a 12px thumb; a transparent native range input on top handles input and accessibility. */
function ProgressSlider({ id, name, value, onChange }: SliderProps) {
  return (
    <div className="-mt-px mb-1 flex h-3 items-center gap-2.5">
      <div className="relative h-full flex-1">
        <div className="absolute inset-x-0 top-[3px] h-1.5 rounded-full bg-rail" />
        <div className="absolute top-[3px] left-0 h-1.5 rounded-full bg-brand" style={{ width: `${value}%` }} />
        <div
          className="absolute top-0 size-3 -translate-x-1/2 rounded-full bg-brand"
          style={{ left: `${value}%` }}
        />
        <input
          id={id}
          name={name}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute -inset-y-2 inset-x-0 w-full cursor-pointer opacity-0"
        />
      </div>
      <output htmlFor={id} className="text-base leading-none font-bold text-ink tabular-nums">
        {value}%
      </output>
    </div>
  );
}

/** Native date picker behind a styled “Select date” field. */
function DateInput({ id, name }: { id: string; name: string }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const display = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Select date";

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        name={name}
        type="date"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClick={() => ref.current?.showPicker?.()}
        className="peer absolute inset-0 size-full cursor-pointer opacity-0"
      />
      <div
        aria-hidden
        className="pointer-events-none flex h-10 items-center justify-between rounded-xl border border-line bg-surface pr-2.5 pl-3 text-body text-ink peer-focus-visible:border-brand"
      >
        {display}
        <MaskIcon src="/icons/calendar.svg" size={22} className="text-ink" />
      </div>
    </div>
  );
}

/** Dashed drop zone that opens the file picker. The API takes one image (jpg, png or webp). */
function EvidencePicker({ labelledBy, file, onChange }: { labelledBy: string; file?: File; onChange: (file?: File) => void }) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="relative flex h-[46px] cursor-pointer items-center justify-center gap-2 rounded-xl px-3 text-body text-muted hover:text-brand"
    >
      {/* SVG border: Figma's 2px dash / 1px gap can't be drawn with CSS `dashed`. */}
      <svg aria-hidden className="absolute inset-0 size-full overflow-visible">
        <rect
          x="0.5"
          y="0.5"
          rx="11.5"
          className="h-[calc(100%-1px)] w-[calc(100%-1px)] fill-none stroke-line"
          strokeDasharray="2 1"
        />
      </svg>
      <MaskIcon src="/icons/paperclip.svg" size={16} />
      <span className="truncate">{file ? file.name : "Attach evidence (image)"}</span>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-labelledby={labelledBy}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0])}
      />
    </label>
  );
}
