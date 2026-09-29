type DonutProps = {
  /** 0–100 */
  value: number;
  size?: number;
  stroke?: number;
  label: string;
};

/** Single-value progress ring with the percentage in the middle. */
export function Donut({ value, size = 144, stroke = 14, label }: DonutProps) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="relative" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${clamped}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-track" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className="stroke-brand"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[1.75rem] leading-9 font-black text-ink">
        {clamped}%
      </span>
    </div>
  );
}
