"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MetaText } from "./Text";

const iconButton =
  "inline-flex size-12 shrink-0 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface";

/** Must match Tailwind's `md` breakpoint: from here up the sidebar is fixed and the drawer isn't used. */
const DESKTOP = "(min-width: 48rem)";

/**
 * The console shell: a fixed sidebar and a top bar on desktop. On mobile the sidebar opens as a drawer:
 * a modal <dialog>, so focus stays inside, Escape closes it and focus returns to the menu button.
 */
export function DashboardNav({
  name,
  appName,
  children,
}: {
  name: string;
  appName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Close the drawer after navigating (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Keep the <dialog> in step with state.
  useEffect(() => {
    const dialog = drawer.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Growing past mobile hides the drawer with CSS; close it so the page isn't left inert behind it.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const onChange = () => query.matches && setOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const wordmark = (
    <NextLink href="/dashboard" className="inline-flex min-h-12 items-center px-3">
      {appName}
    </NextLink>
  );

  return (
    <div className="min-h-screen bg-paper text-ink md:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-6 overflow-y-auto border-r border-line px-3 py-2 md:flex">
        <div className="flex min-h-14 items-center">{wordmark}</div>
        <Sidebar />
      </aside>

      <TopBar
        name={name}
        menuButton={
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            className={`${iconButton} -ml-3 md:hidden`}
          >
            <Icon name="menu" />
          </button>
        }
      />

      <dialog
        ref={drawer}
        aria-label="Menu"
        onClose={() => {
          setOpen(false);
          menuButton.current?.focus();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink md:hidden"
      >
        <div className="flex min-h-16 items-center justify-between border-b border-line px-gutter">
          <div className="-ml-3">{wordmark}</div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className={`${iconButton} -mr-3`}>
            <Icon name="close" />
          </button>
        </div>
        <div className="space-y-8 px-gutter py-6">
          <ProjectSwitcher />
          <div className="-mx-3">
            <Sidebar />
          </div>
          <MetaText className="block max-w-full truncate">Signed in as {name}</MetaText>
        </div>
      </dialog>

      <main>{children}</main>
    </div>
  );
}
