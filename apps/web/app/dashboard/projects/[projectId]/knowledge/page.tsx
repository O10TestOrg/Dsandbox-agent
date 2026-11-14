"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { DemoKnowledgeSourceStatus } from "@askwell/shared";
import { EmptyState } from "../../../../../components/EmptyState";
import { GlassCard } from "../../../../../components/GlassCard";
import { KnowledgeAddForm } from "../../../../../components/KnowledgeAddForm";
import { msUntilReady } from "../../../../../lib/knowledge";
import { useDemoStore } from "../../../../../lib/use-demo-store";

const BADGE: Record<DemoKnowledgeSourceStatus, string> = {
  processing: "border-line text-muted",
  ready: "border-ink text-ink",
  failed: "border-danger text-danger",
};

export default function KnowledgePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { sources, addSource, setSourceStatus, deleteSource } = useDemoStore();
  const mine = useMemo(() => sources.filter((s) => s.projectId === projectId), [sources, projectId]);

  // Flip each processing source to ready once it is 2 s old. A source that was already older when the
  // page loaded flips right away, so leaving the page mid-processing never leaves it stuck.
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const source of mine) {
      const wait = msUntilReady(source, Date.now());
      if (wait !== null) timers.push(setTimeout(() => setSourceStatus(source.id, "ready"), wait));
    }
    return () => timers.forEach(clearTimeout);
  }, [mine, setSourceStatus]);

  return (
    <section className="space-y-6">
      <GlassCard className="p-5">
        <KnowledgeAddForm onAdd={(source) => addSource(projectId, source)} />
      </GlassCard>
      {mine.length === 0 ? (
        <EmptyState title="No knowledge yet">Add text or a file and your bot can learn from it.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {mine.map((source) => (
            <li key={source.id}>
              <GlassCard className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="break-words font-medium">{source.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                    <span className="uppercase">{source.type}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${BADGE[source.status]}`}>
                      {source.status}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteSource(source.id)}
                  aria-label={`Delete ${source.title}`}
                  className="shrink-0 rounded-control border border-line px-3 py-2 text-sm transition hover:bg-raised"
                >
                  Delete
                </button>
              </GlassCard>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
