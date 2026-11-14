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

/** Placeholder rows shaped like a <Table>: a hairline under each row, one bar per column. */
export function TableSkeleton({ columns, rows = 3 }: { columns: number; rows?: number }) {
  return (
    <div className="border-t border-line">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="grid grid-cols-2 gap-3 border-b border-line py-4 sm:flex sm:gap-6 sm:px-3">
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton key={c} className={`h-4 ${c === 0 ? "col-span-2 sm:flex-[2]" : "sm:flex-1"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
