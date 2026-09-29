type Column = { label: string; value: number; detail?: string };

type ColumnChartProps = {
  data: Column[];
  /** Accessible chart name */
  label: string;
  height?: number;
};

const TICKS = [0, 25, 50, 75, 100];

/**
 * Single-series % column chart. One hue (brand), thin columns with 4px rounded
 * tops on a recessive grid, value labels above each column, hover tooltip.
 */
export function ColumnChart({ data, label, height = 200 }: ColumnChartProps) {
  return (
    <figure aria-label={label} className="flex flex-col">
      <div className="flex gap-2" style={{ height }}>
        {/* Y axis */}
        <div className="relative w-8 shrink-0 text-micro text-subtle" aria-hidden>
          {TICKS.map((t) => (
            <span key={t} className="absolute right-0 leading-3" style={{ bottom: `calc(${t}% - 6px)` }}>
              {t}%
            </span>
          ))}
        </div>
        {/* Plot */}
        <div className="relative flex-1">
          {TICKS.map((t) => (
            <span key={t} aria-hidden className="absolute inset-x-0 border-t border-line" style={{ bottom: `${t}%` }} />
          ))}
          <ul className="relative flex h-full items-end justify-around">
            {data.map((d) => (
              <li key={d.label} className="group relative flex h-full w-full flex-col items-center justify-end">
                <span className="pb-1 text-meta font-medium text-ink-soft">{d.value}%</span>
                <span
                  className="w-8 max-w-[60%] rounded-t-[4px] bg-brand transition-opacity group-hover:opacity-80"
                  style={{ height: `${d.value}%` }}
                />
                <span
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-meta whitespace-nowrap text-white opacity-0 shadow-card transition-opacity group-hover:opacity-100"
                >
                  <span className="font-bold">{d.label}</span> · {d.value}% of target
                  {d.detail && <span className="block text-white/70">{d.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* X labels */}
      <div className="flex gap-2 pt-2">
        <span className="w-8 shrink-0" />
        <div className="flex flex-1 justify-around">
          {data.map((d) => (
            <span key={d.label} className="w-full text-center text-micro text-muted">
              {d.label}
            </span>
          ))}
        </div>
      </div>
      {/* Table view for screen readers */}
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{d.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
