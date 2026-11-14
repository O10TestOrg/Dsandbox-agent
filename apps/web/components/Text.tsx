/** Small uppercase label above a title or for a group. */
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-caption uppercase tracking-eyebrow text-muted ${className}`}>{children}</p>;
}

/** Secondary info (dates, counts): muted, with tabular numerals. */
export function MetaText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-caption tabular-nums text-muted ${className}`}>{children}</span>;
}
