"use client";

import Link from "next/link";
import { EmptyState } from "../../../components/EmptyState";
import { GlassCard } from "../../../components/GlassCard";
import { ProjectForm } from "../../../components/ProjectForm";
import { useDemoStore } from "../../../lib/use-demo-store";
import { useHydrated } from "../../../lib/use-hydrated";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });

export default function ProjectsPage() {
  const { projects, createProject } = useDemoStore();
  // Saved data lives in the browser; render the list only once the client has it, to match the server HTML.
  const hydrated = useHydrated();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <ProjectForm submitLabel="New project" onSubmit={(name) => createProject(name)} />
      {!hydrated ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects yet">Create one above, or use Reset demo to bring back the samples.</EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/dashboard/projects/${encodeURIComponent(project.id)}`} className="block">
                <GlassCard className="p-5 transition hover:bg-raised">
                  <h2 className="break-words font-semibold">{project.name}</h2>
                  <p className="mt-1 text-sm text-muted">Created {formatDate(project.createdAt)}</p>
                  <p className="mt-3 text-sm">{project.messagesUsed.toLocaleString("en-US")} messages used</p>
                </GlassCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
