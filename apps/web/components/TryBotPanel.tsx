"use client";

import { useState } from "react";
import { DEMO_MESSAGE_MAX_CHARS } from "@askwell/shared";
import { sendMessage, suggestedQuestions, validateMessage } from "../lib/try-bot";
import { useDemoStore } from "../lib/use-demo-store";
import { GlassCard } from "./GlassCard";

export function TryBotPanel({ projectId }: { projectId: string }) {
  const store = useDemoStore();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const project = store.projects.find((p) => p.id === projectId);
  const messages = store.conversations.find((c) => c.id === conversationId)?.messages ?? [];
  const valid = validateMessage(draft).ok;
  const over = draft.length > DEMO_MESSAGE_MAX_CHARS;

  async function send() {
    if (typing) return;
    const text = draft;
    const checked = validateMessage(text);
    if (!checked.ok) {
      setError(checked.error);
      return;
    }
    setError(null);
    setDraft("");
    setTyping(true);
    try {
      const result = await sendMessage(store, { projectId, conversationId, text }, undefined, setConversationId);
      if (!result.ok) {
        setConversationId(null);
        setError(result.error);
        setDraft(text);
      }
    } finally {
      setTyping(false);
    }
  }

  function newChat() {
    setConversationId(null);
    setDraft("");
    setError(null);
  }

  if (!project) {
    return (
      <GlassCard className="p-8 text-center">
        <h2 className="text-lg font-semibold">Project not found</h2>
        <p className="mt-1 text-sm text-muted">It may have been deleted.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="flex flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="min-w-0 truncate text-sm text-muted">Chatting with {project.name}</p>
        <button
          type="button"
          onClick={newChat}
          disabled={typing}
          className="shrink-0 rounded-control border border-line px-3 py-1.5 text-sm hover:bg-raised disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-focus"
        >
          New chat
        </button>
      </div>

      <div className="min-h-64 flex-1 space-y-3 px-5 py-4" aria-live="polite">
        {messages.length === 0 && !typing ? (
          <div className="space-y-3 py-6 text-center">
            <p className="text-sm text-muted">Ask a question to try your bot. Try one of these:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions(projectId).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setDraft(q)}
                  className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-raised focus-visible:outline-2 focus-visible:outline-focus"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const visitor = m.role === "visitor";
            return (
              <div key={m.id} className={`flex ${visitor ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-card px-4 py-2.5 text-sm ${
                    visitor ? "bg-accent text-accent-ink" : "border border-line bg-raised"
                  }`}
                >
                  {m.body}
                </div>
              </div>
            );
          })
        )}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-card border border-line bg-raised px-4 py-2.5 text-sm text-muted">
              <span className="sr-only">The bot is typing</span>
              <span aria-hidden="true" className="animate-pulse motion-reduce:animate-none">
                …
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        className="space-y-2 border-t border-line px-5 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="try-bot-input">
            Your message
          </label>
          <input
            id="try-bot-input"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError(null);
            }}
            placeholder="Ask your bot something…"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-control border border-line bg-surface px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-focus"
          />
          <button
            type="submit"
            disabled={typing || !valid}
            className="shrink-0 rounded-control bg-accent px-5 py-2 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-focus"
          >
            Send
          </button>
        </div>
        <div className="flex justify-between gap-3 text-xs">
          <p role="alert" className="text-danger">
            {error ?? (over ? `Too long: at most ${DEMO_MESSAGE_MAX_CHARS} characters.` : "")}
          </p>
          <p className={over ? "text-danger" : "text-muted"}>
            {draft.length}/{DEMO_MESSAGE_MAX_CHARS}
          </p>
        </div>
      </form>
    </GlassCard>
  );
}
