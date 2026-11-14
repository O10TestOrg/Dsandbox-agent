"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { parseConsolePath, switchProjectHref } from "../lib/console-nav";
import { useDemoStore } from "../lib/use-demo-store";
import { Icon } from "./Icon";

/**
 * Jump to the same section in another project. A disclosure of links: Arrow keys move between them,
 * Escape closes and returns focus to the button, and leaving with Tab or clicking outside closes it.
 */
export function ProjectSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { projects } = useDemoStore();
  const { projectId } = parseConsolePath(pathname);
  const current = projects.find((p) => p.id === projectId);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  // Close after navigating (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const links = (): HTMLAnchorElement[] =>
    Array.from(root.current?.querySelectorAll<HTMLAnchorElement>("[data-switch-item]") ?? []);

  function focusItem(index: number) {
    const items = links();
    if (items.length === 0) return;
    items[(index + items.length) % items.length]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      // Stop the drawer (a <dialog>) from closing too.
      event.stopPropagation();
      setOpen(false);
      button.current?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = links();
    const at = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (!open) {
      setOpen(true);
      // Wait for the list to render.
      requestAnimationFrame(() => focusItem(event.key === "ArrowDown" ? 0 : -1));
      return;
    }
    focusItem(at === -1 ? 0 : at + (event.key === "ArrowDown" ? 1 : -1));
  }

  if (projects.length === 0) return null;

  return (
    <div
      ref={root}
      className={`relative ${className}`}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        if (!root.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-12 w-full max-w-64 items-center justify-between gap-2 border border-line px-4 text-body transition-colors hover:border-muted"
      >
        <span className="sr-only">Switch project. Current: </span>
        <span className="min-w-0 truncate">{current?.name ?? "Choose a project"}</span>
        <Icon name="selector" className="text-muted" />
      </button>
      {open ? (
        <ul
          id={listId}
          // Never taller than the space below the top bar: a long list scrolls inside itself.
          className="absolute left-0 top-full z-20 mt-1 max-h-[calc(100dvh-6rem)] w-64 max-w-[calc(100vw-2.5rem)] overflow-y-auto border border-line bg-paper py-1"
          onClick={(event) => {
            if ((event.target as Element).closest("a[href]")) setOpen(false);
          }}
        >
          {projects.map((p) => (
            <li key={p.id}>
              <NextLink
                href={switchProjectHref(pathname, p.id)}
                data-switch-item
                aria-current={p.id === projectId ? "true" : undefined}
                className="flex min-h-12 items-center justify-between gap-3 px-4 text-body hover:bg-surface focus-visible:bg-surface"
              >
                <span className="min-w-0 truncate">{p.name}</span>
                {p.id === projectId ? <Icon name="check" /> : null}
              </NextLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
