import type { CSSProperties } from "react";
import type { StatDecoration as Kind } from "@/lib/data";

/**
 * Bottom-right wave artwork on the dashboard stat cards. Place inside a
 * `relative overflow-hidden` card; it sits behind the card content.
 */
export function StatDecoration({ kind }: { kind: Kind }) {
  switch (kind) {
    case "waves-sky":
      // Figma export cropped to the card's inner box (265.5 × 154).
      return <Artwork src="/decor/stat-active.png" width={265.5} height={154} />;
    case "waves-mint":
      return <Artwork src="/decor/stat-value.png" width={141.5} height={52} />;
    case "waves-amber":
      return <AmberWaves />;
  }
}

function Artwork({ src, width, height }: { src: string; width: number; height: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static decorative raster, fixed size
    <img
      src={src}
      alt=""
      aria-hidden
      width={width}
      height={height}
      className="pointer-events-none absolute right-0 bottom-0 -z-10 max-w-none"
    />
  );
}

// Figma's “Initiatives At Risk” artwork: six translucent wave layers, each
// clipped by a luminance mask, rotated −5.59° as a group.
const MASK_A = { url: "/decor/risk/mask-a.svg", size: "259.685px 215.918px" };
const MASK_B = { url: "/decor/risk/mask-b.svg", size: "264.36px 263.655px" };

const LAYERS: { src: string; inset: string; mask: typeof MASK_A; position: string; faded?: boolean }[] = [
  { src: "/decor/risk/layer-1.svg", inset: "-13.53% 0 28.46% 0", mask: MASK_A, position: "-2.49px -25.424px" },
  { src: "/decor/risk/layer-2.svg", inset: "0.78% 0 39.09% 0", mask: MASK_A, position: "-4.32px -44.111px" },
  { src: "/decor/risk/layer-3.svg", inset: "22.65% 0 36.94% 0", mask: MASK_A, position: "-7.108px -72.677px" },
  { src: "/decor/risk/layer-4.svg", inset: "2.44% 0 -8.63% 0", mask: MASK_B, position: "-6.822px -69.649px", faded: true },
  { src: "/decor/risk/layer-5.svg", inset: "15.72% 0 9.23% 0", mask: MASK_B, position: "-8.51px -86.991px", faded: true },
  { src: "/decor/risk/layer-6.svg", inset: "13.04% 0 36.54% 0", mask: MASK_B, position: "-8.168px -83.495px", faded: true },
];

function AmberWaves() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -z-10 flex items-center justify-center"
      style={{ left: 92.5, top: 90, width: 253.638, height: 154.178 }}
    >
      <div className="rotate-[-5.59deg]">
        <div className="relative overflow-hidden" style={{ width: 242, height: 131.214 }}>
          {LAYERS.map((layer) => {
            const style: CSSProperties = {
              inset: layer.inset,
              maskImage: `url(${layer.mask.url})`,
              WebkitMaskImage: `url(${layer.mask.url})`,
              maskMode: "luminance",
              maskComposite: "intersect",
              maskClip: "no-clip",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: layer.position,
              WebkitMaskPosition: layer.position,
              maskSize: layer.mask.size,
              WebkitMaskSize: layer.mask.size,
              opacity: layer.faded ? 0.7 : undefined,
            };
            return (
              <div key={layer.src} className="absolute" style={style}>
                {/* eslint-disable-next-line @next/next/no-img-element -- masked vector layer */}
                <img src={layer.src} alt="" className="absolute inset-0 size-full max-w-none" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
