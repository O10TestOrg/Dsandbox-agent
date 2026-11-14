"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { demoSignOut } from "../app/(auth)/actions";
import { useDemoStore } from "../lib/use-demo-store";
import { buttonClass } from "./Button";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Link } from "./Link";
import { MetaText } from "./Text";

const LINKS = [{ href: "/dashboard/projects", label: "Projects" }];

const iconButton =
  "inline-flex size-12 shrink-0 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface";

/** Slim sticky header: wordmark left, text links, labelled icon actions right. One menu button on mobile. */
export function DashboardNav({ name, appName }: { name: string; appName: string }) {
  const pathname = usePathname();
  const { reset } = useDemoStore();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  // Close the mobile menu after navigating (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Escape closes the mobile menu and puts focus back on its button.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const actions = (
    <>
      <button type="button" onClick={reset} className={buttonClass("quiet")}>
        <Icon name="reset" />
        Reset demo
      </button>
      <form action={demoSignOut}>
        <button type="submit" className={buttonClass("quiet")}>
          <Icon name="sign-out" />
          Sign out
        </button>
      </form>
    </>
  );

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <NextLink href="/dashboard" className="inline-flex min-h-12 items-center">
            {appName}
          </NextLink>
          <nav aria-label="Dashboard" className="hidden gap-6 md:flex">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} variant="nav" current={isCurrent(link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-1 md:flex">
          <MetaText className="mr-2 max-w-40 truncate">{name}</MetaText>
          {actions}
        </div>
        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          className={`${iconButton} md:hidden`}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </Container>
      {open ? (
        <div id={menuId} className="border-t border-line md:hidden">
          <Container className="flex flex-col items-start gap-1 py-4">
            <MetaText className="block max-w-full truncate">Signed in as {name}</MetaText>
            <nav aria-label="Dashboard" className="flex flex-col">
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} variant="nav" current={isCurrent(link.href)}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="-ml-6 flex flex-col items-start">{actions}</div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
