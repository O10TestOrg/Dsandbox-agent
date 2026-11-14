import Link from "next/link";
import { DEMO_CONVERSATIONS } from "@askwell/shared";
import { EmptyState } from "../../../../../components/EmptyState";
import { GlassCard } from "../../../../../components/GlassCard";
import { formatTime, latestActivity, previewOf, sortNewestFirst } from "../../../../../lib/conversations";

export const metadata = { title: "Conversations" };

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  // TODO(P3D2-T01): read from useDemoStore() once the store is merged.
  const conversations = sortNewestFirst(DEMO_CONVERSATIONS.filter((c) => c.projectId === projectId));

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>
      {conversations.length === 0 ? (
        <EmptyState title="No conversations yet">Chats with your bot will show up here.</EmptyState>
      ) : (
        <GlassCard>
          <ul className="divide-y divide-line">
            {conversations.map((c) => {
              const latest = new Date(latestActivity(c)).toISOString();
              return (
              <li key={c.id}>
                <Link
                  href={`/dashboard/projects/${encodeURIComponent(projectId)}/conversations/${encodeURIComponent(c.id)}`}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 transition-colors hover:bg-black/[0.03] focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{previewOf(c)}</span>
                  <span className="flex shrink-0 gap-3 text-xs text-muted">
                    <span>
                      {c.messages.length} {c.messages.length === 1 ? "message" : "messages"}
                    </span>
                    <time dateTime={latest}>{formatTime(latest)}</time>
                  </span>
                </Link>
              </li>
              );
            })}
          </ul>
        </GlassCard>
      )}
    </section>
  );
}
