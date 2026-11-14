"use client";

import Link from "next/link";
import { EmptyState } from "../../../../../../components/EmptyState";
import { formatTime } from "../../../../../../lib/conversations";
import { useDemoStore } from "../../../../../../lib/use-demo-store";

export function ConversationThread({ projectId, conversationId }: { projectId: string; conversationId: string }) {
  const { conversations } = useDemoStore();
  const back = `/dashboard/projects/${encodeURIComponent(projectId)}/conversations`;
  const conversation = conversations.find((c) => c.id === conversationId && c.projectId === projectId);

  return (
    <section className="space-y-4">
      <Link href={back} className="inline-flex min-h-12 items-center text-sm text-muted underline-offset-4 hover:underline">
        ← Back to conversations
      </Link>
      {!conversation ? (
        <EmptyState title="Conversation not found">
          It may have been deleted. <Link href={back} className="underline underline-offset-4">Back to conversations</Link>
        </EmptyState>
      ) : (
        <>
          <h1 className="text-2xl tracking-tight">Conversation</h1>
          {conversation.messages.length === 0 ? (
            <EmptyState title="No messages">This conversation is empty.</EmptyState>
          ) : (
            <ol className="space-y-3">
              {conversation.messages.map((m) => {
                const visitor = m.role === "visitor";
                return (
                  <li key={m.id} className={`flex flex-col ${visitor ? "items-start" : "items-end"}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-square px-4 py-2.5 text-sm ${
                        visitor ? "border border-line bg-surface" : "bg-ink text-paper"
                      }`}
                    >
                      {m.body}
                    </div>
                    <span className="mt-1 px-1 text-xs text-muted">
                      {visitor ? "Visitor" : "Bot"} · <time dateTime={m.createdAt}>{formatTime(m.createdAt)}</time>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}
    </section>
  );
}
