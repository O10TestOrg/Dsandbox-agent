import { Icon, type IconName } from "./Icon";

/** Colour only signals state. The text next to it always stays ink. */
export type Tone = "success" | "warning" | "danger" | "info";

const dot: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const glyphColor: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

const glyph: Record<Tone, IconName> = { success: "check", warning: "alert", danger: "error", info: "info" };

/** A small coloured dot before a status word. Decorative: the word carries the meaning. */
export function StatusDot({ tone }: { tone: Tone | "neutral" }) {
  const color = tone === "neutral" ? "bg-muted" : dot[tone];
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 rounded-pill ${color}`} />;
}

/** Inline message: a glyph and a line of ink text. Use `role="alert"` for errors the user just caused. */
export function SignalMessage({
  tone,
  children,
  role,
  className = "",
}: {
  tone: Tone;
  children: React.ReactNode;
  role?: "alert" | "status";
  className?: string;
}) {
  return (
    <p role={role} className={`flex items-start gap-2 text-body text-ink ${className}`}>
      <Icon name={glyph[tone]} className={`mt-0.5 ${glyphColor[tone]}`} />
      <span>{children}</span>
    </p>
  );
}

/** A hairline-bordered notice for something that applies to the whole view. */
export function Notice({
  tone = "info",
  children,
  role,
  className = "",
}: {
  tone?: Tone;
  children: React.ReactNode;
  role?: "alert" | "status";
  className?: string;
}) {
  return (
    <div className={`rounded-square border border-line px-4 py-3 ${className}`}>
      <SignalMessage tone={tone} role={role}>
        {children}
      </SignalMessage>
    </div>
  );
}
