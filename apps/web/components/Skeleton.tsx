/** A pulsing placeholder block for a screen whose saved data hasn't loaded yet. Size it with `className`. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-control bg-line motion-reduce:animate-none ${className}`}
    />
  );
}

/** Screen-level loading state: announces "Loading" once and shows the given placeholders. */
export function LoadingScreen({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-busy="true" className="space-y-4">
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}
