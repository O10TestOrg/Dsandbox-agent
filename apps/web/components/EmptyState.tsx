import { Surface } from "./Surface";

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Surface className="p-8 text-center">
      <h2 className="text-lg">{title}</h2>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </Surface>
  );
}
