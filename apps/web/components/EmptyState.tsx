import { GlassCard } from "./GlassCard";

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </GlassCard>
  );
}
