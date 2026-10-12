"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { errorMessage } from "@/lib/api/client";
import { useDeleteUser } from "@/lib/api/queries";

type Props = {
  open: boolean;
  onClose: () => void;
  /** API user id */
  id: string;
  name: string;
  /** Called after the API confirms the deletion (the dialog doesn't close itself). */
  onRemoved: () => void;
};

/** Confirms, then permanently deletes a user (API: delete-user). */
export function RemoveMemberModal({ open, onClose, id, name, onRemoved }: Props) {
  const remove = useDeleteUser();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Remove ${name}?`}
      description="They'll lose access to Nexus and must be added again to sign in."
      footer={
        <>
          <Button variant="outline" radius="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="wide" disabled={remove.isPending} onClick={() => remove.mutate(id, { onSuccess: onRemoved })}>
            {remove.isPending && <Spinner size={14} />}
            {remove.isPending ? "Removing…" : "Remove member"}
          </Button>
        </>
      }
    >
      <p className="text-body text-ink-soft">
        This permanently deletes {name}&apos;s account and profile, and removes them from their projects. This can&apos;t be
        undone.
      </p>
      {remove.isError && (
        <p role="alert" className="pt-3 text-body text-danger">
          {errorMessage(remove.error)}
        </p>
      )}
    </Modal>
  );
}
