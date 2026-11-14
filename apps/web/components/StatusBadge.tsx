import { StatusDot, type Tone } from "./Signal";

/** A status word with a small dot before it. Colour only signals; the word stays ink and carries the meaning. */
export function StatusBadge({ tone, children }: { tone: Tone | "neutral"; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-body text-ink">
      <StatusDot tone={tone} />
      {children}
    </span>
  );
}
