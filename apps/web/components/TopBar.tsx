"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { demoSignOut } from "../app/(auth)/actions";
import { breadcrumb } from "../lib/console-nav";
import { useDemoStore } from "../lib/use-demo-store";
import { Icon } from "./Icon";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { MetaText } from "./Text";

/** Icon actions: the label is visible on wide screens and read by screen readers everywhere. */
const action =
  "inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-2 rounded-pill text-muted transition-colors hover:bg-surface hover:text-ink lg:px-4";

/** Slim top bar: breadcrumb, project switcher, and the account actions. `menuButton` opens the drawer on mobile. */
export function TopBar({ name, menuButton }: { name: string; menuButton: React.ReactNode }) {
  const pathname = usePathname();
  const { projects, reset } = useDemoStore();
  const crumbs = breadcrumb(pathname, projects);

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper">
      <div className="flex min-h-16 items-center gap-2 px-gutter md:gap-4">
        {menuButton}
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-2 text-body">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              return (
                // Only the current page shows on small screens; the drawer covers the rest.
                <li key={`${i}-${crumb.label}`} className={`min-w-0 items-center gap-2 ${last ? "flex" : "hidden sm:flex"}`}>
                  {i > 0 ? (
                    <span aria-hidden="true" className={`text-muted ${last ? "hidden sm:inline" : ""}`}>
                      /
                    </span>
                  ) : null}
                  {crumb.href ? (
                    <NextLink
                      href={crumb.href}
                      className="inline-flex min-h-12 min-w-0 items-center text-muted transition-colors hover:text-ink"
                    >
                      <span className="truncate">{crumb.label}</span>
                    </NextLink>
                  ) : (
                    <span aria-current="page" className="truncate">
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <ProjectSwitcher className="hidden md:block" />
        <MetaText className="hidden max-w-40 truncate xl:block">{name}</MetaText>
        <button type="button" onClick={reset} className={action}>
          <Icon name="reset" />
          <span className="sr-only lg:not-sr-only">Reset demo</span>
        </button>
        <form action={demoSignOut}>
          <button type="submit" className={action}>
            <Icon name="sign-out" />
            <span className="sr-only lg:not-sr-only">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
