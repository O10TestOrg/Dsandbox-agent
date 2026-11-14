/** One icon set: 24px grid, 1.25px stroke, round caps and joins, no fill, currentColor. Shown at 20px. */
const PATHS = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert: "M12 4l9 16H3L12 4z M12 10v4 M12 17.25v.01",
  error: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M9 9l6 6 M15 9l-6 6",
  info: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 11v5 M12 7.75v.01",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  close: "M6 6l12 12 M18 6L6 18",
} as const;

export type IconName = keyof typeof PATHS;

/**
 * Decorative by default (aria-hidden). Pair it with visible text, or pass `label` when the icon stands alone.
 */
export function Icon({ name, label, className = "" }: { name: IconName; label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
