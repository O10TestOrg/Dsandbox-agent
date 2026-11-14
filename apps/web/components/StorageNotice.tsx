"use client";

import { useSyncExternalStore } from "react";
import { Notice } from "./Signal";
import { PROBE_KEY, canSaveToStorage } from "./storage-available";

// Storage can be blocked or unblocked while the page is open (site settings, another tab). Re-check then.
function subscribe(onChange: () => void) {
  // Our own probe writes fire `storage` in other tabs; reacting to those would ping-pong between tabs.
  // A null key (storage cleared) still counts.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== PROBE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}
const check = () => canSaveToStorage(() => window.localStorage);

/** Small notice when the browser blocks storage. The demo keeps working for the session, but nothing is saved. */
export function StorageNotice() {
  // Server and hydration render say "fine", so the notice never causes a mismatch.
  const canSave = useSyncExternalStore(subscribe, check, () => true);
  if (canSave) return null;
  return (
    <Notice tone="warning" role="status">
      Your browser is blocking storage, so changes won&apos;t be saved. The demo still works until you close this tab.
    </Notice>
  );
}
