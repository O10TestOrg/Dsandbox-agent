"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import type { DemoKnowledgeSourceStatus } from "@askwell/shared";
import { Icon } from "../../../../../components/Icon";
import { EmptyState } from "../../../../../components/EmptyState";
import { type Tone } from "../../../../../components/Signal";
import { StatusBadge } from "../../../../../components/StatusBadge";
import { Surface } from "../../../../../components/Surface";
import { Table } from "../../../../../components/Table";
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

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });
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
        <Table
          label="Sources"
          columns={[
            { key: "name", header: "Name", primary: true, cell: (s) => s.title },
            {
              key: "type",
              header: "Type",
              cell: (s) => <span className="uppercase text-muted">{s.type}</span>,
            },
            {
              key: "status",
              header: "Status",
              cell: (s) => <StatusBadge tone={TONE[s.status]}>{STATUS_LABEL[s.status]}</StatusBadge>,
            },
            {
              key: "added",
              header: "Added",
              cell: (s) => (
                <time dateTime={s.createdAt} className="tabular-nums text-muted">
                  {formatDate(s.createdAt)}
                </time>
              ),
            },
            {
              key: "delete",
              header: "Delete",
              action: true,
              cell: (s) => (
                <button
                  type="button"
                  onClick={() => deleteSource(s.id)}
                  aria-label={`Delete ${s.title}`}
                  className="inline-flex size-12 items-center justify-center rounded-pill text-muted transition-colors hover:bg-paper hover:text-ink"
                >
                  <Icon name="trash" />
                </button>
              ),
            },
          ]}
          rows={mine}
          rowKey={(s) => s.id}
        />
      )}
    </section>
  );
}
