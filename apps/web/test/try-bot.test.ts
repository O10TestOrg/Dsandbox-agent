import { describe, expect, it } from "vitest";
import { DEMO_MESSAGE_MAX_CHARS, DEMO_UNKNOWN_REPLY, getScriptedReply } from "@askwell/shared";
import { createDemoStore } from "../lib/demo-store";
import { sendMessage, suggestedQuestions, validateMessage } from "../lib/try-bot";

const noWait = () => Promise.resolve();
const makeStore = () => createDemoStore(() => undefined);
const coffee = "demo-coffee";

describe("validateMessage", () => {
  it("rejects empty and whitespace-only input", () => {
    expect(validateMessage("")).toEqual({ ok: false, error: expect.any(String) });
    expect(validateMessage("   \n ")).toEqual({ ok: false, error: expect.any(String) });
  });

  it("rejects 1,001 characters and accepts exactly 1,000", () => {
    expect(validateMessage("a".repeat(DEMO_MESSAGE_MAX_CHARS + 1)).ok).toBe(false);
    expect(validateMessage("a".repeat(DEMO_MESSAGE_MAX_CHARS))).toEqual({ ok: true, text: "a".repeat(1000) });
  });

  it("trims before counting", () => {
    expect(validateMessage(`  hi  `)).toEqual({ ok: true, text: "hi" });
    expect(validateMessage(` ${"a".repeat(DEMO_MESSAGE_MAX_CHARS)} `).ok).toBe(true);
  });
});

describe("sendMessage", () => {
  it("records a sample question with its scripted answer in a new conversation", async () => {
    const store = makeStore();
    const result = await sendMessage(store, { projectId: coffee, conversationId: null, text: "What are your hours?" }, noWait);
    expect(result.ok).toBe(true);
    const convo = store.getState().conversations.find((c) => c.id === (result.ok && result.conversationId));
    expect(convo?.projectId).toBe(coffee);
    expect(convo?.messages.map((m) => [m.role, m.body])).toEqual([
      ["visitor", "What are your hours?"],
      ["bot", getScriptedReply(coffee, "What are your hours?")],
    ]);
    expect(convo?.messages[1]?.body).not.toBe(DEMO_UNKNOWN_REPLY);
  });

  it("records the \"I don't know\" reply for an unrelated question", async () => {
    const store = makeStore();
    const result = await sendMessage(store, { projectId: coffee, conversationId: null, text: "Who won the match?" }, noWait);
    const convo = store.getState().conversations.find((c) => c.id === (result.ok && result.conversationId));
    expect(convo?.messages.at(-1)?.body).toBe(DEMO_UNKNOWN_REPLY);
  });

  it("adds to the same conversation on a later message", async () => {
    const store = makeStore();
    const first = await sendMessage(store, { projectId: coffee, conversationId: null, text: "wifi?" }, noWait);
    if (!first.ok) throw new Error("expected ok");
    const before = store.getState().conversations.length;
    await sendMessage(store, { projectId: coffee, conversationId: first.conversationId, text: "hours?" }, noWait);
    const state = store.getState();
    expect(state.conversations).toHaveLength(before);
    expect(state.conversations.find((c) => c.id === first.conversationId)?.messages).toHaveLength(4);
  });

  it("rejects invalid input without touching the store", async () => {
    const store = makeStore();
    const before = store.getState();
    for (const text of ["", "a".repeat(DEMO_MESSAGE_MAX_CHARS + 1)]) {
      expect((await sendMessage(store, { projectId: coffee, conversationId: null, text }, noWait)).ok).toBe(false);
    }
    expect(store.getState()).toBe(before);
  });

  it("counts only the visitor message toward usage", async () => {
    const store = makeStore();
    const used = () => store.getState().projects.find((p) => p.id === coffee)?.messagesUsed ?? 0;
    const start = used();
    const first = await sendMessage(store, { projectId: coffee, conversationId: null, text: "hours?" }, noWait);
    expect(used()).toBe(start + 1);
    if (!first.ok) throw new Error("expected ok");
    await sendMessage(store, { projectId: coffee, conversationId: first.conversationId, text: "wifi?" }, noWait);
    expect(used()).toBe(start + 2);
  });

  it("fails cleanly when the conversation no longer exists", async () => {
    const store = makeStore();
    const result = await sendMessage(store, { projectId: coffee, conversationId: "gone", text: "hi" }, noWait);
    expect(result.ok).toBe(false);
  });
});

describe("suggestedQuestions", () => {
  it("offers 2-3 questions per sample project that the bot can answer", () => {
    for (const id of ["demo-coffee", "demo-saas", "demo-store"]) {
      const questions = suggestedQuestions(id);
      expect(questions.length).toBeGreaterThanOrEqual(2);
      expect(questions.length).toBeLessThanOrEqual(3);
      for (const q of questions) expect(getScriptedReply(id, q)).not.toBe(DEMO_UNKNOWN_REPLY);
    }
  });

  it("falls back to a few questions for a project the user created", () => {
    expect(suggestedQuestions("user-made").length).toBeGreaterThanOrEqual(2);
  });
});
