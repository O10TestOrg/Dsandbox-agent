export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-card border border-line bg-raised shadow-glass backdrop-blur-[var(--blur-glass)] ${className}`}
    >
      {children}
    </div>
  );
}
