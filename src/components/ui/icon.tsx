import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type IconProps = {
  src: string;
  /** Square size in px, or use width/height for non-square assets */
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

/** Renders a Figma-exported SVG as-is (colours baked into the asset). */
export function Icon({ src, size = 16, width, height, className, alt = "" }: IconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? size}
      height={height ?? size}
      unoptimized
      className={cn("shrink-0", className)}
    />
  );
}

/**
 * Renders an SVG as a mask filled with `currentColor`, so a single asset can
 * take on different colours per state (e.g. active vs idle nav items).
 */
export function MaskIcon({ src, size = 16, width, height, className }: IconProps) {
  const style: CSSProperties = {
    width: width ?? size,
    height: height ?? size,
    maskImage: `url(${src})`,
    WebkitMaskImage: `url(${src})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };
  return <span aria-hidden className={cn("inline-block shrink-0 bg-current", className)} style={style} />;
}
