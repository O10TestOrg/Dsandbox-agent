"use client";

import { useSyncExternalStore } from "react";
import { canSaveToStorage } from "./storage-available";

// Storage can be blocked or unblocked while the page is open (site settings, another tab). Re-check then.
function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
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
    <p role="status" className="rounded-control border border-line bg-raised px-3 py-2 text-sm">
      Your browser is blocking storage, so changes won&apos;t be saved. The demo still works until you close this tab.
    </p>
  );
}
