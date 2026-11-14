import { Eyebrow, MetaText } from "./Text";

export type Stat = { label: string; value: React.ReactNode; caption?: React.ReactNode };

/** One figure: eyebrow label, display number, muted caption. */
export function StatCard({ label, value, caption }: Stat) {
  return (
    <div className="space-y-2">
      <Eyebrow>{label}</Eyebrow>
      <p className="text-display tabular-nums">{value}</p>
      {caption ? <MetaText className="block">{caption}</MetaText> : null}
    </div>
  );
}

/** A row of figures that stacks on small screens. Flat: separated by space and hairlines, not boxes. */
export function StatStrip({ stats, label }: { stats: Stat[]; label: string }) {
  return (
    <ul aria-label={label} className="grid divide-y divide-line border-y border-line sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0">
      {stats.map((s) => (
        <li key={s.label} className="py-5 sm:px-6 sm:first:pl-0">
          <StatCard {...s} />
        </li>
      ))}
    </ul>
  );
}
