import { Surface } from "./Surface";

/** One line of explanation and, at most, one clear action. Left-aligned. */
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Surface className="space-y-4 p-6 sm:p-8">
      <div className="space-y-1">
        <h2 className="text-body">{title}</h2>
        <p className="text-body text-muted">{children}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </Surface>
  );
}
