"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./icon";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Optional glyph shown before the title */
  icon?: ReactNode;
  children: ReactNode;
  /** Buttons rendered in the bordered footer */
  footer?: ReactNode;
};

/** Centered 512px dialog built on native <dialog> (focus trap + Esc for free). */
export function Modal({ open, onClose, title, description, icon, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="modal-title"
      className="m-auto max-h-[calc(100vh-4rem)] w-[512px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-scrim backdrop:backdrop-blur-[6px] open:flex open:flex-col"
    >
      <header className="flex items-start justify-between border-b border-line px-6 py-4">
        <div>
          <h2 id="modal-title" className="flex items-center gap-2.5 text-heading font-black">
            {icon}
            {title}
          </h2>
          {description && <p className="pt-0.5 text-body text-muted">{description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex rounded-full bg-muted/5 p-1.5 transition-colors hover:bg-muted/10"
        >
          <Icon src="/icons/close.svg" size={18} />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
      {footer && <footer className="flex justify-end gap-2 border-t border-line px-6 py-4">{footer}</footer>}
    </dialog>
  );
}
