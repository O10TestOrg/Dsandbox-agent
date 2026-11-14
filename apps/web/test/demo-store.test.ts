import { DEMO_CONVERSATIONS, DEMO_KNOWLEDGE_SOURCES, DEMO_PROJECTS } from "@askwell/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_STORE_KEY, createDemoStore } from "../lib/demo-store";

type FakeStorage = { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void };

let data: Map<string, string>;
const storage = (): FakeStorage => ({
  getItem: (k) => data.get(k) ?? null,
  setItem: (k, v) => void data.set(k, v),
});
const newStore = () => createDemoStore(() => storage());

const first = <T>(items: T[]): T => {
  const item = items[0];
  if (item === undefined) throw new Error("seed is empty");
  return item;
};
const firstProject = first(DEMO_PROJECTS);
const firstSource = first(DEMO_KNOWLEDGE_SOURCES);

const seed = { projects: DEMO_PROJECTS, sources: DEMO_KNOWLEDGE_SOURCES, conversations: DEMO_CONVERSATIONS };

beforeEach(() => {
  data = new Map();
});

describe("seed", () => {
  it("starts from the shared seed and uses the askwell: key prefix", () => {
    expect(newStore().getState()).toEqual(seed);
    expect(DEMO_STORE_KEY.startsWith("askwell:")).toBe(true);
  });
});

describe("projects", () => {
  it("creates a project with zero usage", () => {
    const store = newStore();
    const id = store.createProject("Docs bot");
    const created = store.getState().projects.find((p) => p.id === id);
    expect(created).toMatchObject({ name: "Docs bot", messagesUsed: 0 });
    expect(Number.isNaN(Date.parse(created?.createdAt ?? ""))).toBe(false);
  });

  it("renames a project", () => {
    const store = newStore();
    const id = firstProject.id;
    store.renameProject(id, "Renamed");
    expect(store.getState().projects.find((p) => p.id === id)?.name).toBe("Renamed");
  });

  it("deletes a project with its sources and conversations", () => {
    const store = newStore();
    const id = firstProject.id;
    store.deleteProject(id);
    const s = store.getState();
    expect(s.projects.some((p) => p.id === id)).toBe(false);
    expect(s.sources.some((x) => x.projectId === id)).toBe(false);
    expect(s.conversations.some((c) => c.projectId === id)).toBe(false);
    expect(s.projects).toHaveLength(DEMO_PROJECTS.length - 1);
    expect(s.sources.length).toBeGreaterThan(0); // other projects keep theirs
  });
});

describe("knowledge sources", () => {
  it("adds a source as processing, then sets its status", () => {
    const store = newStore();
    const projectId = firstProject.id;
    const id = store.addSource(projectId, { title: "Pricing", type: "md" });
    expect(store.getState().sources.find((s) => s.id === id)).toMatchObject({
      projectId,
      title: "Pricing",
      type: "md",
      status: "processing",
    });
    store.setSourceStatus(id, "ready");
    expect(store.getState().sources.find((s) => s.id === id)?.status).toBe("ready");
  });

  it("deletes a source", () => {
    const store = newStore();
    const id = firstSource.id;
    store.deleteSource(id);
    expect(store.getState().sources.some((s) => s.id === id)).toBe(false);
    expect(store.getState().sources).toHaveLength(DEMO_KNOWLEDGE_SOURCES.length - 1);
  });
});

describe("conversations", () => {
  it("counts only visitor messages toward usage", () => {
    const store = newStore();
    const projectId = firstProject.id;
    const before = firstProject.messagesUsed;
    const convo = store.startConversation(projectId);
    expect(store.getState().conversations.find((c) => c.id === convo)).toMatchObject({ projectId, messages: [] });

    store.appendMessage(convo, "visitor", "Hi");
    store.appendMessage(convo, "bot", "Hello");
    store.appendMessage(convo, "visitor", "Bye");

    const s = store.getState();
    expect(s.projects.find((p) => p.id === projectId)?.messagesUsed).toBe(before + 2);
    expect(s.conversations.find((c) => c.id === convo)?.messages.map((m) => [m.role, m.body])).toEqual([
      ["visitor", "Hi"],
      ["bot", "Hello"],
      ["visitor", "Bye"],
    ]);
  });

  it("ignores a message for a conversation that no longer exists", () => {
    const store = newStore();
    const before = store.getState();
    store.appendMessage("gone", "visitor", "Hi");
    expect(store.getState()).toEqual(before);
  });
});

describe("reset and persistence", () => {
  it("reset restores the seed", () => {
    const store = newStore();
    store.createProject("Temp");
    store.deleteProject(firstProject.id);
    store.reset();
    expect(store.getState()).toEqual(seed);
  });

  it("survives a reload: a new store reads the saved state", () => {
    const first = newStore();
    const id = first.createProject("Kept");
    const second = newStore();
    expect(second.getState().projects.some((p) => p.id === id)).toBe(true);
  });

  it("saves the reset state, so a reload after reset shows the seed", () => {
    const first = newStore();
    first.createProject("Temp");
    first.reset();
    expect(newStore().getState()).toEqual(seed);
  });

  it("falls back to the seed on bad JSON", () => {
    data.set(DEMO_STORE_KEY, "{not json");
    expect(newStore().getState()).toEqual(seed);
  });

  it("falls back to the seed when the saved value has the wrong shape", () => {
    data.set(DEMO_STORE_KEY, JSON.stringify({ projects: "nope" }));
    expect(newStore().getState()).toEqual(seed);
  });

  it("falls back to the seed when reading throws, and keeps working when writing throws", () => {
    const boom = () => {
      throw new Error("blocked");
    };
    const store = createDemoStore(() => ({ getItem: boom, setItem: boom }));
    expect(store.getState()).toEqual(seed);
    const id = store.createProject("In memory");
    expect(store.getState().projects.some((p) => p.id === id)).toBe(true);
  });

  it("falls back to the seed when localStorage itself is unavailable", () => {
    const store = createDemoStore(() => undefined);
    expect(store.getState()).toEqual(seed);
  });
});

describe("subscribe", () => {
  it("notifies on change and stops after unsubscribe", () => {
    const store = newStore();
    const listener = vi.fn();
    const off = store.subscribe(listener);
    store.createProject("A");
    expect(listener).toHaveBeenCalledTimes(1);
    off();
    store.createProject("B");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("returns the same state object until something changes", () => {
    const store = newStore();
    expect(store.getState()).toBe(store.getState());
  });
});
