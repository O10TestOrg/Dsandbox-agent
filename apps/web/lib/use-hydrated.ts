"use client";

import { useSyncExternalStore } from "react";

/**
 * False on the server and during hydration, true once the browser has taken over.
 * Demo data lives in the browser, so screens that depend on it wait for this to avoid a server/client mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}
