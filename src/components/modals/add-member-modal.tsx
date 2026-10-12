"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MenuSelect, type MenuOption } from "@/components/ui/dropdown";
import { Spinner } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { TEAM_ROLE_LABELS } from "@/lib/api/adapters";
import { errorMessage } from "@/lib/api/client";
import { useProfileUser } from "@/lib/api/queries";
import type { AccessRole, TeamRole } from "@/lib/api/types";

const ROLE_OPTIONS = Object.entries(TEAM_ROLE_LABELS).map(([value, label]) => ({ value, label })) as MenuOption<TeamRole>[];
const ACCESS_OPTIONS: MenuOption<AccessRole>[] = [
  { value: "User", label: "Member — updates own initiatives" },
  { value: "Admin", label: "Admin — full access" },
];

// Same field styling as the New Initiative modal.
const fieldClass =
  "h-10 w-full rounded-xl border border-line bg-surface px-3 text-body text-ink outline-none placeholder:text-ink/30 focus:border-brand";

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label id={`${id}-label`} htmlFor={id} className="text-body font-bold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

/** Adds a staff member to Nexus (API: profile-user). */
export function AddMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [teamRole, setTeamRole] = useState<TeamRole>("ProductManager");
  const [access, setAccess] = useState<AccessRole>("User");
  const profile = useProfileUser();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    profile.mutate(
      {
        email: text("email"),
        fullName: text("fullName"),
        teamRole,
        department: text("department") || undefined,
        staffID: text("staffId") || undefined,
        role: access,
        isActive: true,
      },
      { onSuccess: onClose },
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Member"
      description="They’ll appear on the team list after their first sign-in"
      footer={
        <>
          <Button variant="outline" radius="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-member" size="wide" disabled={profile.isPending}>
            {profile.isPending && <Spinner size={14} />}
            {profile.isPending ? "Adding…" : "Add Member"}
          </Button>
        </>
      }
    >
      <form id="add-member" onSubmit={submit} className="flex flex-col gap-5">
        <Field id="am-name" label="Full Name">
          <input id="am-name" name="fullName" required placeholder="e.g. Ada Obi" className={fieldClass} />
        </Field>
        <Field id="am-email" label="Email Address">
          <input id="am-email" name="email" type="email" required placeholder="e.g. ada.obi@wemabank.com" className={fieldClass} />
        </Field>
        <div className="flex gap-2.5">
          <div className="flex-1">
            <Field id="am-department" label="Department">
              <input id="am-department" name="department" placeholder="e.g. Innovation" className={fieldClass} />
            </Field>
          </div>
          <div className="flex-1">
            <Field id="am-staff" label="Staff ID">
              <input id="am-staff" name="staffId" placeholder="Optional" className={fieldClass} />
            </Field>
          </div>
        </div>
        <div className="flex flex-col gap-[5px]">
          <p id="am-role-label" className="text-body font-bold text-ink">
            Team Role
          </p>
          <MenuSelect value={teamRole} onChange={setTeamRole} options={ROLE_OPTIONS} labelledBy="am-role-label" variant="field" />
        </div>
        <div className="flex flex-col gap-[5px]">
          <p id="am-access-label" className="text-body font-bold text-ink">
            Access
          </p>
          <MenuSelect
            value={access}
            onChange={setAccess}
            options={ACCESS_OPTIONS}
            labelledBy="am-access-label"
            placement="top"
            variant="field"
          />
        </div>
        {profile.isError && (
          <p role="alert" className="text-body text-danger">
            {errorMessage(profile.error)}
          </p>
        )}
      </form>
    </Modal>
  );
}
