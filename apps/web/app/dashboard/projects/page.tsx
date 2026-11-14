"use client";

import Link from "next/link";
import { EmptyState } from "../../../components/EmptyState";
import { MetaText } from "../../../components/Text";
import { Surface } from "../../../components/Surface";
import { ProjectForm } from "../../../components/ProjectForm";
import { LoadingScreen, Skeleton } from "../../../components/Skeleton";
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
      <h1 className="text-2xl tracking-tight">Projects</h1>
      <ProjectForm submitLabel="New project" onSubmit={(name) => createProject(name)} />
      {!hydrated ? (
        <LoadingScreen>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <Skeleton className="h-28 rounded-square" />
              </li>
            ))}
          </ul>
        </LoadingScreen>
      ) : projects.length === 0 ? (
        <EmptyState title="No projects yet">Create one above, or use Reset demo to bring back the samples.</EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/dashboard/projects/${encodeURIComponent(project.id)}`} className="block">
                <Surface className="p-5 transition hover:bg-surface">
                  <h2 className="break-words">{project.name}</h2>
                  <MetaText className="mt-1 block">Created {formatDate(project.createdAt)}</MetaText>
                  <p className="mt-3 text-sm">{project.messagesUsed.toLocaleString("en-US")} messages used</p>
                </Surface>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
