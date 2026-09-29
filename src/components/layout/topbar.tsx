import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type TopbarProps = {
  /** Omit to hide “New Projects” (members can't create projects) */
  onNewProject?: () => void;
};

export function Topbar({ onNewProject }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 flex h-topbar items-center justify-between gap-4 border-b border-line px-8 backdrop-blur-md">
      <label className="flex h-[38px] w-80 items-center gap-2.5 rounded-xl border border-line bg-surface pr-3 pl-2.5 focus-within:border-brand">
        <Icon src="/icons/search.svg" size={16} />
        <span className="sr-only">Search</span>
        <input
          type="search"
          placeholder="Search initiatives, people, objectives…"
          className="w-full bg-transparent text-meta text-ink outline-none placeholder:text-subtle"
        />
      </label>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="tight" radius="rounded-button">
          This Year
          <Icon src="/icons/chevron-down.svg" size={15} />
        </Button>
        <Button variant="icon" aria-label="Notifications" className="relative">
          <Icon src="/icons/bell.svg" size={17} />
          <span className="absolute top-2 left-5 size-1.5 rounded-full bg-danger" />
        </Button>
        {onNewProject && (
          <Button size="sm" radius="rounded-button" onClick={onNewProject}>
            <Icon src="/icons/plus.svg" size={16} />
            New Projects
          </Button>
        )}
      </div>
    </header>
  );
}
