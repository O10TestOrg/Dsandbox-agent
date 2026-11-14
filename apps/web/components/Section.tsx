/** Vertical rhythm comes from the section-space token, not from lines. */
export function Section({
  children,
  className = "",
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={`py-section ${className}`}>
      {children}
    </section>
  );
}
