import {
  DEMO_CONVERSATIONS,
  DEMO_KNOWLEDGE_SOURCES,
  DEMO_PROJECTS,
  type DemoConversation,
  type DemoKnowledgeSource,
  type DemoKnowledgeSourceStatus,
  type DemoKnowledgeSourceType,
  type DemoMessage,
  type DemoProject,
} from "@askwell/shared";

/** The `askwell:` prefix marks every key the demo owns in localStorage. */
export const DEMO_STORE_KEY = "askwell:demo-store";

export type DemoState = {
  projects: DemoProject[];
  sources: DemoKnowledgeSource[];
  conversations: DemoConversation[];
};

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export const DEMO_SEED: DemoState = {
  projects: DEMO_PROJECTS,
  sources: DEMO_KNOWLEDGE_SOURCES,
  conversations: DEMO_CONVERSATIONS,
};

export type DemoActions = {
  createProject: (name: string) => string;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  addSource: (projectId: string, source: { title: string; type: DemoKnowledgeSourceType }) => string;
  setSourceStatus: (id: string, status: DemoKnowledgeSourceStatus) => void;
  deleteSource: (id: string) => void;
  startConversation: (projectId: string) => string;
  /** Returns the new message id, or "" when the conversation no longer exists (nothing is changed). */
  appendMessage: (conversationId: string, role: DemoMessage["role"], body: string) => string;
  reset: () => void;
};

type DemoStore = DemoActions & {
  getState: () => DemoState;
  subscribe: (listener: () => void) => () => void;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string";
const SOURCE_TYPES: readonly unknown[] = ["text", "pdf", "md", "txt"];
const SOURCE_STATUSES: readonly unknown[] = ["processing", "ready", "failed"];

const isProject = (v: unknown): v is DemoProject =>
  isRecord(v) && isString(v.id) && isString(v.name) && isString(v.createdAt) && Number.isFinite(v.messagesUsed);

const isSource = (v: unknown): v is DemoKnowledgeSource =>
  isRecord(v) &&
  isString(v.id) &&
  isString(v.projectId) &&
  isString(v.title) &&
  isString(v.createdAt) &&
  SOURCE_TYPES.includes(v.type) &&
  SOURCE_STATUSES.includes(v.status);

const isMessage = (v: unknown): v is DemoMessage =>
  isRecord(v) &&
  isString(v.id) &&
  isString(v.body) &&
  isString(v.createdAt) &&
  (v.role === "visitor" || v.role === "bot");

const isConversation = (v: unknown): v is DemoConversation =>
  isRecord(v) &&
  isString(v.id) &&
  isString(v.projectId) &&
  isString(v.createdAt) &&
  Array.isArray(v.messages) &&
  v.messages.every(isMessage);

/** Saved data is untrusted (it can be stale or hand-edited): every record must match the shared types. */
const isState = (value: unknown): value is DemoState =>
  isRecord(value) &&
  Array.isArray(value.projects) &&
  value.projects.every(isProject) &&
  Array.isArray(value.sources) &&
  value.sources.every(isSource) &&
  Array.isArray(value.conversations) &&
  value.conversations.every(isConversation);

function load(storage: StorageLike | undefined): DemoState {
  try {
    const raw = storage?.getItem(DEMO_STORE_KEY);
    if (!raw) return DEMO_SEED;
    const parsed: unknown = JSON.parse(raw);
    return isState(parsed) ? parsed : DEMO_SEED;
  } catch {
    return DEMO_SEED;
  }
}

/**
 * Pure store logic, no React. `getStorage` is called on every read and write so a blocked or
 * missing localStorage (private mode, server) falls back to the seed instead of throwing.
 */
export function createDemoStore(getStorage: () => StorageLike | undefined): DemoStore {
  let state: DemoState | null = null;
  const listeners = new Set<() => void>();

  const getState = () => (state ??= load(safeStorage()));

  function safeStorage(): StorageLike | undefined {
    try {
      return getStorage();
    } catch {
      return undefined;
    }
  }

  function set(next: DemoState) {
    state = next;
    try {
      safeStorage()?.setItem(DEMO_STORE_KEY, JSON.stringify(next));
    } catch {
      // Storage is full or blocked: keep working in memory.
    }
    listeners.forEach((listener) => listener());
  }

  const now = () => new Date().toISOString();

  return {
    getState,
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },

    createProject(name) {
      const id = crypto.randomUUID();
      const s = getState();
      set({ ...s, projects: [...s.projects, { id, name, createdAt: now(), messagesUsed: 0 }] });
      return id;
    },
    renameProject(id, name) {
      const s = getState();
      set({ ...s, projects: s.projects.map((p) => (p.id === id ? { ...p, name } : p)) });
    },
    deleteProject(id) {
      const s = getState();
      set({
        projects: s.projects.filter((p) => p.id !== id),
        sources: s.sources.filter((x) => x.projectId !== id),
        conversations: s.conversations.filter((c) => c.projectId !== id),
      });
    },

    addSource(projectId, { title, type }) {
      const id = crypto.randomUUID();
      const s = getState();
      set({
        ...s,
        sources: [...s.sources, { id, projectId, title, type, status: "processing", createdAt: now() }],
      });
      return id;
    },
    setSourceStatus(id, status) {
      const s = getState();
      set({ ...s, sources: s.sources.map((x) => (x.id === id ? { ...x, status } : x)) });
    },
    deleteSource(id) {
      const s = getState();
      set({ ...s, sources: s.sources.filter((x) => x.id !== id) });
    },

    startConversation(projectId) {
      const id = crypto.randomUUID();
      const s = getState();
      set({ ...s, conversations: [...s.conversations, { id, projectId, createdAt: now(), messages: [] }] });
      return id;
    },
    appendMessage(conversationId, role, body) {
      const s = getState();
      const convo = s.conversations.find((c) => c.id === conversationId);
      if (!convo) return "";
      const id = crypto.randomUUID();
      const message: DemoMessage = { id, role, body, createdAt: now() };
      set({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c,
        ),
        projects:
          role === "visitor"
            ? s.projects.map((p) => (p.id === convo.projectId ? { ...p, messagesUsed: p.messagesUsed + 1 } : p))
            : s.projects,
      });
      return id;
    },

    reset() {
      set(DEMO_SEED);
    },
  };
}
