"use client";

import type { DemoConversation } from "@askwell/shared";
import { ButtonLink } from "../../../../../components/Button";
import { EmptyState } from "../../../../../components/EmptyState";
import { Table, type Column } from "../../../../../components/Table";
import { formatTime, previewOf, sortNewestFirst } from "../../../../../lib/conversations";
import { useDemoStore } from "../../../../../lib/use-demo-store";

const COLUMNS: Column<DemoConversation>[] = [
  { key: "preview", header: "Preview", primary: true, cell: (c) => previewOf(c) },
  { key: "messages", header: "Messages", numeric: true, cell: (c) => c.messages.length },
  {
    key: "started",
    header: "Started",
    cell: (c) => (
      <time dateTime={c.createdAt} className="tabular-nums text-muted">
        {formatTime(c.createdAt)}
      </time>
    ),
  },
];

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

  const base = `/dashboard/projects/${encodeURIComponent(projectId)}/conversations`;
  return (
    <Table
      label="Conversations"
      columns={COLUMNS}
      rows={conversations}
      rowKey={(c) => c.id}
      rowHref={(c) => `${base}/${encodeURIComponent(c.id)}`}
    />
  );
}
