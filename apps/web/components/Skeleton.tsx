/** A pulsing placeholder block (a slower, opacity-only pulse for reduced-motion users) for a screen whose saved data hasn't loaded yet. Size it with `className`. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-square bg-line motion-reduce:animate-[pulse_3s_ease-in-out_infinite] ${className}`}
    />
  );
}

/** Screen-level loading state: announces "Loading" once and shows the given placeholders. */
export function LoadingScreen({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}
