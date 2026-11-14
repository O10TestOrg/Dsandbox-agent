import type { DemoKnowledgeSource } from "@askwell/shared";

/** How long a new source shows "processing" before it becomes "ready". */
export const KNOWLEDGE_PROCESSING_MS = 2000;
const SOURCE_TITLE_MAX = 120;

export const FILE_ACCEPT = ".pdf,.md,.txt";
export const FILE_REJECTED_MESSAGE = "Only .pdf, .md and .txt files are supported.";

/** The source type for a file name, from its extension, or null when the extension isn't supported. */
export function sourceTypeFromFileName(fileName: string): "pdf" | "md" | "txt" | null {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) return null;
  const ext = fileName.slice(dot + 1).toLowerCase();
  return ext === "pdf" || ext === "md" || ext === "txt" ? ext : null;
}

type ParsedTitle = { ok: true; title: string } | { ok: false; error: string };

export function parseSourceTitle(raw: string): ParsedTitle {
  const title = raw.trim();
  if (!title) return { ok: false, error: "Enter a title." };
  if (title.length > SOURCE_TITLE_MAX) return { ok: false, error: `Use ${SOURCE_TITLE_MAX} characters or fewer.` };
  return { ok: true, title };
}

/**
 * Milliseconds until a source should flip to "ready", or null if it isn't processing.
 * 0 means it is already 2 s old (or its date is unreadable): flip it now, so leaving the page mid-processing never leaves it stuck.
 */
export function msUntilReady(source: Pick<DemoKnowledgeSource, "status" | "createdAt">, nowMs: number): number | null {
  if (source.status !== "processing") return null;
  const created = Date.parse(source.createdAt);
  if (Number.isNaN(created)) return 0;
  const remaining = created + KNOWLEDGE_PROCESSING_MS - nowMs;
  return Math.min(KNOWLEDGE_PROCESSING_MS, Math.max(0, remaining));
}
