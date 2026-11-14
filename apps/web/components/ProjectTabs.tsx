"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { slug: "knowledge", label: "Knowledge" },
  { slug: "conversations", label: "Conversations" },
  { slug: "try", label: "Try your bot" },
  { slug: "usage", label: "Usage" },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/projects/${encodeURIComponent(projectId)}`;
  return (
    <nav aria-label="Project" className="-mx-1 flex gap-1 overflow-x-auto border-b border-line px-1 pb-2">
      {TABS.map((tab) => {
        const href = `${base}/${tab.slug}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={tab.slug}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-12 shrink-0 items-center rounded-square px-3 py-2 text-sm transition ${
              active ? "bg-ink text-paper" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
