import Link from "next/link";
import { MaskIcon } from "./icon";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-body font-medium text-muted hover:text-ink">
      <MaskIcon src="/icons/arrow-right.svg" size={16} className="rotate-180" />
      {label}
    </Link>
  );
}
