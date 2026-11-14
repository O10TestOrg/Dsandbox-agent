/** Where the console is: which project and section a dashboard path points at, and the breadcrumb for it. */

export const SECTIONS = [
  { slug: "knowledge", label: "Knowledge" },
  { slug: "conversations", label: "Conversations" },
  { slug: "try", label: "Try your bot" },
  { slug: "usage", label: "Usage" },
] as const;

export type SectionSlug = (typeof SECTIONS)[number]["slug"];

export type Crumb = { label: string; href: string | null };

const PROJECTS = "/dashboard/projects";
const DEFAULT_SECTION: SectionSlug = "knowledge";

const isSection = (value: string | undefined): value is SectionSlug => SECTIONS.some((s) => s.slug === value);

function decode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Splits `/dashboard/projects/<id>/<section>/...`. A thread counts as the Conversations section. */
export function parseConsolePath(pathname: string): { projectId: string | null; section: SectionSlug | null } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "dashboard" || parts[1] !== "projects" || !parts[2]) return { projectId: null, section: null };
  return { projectId: decode(parts[2]), section: isSection(parts[3]) ? parts[3] : null };
}

export function sectionHref(projectId: string, section: SectionSlug): string {
  return `${PROJECTS}/${encodeURIComponent(projectId)}/${section}`;
}

/** Projects / <name> / <section>. The last crumb is the current page and has no link. */
export function breadcrumb(pathname: string, projects: readonly { id: string; name: string }[]): Crumb[] {
  const { projectId, section } = parseConsolePath(pathname);
  if (!projectId) return [{ label: "Projects", href: null }];

  const root: Crumb = { label: "Projects", href: PROJECTS };
  const project = projects.find((p) => p.id === projectId);
  if (!project) return [root, { label: "Project not found", href: null }];
  if (!section) return [root, { label: project.name, href: null }];

  const crumbs: Crumb[] = [root, { label: project.name, href: sectionHref(projectId, DEFAULT_SECTION) }];
  const label = SECTIONS.find((s) => s.slug === section)?.label ?? section;
  const inThread = section === "conversations" && pathname.split("/").filter(Boolean).length > 4;
  if (inThread) {
    crumbs.push({ label, href: sectionHref(projectId, section) }, { label: "Conversation", href: null });
  } else {
    crumbs.push({ label, href: null });
  }
  return crumbs;
}

/** The same section in another project. A thread belongs to the old project, so it goes to that list instead. */
export function switchProjectHref(pathname: string, targetProjectId: string): string {
  const { section } = parseConsolePath(pathname);
  return sectionHref(targetProjectId, section ?? DEFAULT_SECTION);
}
