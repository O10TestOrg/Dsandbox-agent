import Link from "next/link";

type Variant = "primary" | "ghost" | "text";

const styles: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:opacity-90",
  ghost: "border border-line text-ink hover:bg-raised",
  text: "text-muted hover:text-ink",
};

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
