"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice";
import { MenuSelect, PeopleSelect, type MenuOption } from "@/components/ui/dropdown";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { ASSIGNABLE_PEOPLE } from "@/lib/data";
import { TYPE_STYLES, WORKSTREAMS_ORDER, WORKSTREAM_META, type Workstream } from "@/lib/initiative-types";
import type { Status } from "@/lib/status";

type StartStatus = Extract<Status, "not-started" | "on-track" | "at-risk">;
type Priority = "high" | "medium" | "low";

const STATUS_OPTIONS: MenuOption<StartStatus>[] = [
  { value: "not-started", label: "Not Started", icon: "/icons/status-not-started.svg" },
  { value: "on-track", label: "On Track", icon: "/icons/status-on-track.svg" },
  { value: "at-risk", label: "At Risk", icon: "/icons/status-at-risk.svg" },
];

const PRIORITY_OPTIONS: MenuOption<Priority>[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

// Figma: 40px fields, 12px radius, placeholder at 30% ink.
const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-3 text-body text-ink outline-none placeholder:text-ink/30 focus:border-brand";

type Props = { open: boolean; onClose: () => void };

/** Two-step “New Initiative” flow: pick a workstream, then fill in details. */
export function NewInitiativeModal({ open, onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "details">("type");
  const [type, setType] = useState<Workstream | null>(null);
  const [name, setName] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [status, setStatus] = useState<StartStatus>("not-started");
  const [priority, setPriority] = useState<Priority>("high");

  function close() {
    onClose();
    // Reset after the close so the dialog doesn't flash back to step 1.
    setTimeout(() => {
      setStep("type");
      setType(null);
      setName("");
      setPeople([]);
      setStatus("not-started");
      setPriority("high");
    }, 150);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    // No backend yet — the new initiative is not persisted.
    close();
    router.push("/initiatives");
  }

  if (step === "type" || !type) {
    return (
      <Modal open={open} onClose={close} title="New Initiative" description="What are you creating?">
        <div className="grid grid-cols-2 gap-3">
          {WORKSTREAMS_ORDER.map((t) => (
            <ChoiceCard
              key={t}
              selected={type === t}
              onClick={() => setType(t)}
              className="flex h-[110px] flex-col justify-center p-4"
            >
              <Icon src={WORKSTREAM_META[t].icon} size={18} />
              <span className="block pt-2 text-base leading-6 font-semibold text-ink">{TYPE_STYLES[t].label}</span>
              <span className="block text-meta text-muted">{WORKSTREAM_META[t].pickerDescription}</span>
            </ChoiceCard>
          ))}
        </div>
        <div className="flex justify-end pt-5">
          <Button size="wide" disabled={!type} onClick={() => setStep("details")} className="h-9">
            Continue
          </Button>
        </div>
      </Modal>
    );
  }

  const label = TYPE_STYLES[type].label;
  return (
    <Modal
      open={open}
      onClose={close}
      title={`New ${label}`}
      description="Fill in the initiative details"
      icon={<Icon src={WORKSTREAM_META[type].icon} size={18} />}
      footer={
        <>
          <Button variant="outline" radius="rounded-xl" onClick={() => setStep("type")}>
            Back
          </Button>
          <Button type="submit" form="new-initiative" size="wide" disabled={!name.trim() || people.length === 0}>
            Create Initiative
          </Button>
        </>
      }
    >
      <form id="new-initiative" onSubmit={submit} className="flex flex-col gap-[30px]">
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="ni-name" className="text-body font-bold text-ink">
            Name
          </label>
          <input
            id="ni-name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. New ${label}`}
            className={`${fieldClass} h-10`}
          />
        </div>

        <div className="flex flex-col gap-[5px]">
          <label htmlFor="ni-desc" className="text-body font-bold text-ink">
            Description
          </label>
          <textarea
            id="ni-desc"
            name="description"
            placeholder="What is this initiative about?"
            className={`${fieldClass} h-[72px] resize-none py-2`}
          />
        </div>

        <div className="flex gap-2.5">
          <div className="flex flex-1 flex-col gap-[5px]">
            <label htmlFor="ni-start" className="text-body font-bold text-ink">
              Start Date
            </label>
            <input id="ni-start" name="start" type="date" className={`${fieldClass} h-10`} />
          </div>
          <div className="flex flex-1 flex-col gap-[5px]">
            <label htmlFor="ni-target" className="text-body font-bold text-ink">
              Target Date
            </label>
            <input id="ni-target" name="target" type="date" className={`${fieldClass} h-10`} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div>
            <p id="ni-people-label" className="text-body font-bold text-ink">
              Responsible Person(s)
            </p>
            <p id="ni-people-hint" className="text-meta text-muted">
              Select one or more people responsible for this {label.toLowerCase()}.
            </p>
          </div>
          <PeopleSelect
            people={ASSIGNABLE_PEOPLE}
            value={people}
            onChange={setPeople}
            labelledBy="ni-people-label"
            describedBy="ni-people-hint"
          />
        </div>

        <div className="flex gap-2.5">
          <div className="flex flex-1 flex-col gap-[5px]">
            <p id="ni-status-label" className="text-body font-medium text-ink">
              Status
            </p>
            <MenuSelect
              name="status"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              labelledBy="ni-status-label"
              placement="top"
              className="w-[200px] max-w-full"
            />
          </div>
          <div className="flex flex-1 flex-col gap-[5px]">
            <p id="ni-priority-label" className="text-body font-medium text-ink">
              Priority
            </p>
            <MenuSelect
              name="priority"
              value={priority}
              onChange={setPriority}
              options={PRIORITY_OPTIONS}
              labelledBy="ni-priority-label"
              placement="top"
              className="w-[200px] max-w-full"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
