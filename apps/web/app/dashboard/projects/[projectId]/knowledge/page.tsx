"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { DemoKnowledgeSourceStatus } from "@askwell/shared";
import { Icon } from "../../../../../components/Icon";
import { EmptyState } from "../../../../../components/EmptyState";
import { StatusDot, type Tone } from "../../../../../components/Signal";
import { Surface } from "../../../../../components/Surface";
import { Eyebrow, MetaText } from "../../../../../components/Text";
import { KnowledgeAddForm } from "../../../../../components/KnowledgeAddForm";
import { msUntilReady } from "../../../../../lib/knowledge";
import { useDemoStore } from "../../../../../lib/use-demo-store";

// Colour only signals state: a dot before the word, the word stays ink.
const TONE: Record<DemoKnowledgeSourceStatus, Tone | "neutral"> = {
  processing: "neutral",
  ready: "success",
  failed: "danger",
};

const STATUS_LABEL: Record<DemoKnowledgeSourceStatus, string> = {
  processing: "Processing",
  ready: "Ready",
  failed: "Failed",
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
    <section className="space-y-10" aria-labelledby="knowledge-heading">
      <div className="space-y-2">
        <h2 id="knowledge-heading" className="text-heading">
          Knowledge
        </h2>
        <p className="text-body text-muted">What your bot answers from.</p>
      </div>
      <Surface className="p-6 sm:p-8">
        <KnowledgeAddForm onAdd={(source) => addSource(projectId, source)} />
      </Surface>
      {mine.length === 0 ? (
        <EmptyState title="No knowledge yet">Add text or a file above so your bot can answer.</EmptyState>
      ) : (
        <div className="space-y-2">
          <Eyebrow>Sources</Eyebrow>
          <ul className="divide-y divide-line border-y border-line">
            {mine.map((source) => (
              <li key={source.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="break-words text-body">{source.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-3">
                    <MetaText className="uppercase">{source.type}</MetaText>
                    <span className="inline-flex items-center gap-1.5 text-caption text-ink">
                      <StatusDot tone={TONE[source.status]} />
                      {STATUS_LABEL[source.status]}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteSource(source.id)}
                  aria-label={`Delete ${source.title}`}
                  className="inline-flex size-12 shrink-0 items-center justify-center rounded-pill text-muted transition-colors hover:bg-surface hover:text-ink"
                >
                  <Icon name="trash" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
