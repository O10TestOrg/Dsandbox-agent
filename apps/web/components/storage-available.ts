type ProbeStorage = {
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const PROBE_KEY = "askwell:storage-probe";

/** True when the browser lets us save. Reaching storage can itself throw when it is blocked. */
export function canSaveToStorage(getStorage: () => ProbeStorage | undefined): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.setItem(PROBE_KEY, "1");
    storage.removeItem(PROBE_KEY);
    return true;
  } catch {
    return false;
  }
}
