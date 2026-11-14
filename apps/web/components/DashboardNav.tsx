"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { demoSignOut } from "../app/(auth)/actions";
import { useDemoStore } from "../lib/use-demo-store";
import { GHOST_BUTTON } from "./Button";
import { GlassCard } from "./GlassCard";

const LINKS = [
  { href: "/dashboard/projects", label: "Projects" },
];

const small = `shrink-0 ${GHOST_BUTTON}`;

export function DashboardNav({ name, appName }: { name: string; appName: string }) {
  const pathname = usePathname();
  const { reset } = useDemoStore();
  return (
    <header className="sticky top-0 z-10 p-3 sm:p-4">
      <GlassCard className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link href="/dashboard" className="inline-flex min-h-10 items-center font-semibold tracking-tight">
            {appName}
          </Link>
          <span className="truncate text-sm text-muted md:hidden">{name}</span>
        </div>
        <nav aria-label="Dashboard" className="-mx-1 flex gap-1 overflow-x-auto px-1">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 shrink-0 items-center rounded-control px-3 py-2 text-sm transition ${
                  active ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden max-w-40 truncate text-sm text-muted md:inline">{name}</span>
          <button type="button" onClick={reset} className={small}>
            Reset demo
          </button>
          <form action={demoSignOut}>
            <button type="submit" className={small}>
              Sign out
            </button>
          </form>
        </div>
      </GlassCard>
    </header>
  );
}
