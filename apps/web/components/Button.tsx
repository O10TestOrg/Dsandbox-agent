import NextLink from "next/link";

export type ButtonVariant = "primary" | "secondary" | "quiet";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-pill px-6 text-body transition-colors disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

const looks: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:opacity-85",
  secondary: "border border-ink text-ink hover:bg-surface",
  quiet: "text-muted hover:bg-surface hover:text-ink",
};

/** Class string for anything that should look like a button. Prefer <Button> and <ButtonLink>. */
export function buttonClass(variant: ButtonVariant = "primary"): string {
  return `${base} ${looks[variant]}`;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** Shows the loading state: disabled, and announced as busy. */
  loading?: boolean;
};

/** One primary action per view. Defaults to type="button" so it never submits a form by accident. */
export function Button({ variant = "primary", loading = false, className = "", type = "button", disabled, ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${buttonClass(variant)} ${className}`}
      {...rest}
    />
  );
}

/** A link that looks like a button. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <NextLink href={href} className={`${buttonClass(variant)} ${className}`}>
      {children}
    </NextLink>
  );
}
