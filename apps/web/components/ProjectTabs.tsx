"use client";

import { usePathname } from "next/navigation";
import { Link } from "./Link";

const TABS = [
  { slug: "knowledge", label: "Knowledge" },
  { slug: "conversations", label: "Conversations" },
  { slug: "try", label: "Try your bot" },
  { slug: "usage", label: "Usage" },
];

/** Text tabs under a hairline; they wrap on small screens. The current one is underlined (aria-current). */
export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/dashboard/projects/${encodeURIComponent(projectId)}`;
  return (
    <nav aria-label="Project" className="border-b border-line">
      <div className="flex flex-wrap gap-x-6">
        {TABS.map((tab) => {
          const href = `${base}/${tab.slug}`;
          const current = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={tab.slug}
              href={href}
              variant="nav"
              current={current}
              className={`shrink-0 whitespace-nowrap ${current ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
