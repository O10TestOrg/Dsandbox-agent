import type { DemoConversation } from "@askwell/shared";

export const PREVIEW_MAX_CHARS = 80;

/** Time of the latest message (ms since epoch); the conversation's own start when it has none. */
export function latestActivity(c: DemoConversation): number {
  return c.messages.reduce((latest, m) => Math.max(latest, Date.parse(m.createdAt)), Date.parse(c.createdAt));
}

/** A new array, newest activity first. */
export function sortNewestFirst(list: readonly DemoConversation[]): DemoConversation[] {
  return [...list].sort((a, b) => latestActivity(b) - latestActivity(a));
}

/** The first visitor message on one line, cut to `max` characters with an ellipsis. */
export function previewOf(c: DemoConversation, max: number = PREVIEW_MAX_CHARS): string {
  const first = c.messages.find((m) => m.role === "visitor");
  if (!first) return "No messages";
  const oneLine = first.body.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max - 1).trimEnd()}…` : oneLine;
}

const timeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Short time such as "Oct 1, 8:05 AM (UTC)". Fixed to UTC so server and browser agree. */
export function formatTime(iso: string): string {
  return `${timeFormat.format(new Date(iso))} UTC`;
}
