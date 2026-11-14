"use client";

import { Icon } from "../../../../../../components/Icon";
import { Link } from "../../../../../../components/Link";
import { MetaText } from "../../../../../../components/Text";
import { EmptyState } from "../../../../../../components/EmptyState";
import { formatTime } from "../../../../../../lib/conversations";
import { useDemoStore } from "../../../../../../lib/use-demo-store";

export function ConversationThread({ projectId, conversationId }: { projectId: string; conversationId: string }) {
  const { conversations } = useDemoStore();
  const back = `/dashboard/projects/${encodeURIComponent(projectId)}/conversations`;
  const conversation = conversations.find((c) => c.id === conversationId && c.projectId === projectId);

  return (
    <section className="space-y-8">
      <Link href={back} variant="nav" className="gap-2 text-muted hover:text-ink">
        <Icon name="arrow-left" />
        All conversations
      </Link>
      {!conversation ? (
        <EmptyState title="Conversation not found">It may have been deleted, or the link is wrong.</EmptyState>
      ) : (
        <>
          <div className="space-y-2">
            <h2 className="text-heading">Conversation</h2>
            <MetaText>
              Started <time dateTime={conversation.createdAt}>{formatTime(conversation.createdAt)}</time>
            </MetaText>
          </div>
          {conversation.messages.length === 0 ? (
            <EmptyState title="No messages">This conversation is empty.</EmptyState>
          ) : (
            <ol className="space-y-4">
              {conversation.messages.map((m) => {
                const visitor = m.role === "visitor";
                return (
                  <li key={m.id} className={`flex flex-col gap-1 ${visitor ? "items-start" : "items-end"}`}>
                    <p
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-square px-4 py-2.5 text-body ${
                        visitor ? "bg-surface" : "bg-ink text-paper"
                      }`}
                    >
                      {m.body}
                    </p>
                    <MetaText>
                      {visitor ? "Visitor" : "Bot"} · <time dateTime={m.createdAt}>{formatTime(m.createdAt)}</time>
                    </MetaText>
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
