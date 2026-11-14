type Size = "page" | "prose";

const width: Record<Size, string> = { page: "max-w-page", prose: "max-w-reading" };

/** The shared left edge. `page` for wide layouts, `prose` (~40rem) for reading. */
export function Container({
  children,
  size = "page",
  className = "",
}: {
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  return <div className={`mx-auto w-full px-gutter ${width[size]} ${className}`}>{children}</div>;
}
