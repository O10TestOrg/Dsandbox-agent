"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, parseConsolePath, sectionHref, type SectionSlug } from "../lib/console-nav";
import { useDemoStore } from "../lib/use-demo-store";
import { Icon, type IconName } from "./Icon";
import { Eyebrow } from "./Text";

const SECTION_ICON: Record<SectionSlug, IconName> = {
  knowledge: "document",
  conversations: "conversation",
  try: "play",
  usage: "chart",
};

function Item({
  href,
  icon,
  label,
  current,
}: {
  href: string;
  icon: IconName;
  label: string;
  /** "page" on the exact page, "true" when inside it (a conversation under Conversations). */
  current: "page" | "true" | false;
}) {
  return (
    <NextLink
      href={href}
      aria-current={current || undefined}
      className={`flex min-h-12 items-center gap-3 px-3 text-body transition-colors ${
        current ? "bg-surface text-ink" : "text-muted hover:text-ink"
      }`}
    >
      <Icon name={icon} />
      <span className="min-w-0 truncate">{label}</span>
    </NextLink>
  );
}

/** Console navigation: Projects, then the current project's sections. Used fixed on desktop and in the mobile drawer. */
export function Sidebar() {
  const pathname = usePathname();
  const { projects } = useDemoStore();
  const { projectId, section } = parseConsolePath(pathname);
  const project = projectId ? projects.find((p) => p.id === projectId) : undefined;

  return (
    <nav aria-label="Console" className="space-y-8">
      <ul>
        <li>
          <Item
            href="/dashboard/projects"
            icon="folder"
            label="Projects"
            current={pathname === "/dashboard/projects" ? "page" : false}
          />
        </li>
      </ul>
      {project ? (
        <div className="space-y-2">
          <Eyebrow className="truncate px-3">{project.name}</Eyebrow>
          <ul>
            {SECTIONS.map((s) => {
              const href = sectionHref(project.id, s.slug);
              const current = section === s.slug ? (pathname === href ? "page" : "true") : false;
              return (
                <li key={s.slug}>
                  <Item href={href} icon={SECTION_ICON[s.slug]} label={s.label} current={current} />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
