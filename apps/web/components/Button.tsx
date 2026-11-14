import Link from "next/link";

type Variant = "primary" | "ghost" | "text";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:opacity-90",
  ghost: "border border-line text-ink hover:bg-raised",
  text: "text-muted hover:text-ink",
};

/** Class strings for native <button>s that match <Button>. Shared so every screen looks the same. */
export const PRIMARY_BUTTON =
  "inline-flex min-h-10 items-center justify-center rounded-control bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90";
export const GHOST_BUTTON =
  "inline-flex min-h-10 items-center justify-center rounded-control border border-line px-3 py-2 text-sm transition hover:bg-raised";

export function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-control px-5 py-3 text-sm font-medium transition ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}
