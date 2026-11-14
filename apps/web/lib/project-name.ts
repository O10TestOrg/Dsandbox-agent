export const PROJECT_NAME_MAX = 60;

export type ParsedName = { ok: true; name: string } | { ok: false; error: string };

/** A project name is required, trimmed, and at most 60 characters. */
export function parseProjectName(raw: string): ParsedName {
  const name = raw.trim();
  if (!name) return { ok: false, error: "Enter a name." };
  if (name.length > PROJECT_NAME_MAX) return { ok: false, error: `Use ${PROJECT_NAME_MAX} characters or fewer.` };
  return { ok: true, name };
}
