"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { errorMessage } from "@/lib/api/client";
import { useCreateObjective } from "@/lib/api/queries";

const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-3 text-body text-ink outline-none placeholder:text-ink/30 focus:border-brand";

/** Creates a strategic objective that updates and value metrics can link to. */
export function NewObjectiveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateObjective();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    create.mutate(
      { name: String(form.get("name")).trim(), description: String(form.get("description") ?? "").trim() || undefined },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Objective"
      description="A strategic goal initiatives report value against"
      footer={
        <>
          <Button variant="outline" radius="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="new-objective" size="wide" disabled={create.isPending}>
            {create.isPending && <Spinner size={14} />}
            {create.isPending ? "Creating…" : "Create Objective"}
          </Button>
        </>
      }
    >
      <form id="new-objective" onSubmit={submit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="no-name" className="text-body font-bold text-ink">
            Name
          </label>
          <input id="no-name" name="name" required placeholder="e.g. Acquire New Customers" className={`${fieldClass} h-10`} />
        </div>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="no-description" className="text-body font-bold text-ink">
            Description
          </label>
          <textarea
            id="no-description"
            name="description"
            placeholder="What does success look like?"
            className={`${fieldClass} h-[72px] resize-none py-2`}
          />
        </div>
        {create.isError && (
          <p role="alert" className="text-body text-danger">
            {errorMessage(create.error)}
          </p>
        )}
      </form>
    </Modal>
  );
}
