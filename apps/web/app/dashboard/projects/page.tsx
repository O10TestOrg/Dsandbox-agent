"use client";

import { useMemo } from "react";
import { Button } from "../../../components/Button";
import { EmptyState } from "../../../components/EmptyState";
import { Table, type Column } from "../../../components/Table";
import { Eyebrow } from "../../../components/Text";
import { ProjectForm } from "../../../components/ProjectForm";
import { LoadingScreen, TableSkeleton } from "../../../components/Skeleton";
import { useDemoStore } from "../../../lib/use-demo-store";
import { useHydrated } from "../../../lib/use-hydrated";
import { projectRows, type ProjectRow } from "../../../lib/project-rows";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });
const fmt = new Intl.NumberFormat("en-US");

const COLUMNS: Column<ProjectRow>[] = [
  { key: "name", header: "Name", primary: true, cell: (r) => r.project.name },
  { key: "sources", header: "Sources", numeric: true, cell: (r) => fmt.format(r.sources) },
  { key: "conversations", header: "Conversations", numeric: true, cell: (r) => fmt.format(r.conversations) },
  { key: "messages", header: "Messages", numeric: true, cell: (r) => fmt.format(r.messages) },
  {
    key: "updated",
    header: "Updated",
    cell: (r) => (
      <time dateTime={r.updatedAt} className="tabular-nums text-muted">
        {formatDate(r.updatedAt)}
      </time>
    ),
  },
];

export default function ProjectsPage() {
  const { projects, sources, conversations, createProject, reset } = useDemoStore();
  const rows = useMemo(() => projectRows(projects, sources, conversations), [projects, sources, conversations]);
  // Saved data lives in the browser; render the list only once the client has it, to match the server HTML.
  const hydrated = useHydrated();

  return (
    <section className="space-y-10" aria-labelledby="projects-heading">
      <div className="space-y-2">
        <Eyebrow>Dashboard</Eyebrow>
        <h1 id="projects-heading" className="text-heading">
          Projects
        </h1>
      </div>
      <ProjectForm submitLabel="Add project" onSubmit={(name) => createProject(name)} />
      {!hydrated ? (
        <LoadingScreen>
          <TableSkeleton columns={5} />
        </LoadingScreen>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No projects yet"
          action={
            <Button variant="secondary" onClick={reset}>
              Reset demo
            </Button>
          }
        >
          Add one above, or bring back the sample projects.
        </EmptyState>
      ) : (
        <Table
          label="Projects"
          columns={COLUMNS}
          rows={rows}
          rowKey={(r) => r.project.id}
          rowHref={(r) => `/dashboard/projects/${encodeURIComponent(r.project.id)}`}
        />
      )}
    </section>
  );
}
