import NextLink from "next/link";

type Variant = "inline" | "nav";

const looks: Record<Variant, string> = {
  // Inline links are underlined and fade on hover.
  inline: "underline underline-offset-4 decoration-1 transition-opacity hover:opacity-60",
  // Nav and footer links: no underline until hover or the current page.
  nav: "inline-flex min-h-12 items-center underline-offset-8 decoration-1 transition-colors hover:underline aria-[current=page]:underline",
};

export function Link({
  href,
  children,
  variant = "inline",
  current = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  /** Marks the current page (aria-current and underline). */
  current?: boolean;
  className?: string;
}) {
  return (
    <NextLink href={href} aria-current={current ? "page" : undefined} className={`${looks[variant]} ${className}`}>
      {children}
    </NextLink>
  );
}
