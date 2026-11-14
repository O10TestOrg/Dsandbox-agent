/** A flat group: square corners, a soft tint, nothing raised. `bordered` swaps the tint for a hairline. */
export function Surface({
  children,
  bordered = false,
  className = "",
}: {
  children: React.ReactNode;
  bordered?: boolean;
  className?: string;
}) {
  const look = bordered ? "border border-line bg-paper" : "bg-surface";
  return <div className={`rounded-square ${look} ${className}`}>{children}</div>;
}
