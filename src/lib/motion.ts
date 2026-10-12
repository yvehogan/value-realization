import type { CSSProperties } from "react";

/** Inline style for the `stagger` utility: item `i` starts 55ms after item `i - 1` (capped so long lists don't drag). */
export function staggerStyle(i: number): CSSProperties {
  return { "--i": Math.min(i, 8) } as CSSProperties;
}
