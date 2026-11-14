/** One icon set: 24px grid, 1.25px stroke, round caps and joins, no fill, currentColor. Shown at 20px. */
const PATHS = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  alert: "M12 4l9 16H3L12 4z M12 10v4 M12 17.25v.01",
  error: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M9 9l6 6 M15 9l-6 6",
  info: "M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 11v5 M12 7.75v.01",
  menu: "M4 7h16 M4 12h16 M4 17h16",
  close: "M6 6l12 12 M18 6L6 18",
  "arrow-left": "M19 12H5 M11 6l-6 6 6 6",
  plus: "M12 5v14 M5 12h14",
  reset: "M4 12a8 8 0 1 0 2.34-5.66 M4 4.5V9h4.5",
  "sign-out": "M10 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4 M15 8l4 4-4 4 M19 12H9",
  trash: "M5 7h14 M10 7V4.5h4V7 M7 7l1 13h8l1-13",
  send: "M5 12h13 M13 6l6 6-6 6",
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
