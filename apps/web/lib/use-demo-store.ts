"use client";

import { useSyncExternalStore } from "react";
import { DEMO_SEED, createDemoStore, type DemoActions, type DemoState } from "./demo-store";

const store = createDemoStore(() => (typeof window === "undefined" ? undefined : window.localStorage));

const actions: DemoActions = {
  createProject: store.createProject,
  renameProject: store.renameProject,
  deleteProject: store.deleteProject,
  addSource: store.addSource,
  setSourceStatus: store.setSourceStatus,
  deleteSource: store.deleteSource,
  startConversation: store.startConversation,
  appendMessage: store.appendMessage,
  reset: store.reset,
};

/** Demo data and actions. The server snapshot is the seed, so the first client render matches the server HTML. */
export function useDemoStore(): DemoState & DemoActions {
  const state = useSyncExternalStore(store.subscribe, store.getState, () => DEMO_SEED);
  return { ...state, ...actions };
}
