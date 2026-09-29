"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

/** Shared open/close behaviour: outside click and Esc close the panel (Esc won't close a parent dialog). */
function useDisclosure() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }
  }

  return { open, setOpen, ref, onKeyDown };
}

function Trigger({
  open,
  onClick,
  listId,
  children,
  className,
  labelledBy,
}: {
  open: boolean;
  onClick: () => void;
  listId: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={listId}
      aria-labelledby={labelledBy}
      className={cn(
        "flex h-10 items-center justify-between gap-2 rounded-xl border border-line bg-surface text-left text-body text-ink outline-none focus-visible:border-brand",
        className,
      )}
    >
      <span className="truncate">{children}</span>
      <span className="flex h-[35px] w-5 shrink-0 items-center justify-center">
        <Icon src="/icons/dropdown-chevron.svg" width={10} height={6} className={cn("transition-transform", open && "rotate-180")} />
      </span>
    </button>
  );
}

export type MenuOption<T extends string> = { value: T; label: string; icon?: string };

type MenuSelectProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: MenuOption<T>[];
  /** id of the visible label element */
  labelledBy?: string;
  /** Hidden input name so the value submits with the form */
  name?: string;
  /** Open above the trigger (use near the bottom of a scroll area) */
  placement?: "bottom" | "top";
  className?: string;
};

/** Single-select dropdown (Figma: Status / Priority menus). */
export function MenuSelect<T extends string>({
  value,
  onChange,
  options,
  labelledBy,
  name,
  placement = "bottom",
  className,
}: MenuSelectProps<T>) {
  const { open, setOpen, ref, onKeyDown } = useDisclosure();
  const listId = useId();
  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)} onKeyDown={onKeyDown}>
      {name && <input type="hidden" name={name} value={value} />}
      <Trigger open={open} onClick={() => setOpen(!open)} listId={listId} labelledBy={labelledBy} className="w-full px-3">
        {current?.label}
      </Trigger>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          className={cn(
            "absolute left-0 z-20 flex w-[200px] flex-col gap-2.5 rounded-popover border border-line bg-surface p-2.5 shadow-card",
            placement === "top" ? "bottom-full mb-1" : "top-full mt-1",
          )}
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  autoFocus={selected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex h-10 w-full items-center gap-[5px] rounded-button px-2.5 text-body font-medium text-ink outline-none hover:bg-ink/5 focus-visible:bg-ink/5",
                    selected && "bg-ink/5",
                  )}
                >
                  {option.icon && <Icon src={option.icon} size={22} />}
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

type PersonOption = { id: string; name: string; role: string };

type PeopleSelectProps = {
  people: PersonOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  labelledBy?: string;
  describedBy?: string;
};

/** Multi-select with checkboxes (Figma: Responsible Person(s) panel). Opens inline, below the trigger. */
export function PeopleSelect({ people, value, onChange, labelledBy, describedBy }: PeopleSelectProps) {
  const { open, setOpen, ref, onKeyDown } = useDisclosure();
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) listRef.current?.scrollIntoView({ block: "nearest" });
  }, [open]);

  const selected = people.filter((p) => value.includes(p.id));
  const summary =
    selected.length === 0
      ? "Select Person(s)"
      : selected.length === 1
        ? selected[0].name
        : `${selected[0].name} +${selected.length - 1}`;

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }

  return (
    <div ref={ref} className="relative" onKeyDown={onKeyDown} aria-describedby={describedBy}>
      <Trigger open={open} onClick={() => setOpen(!open)} listId={listId} labelledBy={labelledBy} className="w-full px-2.5">
        {summary}
      </Trigger>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable
          aria-labelledby={labelledBy}
          ref={listRef}
          className="scrollbar-soft mt-2.5 flex max-h-[348px] w-full flex-col gap-2.5 overflow-y-auto rounded-popover border border-line bg-surface p-[15px]"
        >
          {people.map((person, i) => {
            const checked = value.includes(person.id);
            return (
              <li key={person.id} role="option" aria-selected={checked} className="flex flex-col gap-2.5">
                {i > 0 && <hr className="border-line" />}
                <button
                  type="button"
                  onClick={() => toggle(person.id)}
                  className="flex w-full items-center justify-between gap-3 text-left outline-none focus-visible:underline"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-body font-medium text-ink">{person.name}</span>
                    <span className="block truncate text-meta text-muted">{person.role}</span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[4px] border text-[10px] leading-none font-bold text-white",
                      checked ? "border-brand bg-brand" : "border-line",
                    )}
                  >
                    {checked && "✓"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
