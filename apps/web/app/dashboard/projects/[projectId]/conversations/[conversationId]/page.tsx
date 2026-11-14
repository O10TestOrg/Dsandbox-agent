import Link from "next/link";
import { DEMO_CONVERSATIONS } from "@askwell/shared";
import { EmptyState } from "../../../../../../components/EmptyState";
import { formatTime } from "../../../../../../lib/conversations";

export const metadata = { title: "Conversation" };

export default async function Page({ params }: { params: Promise<{ projectId: string; conversationId: string }> }) {
  const { projectId, conversationId } = await params;
  const back = `/dashboard/projects/${encodeURIComponent(projectId)}/conversations`;
  // TODO(P3D2-T01): read from useDemoStore() once the store is merged.
  const conversation = DEMO_CONVERSATIONS.find((c) => c.id === conversationId && c.projectId === projectId);

  return (
    <section className="space-y-4">
      <Link href={back} className="text-sm text-muted underline-offset-4 hover:underline">
        ← Back to conversations
      </Link>
      {!conversation ? (
        <EmptyState title="Conversation not found">
          It may have been deleted. <Link href={back} className="underline underline-offset-4">Back to conversations</Link>
        </EmptyState>
      ) : (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">Conversation</h1>
          {conversation.messages.length === 0 ? (
            <EmptyState title="No messages">This conversation is empty.</EmptyState>
          ) : (
            <ol className="space-y-3">
              {conversation.messages.map((m) => {
                const visitor = m.role === "visitor";
                return (
                  <li key={m.id} className={`flex flex-col ${visitor ? "items-start" : "items-end"}`}>
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-card px-4 py-2.5 text-sm ${
                        visitor ? "border border-line bg-raised" : "bg-accent text-accent-ink"
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
