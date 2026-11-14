"use client";

import Link from "next/link";
import { EmptyState } from "../../../../../components/EmptyState";
import { MetaText } from "../../../../../components/Text";
import { Surface } from "../../../../../components/Surface";
import { formatTime, latestActivity, previewOf, sortNewestFirst } from "../../../../../lib/conversations";
import { useDemoStore } from "../../../../../lib/use-demo-store";

export function ConversationList({ projectId }: { projectId: string }) {
  const { conversations: all } = useDemoStore();
  const conversations = sortNewestFirst(all.filter((c) => c.projectId === projectId));

  return (
    <>
      {conversations.length === 0 ? (
        <EmptyState title="No conversations yet">Chats with your bot will show up here.</EmptyState>
      ) : (
        <Surface>
          <ul className="divide-y divide-line">
            {conversations.map((c) => {
              const latest = new Date(latestActivity(c)).toISOString();
              return (
              <li key={c.id}>
                <Link
                  href={`/dashboard/projects/${encodeURIComponent(projectId)}/conversations/${encodeURIComponent(c.id)}`}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 transition-colors hover:bg-surface"
                >
                  <span className="min-w-0 flex-1 truncate text-sm">{previewOf(c)}</span>
                  <MetaText className="flex shrink-0 gap-3">
                    <span>
                      {c.messages.length} {c.messages.length === 1 ? "message" : "messages"}
                    </span>
                    <time dateTime={latest}>{formatTime(latest)}</time>
                  </MetaText>
                </Link>
              </li>
              );
            })}
          </ul>
        </Surface>
      )}
    </>
  );
}
