"use client";

import { useState } from "react";
import { DEMO_MESSAGE_MAX_CHARS } from "@askwell/shared";
import { sendMessage, suggestedQuestions, validateMessage } from "../lib/try-bot";
import { useDemoStore } from "../lib/use-demo-store";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { INPUT } from "./field";
import { Icon } from "./Icon";
import { SignalMessage } from "./Signal";
import { MetaText } from "./Text";
import { Surface } from "./Surface";

export function TryBotPanel({ projectId }: { projectId: string }) {
  const store = useDemoStore();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const project = store.projects.find((p) => p.id === projectId);
  const messages = store.conversations.find((c) => c.id === conversationId)?.messages ?? [];
  const valid = validateMessage(draft).ok;
  // Same rule as validateMessage: the trimmed text is what counts.
  const length = draft.trim().length;
  const over = length > DEMO_MESSAGE_MAX_CHARS;

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
        setDraft((current) => (current === "" ? text : current));
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
    return <EmptyState title="Project not found">It may have been deleted.</EmptyState>;
  }

  const tooLong = over ? `Too long. Keep it under ${DEMO_MESSAGE_MAX_CHARS} characters.` : null;
  const shownError = error ?? tooLong;

  return (
    <Surface bordered className="flex flex-col">
      <div className="flex flex-col items-start gap-1 border-b border-line py-2 pl-5 pr-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <MetaText className="min-w-0 max-w-full truncate pt-2 sm:pt-0">
          Chatting with <strong>{project.name}</strong>
        </MetaText>
        <Button variant="quiet" onClick={newChat} disabled={typing} className="-ml-6 shrink-0 sm:ml-0">
          <Icon name="plus" />
          New conversation
        </Button>
      </div>

      <div className="min-h-64 flex-1 space-y-3 px-5 py-6" aria-live="polite">
        {messages.length === 0 && !typing ? (
          <div className="space-y-4">
            <p className="text-body text-muted">Ask a question, or try one of these.</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions(projectId).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setDraft(q)}
                  className="min-h-12 rounded-pill border border-line px-4 text-left text-body transition-colors hover:bg-surface"
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
                <p
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-square px-4 py-2.5 text-body ${
                    visitor ? "bg-ink text-paper" : "bg-surface"
                  }`}
                >
                  <span className="sr-only">{visitor ? "You: " : "Bot: "}</span>
                  {m.body}
                </p>
              </div>
            );
          })
        )}
        {typing && (
          <div className="flex justify-start">
            <p className="rounded-square bg-surface px-4 py-2.5 text-body text-muted">
              <span className="sr-only">The bot is typing</span>
              <span aria-hidden="true" className="animate-pulse motion-reduce:animate-[pulse_3s_ease-in-out_infinite]">
                …
              </span>
            </p>
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
        <label className="block text-body" htmlFor="try-bot-input">
          Your message
        </label>
        <div className="flex gap-2">
          <input
            id="try-bot-input"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError(null);
            }}
            autoComplete="off"
            aria-invalid={shownError ? true : undefined}
            aria-describedby="try-bot-count"
            className={`${INPUT} min-w-0 flex-1`}
          />
          <Button type="submit" disabled={!valid} loading={typing} aria-label="Send" className="shrink-0">
            <Icon name="send" />
          </Button>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div role="alert" className="min-w-0">
            {shownError ? <SignalMessage tone="danger">{shownError}</SignalMessage> : null}
          </div>
          <MetaText className={over ? "text-ink" : ""}>
            <span id="try-bot-count">
              {length}/{DEMO_MESSAGE_MAX_CHARS}
            </span>
          </MetaText>
        </div>
      </form>
    </Surface>
  );
}
