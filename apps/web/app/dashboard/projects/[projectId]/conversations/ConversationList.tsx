"use client";

import Link from "next/link";
import { ButtonLink } from "../../../../../components/Button";
import { EmptyState } from "../../../../../components/EmptyState";
import { MetaText } from "../../../../../components/Text";
import { formatTime, latestActivity, previewOf, sortNewestFirst } from "../../../../../lib/conversations";
import { useDemoStore } from "../../../../../lib/use-demo-store";

export function ConversationList({ projectId }: { projectId: string }) {
  const { conversations: all } = useDemoStore();
  const conversations = sortNewestFirst(all.filter((c) => c.projectId === projectId));

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="No conversations yet"
        action={
          <ButtonLink href={`/dashboard/projects/${encodeURIComponent(projectId)}/try`} variant="secondary">
            Try your bot
          </ButtonLink>
        }
      >
        They show up here when someone talks to your bot.
      </EmptyState>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {conversations.map((c) => {
        const latest = new Date(latestActivity(c)).toISOString();
        return (
          <li key={c.id}>
            <Link
              href={`/dashboard/projects/${encodeURIComponent(projectId)}/conversations/${encodeURIComponent(c.id)}`}
              className="group flex min-h-12 flex-col gap-1 py-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="min-w-0 flex-1 truncate text-body underline-offset-4 decoration-1 group-hover:underline">
                {previewOf(c)}
              </span>
              <MetaText className="flex shrink-0 gap-4">
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
  );
}
