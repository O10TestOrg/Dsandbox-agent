"use client";

import Link from "next/link";
import { Button } from "../../../components/Button";
import { EmptyState } from "../../../components/EmptyState";
import { Eyebrow, MetaText } from "../../../components/Text";
import { Surface } from "../../../components/Surface";
import { ProjectForm } from "../../../components/ProjectForm";
import { LoadingScreen, Skeleton } from "../../../components/Skeleton";
import { useDemoStore } from "../../../lib/use-demo-store";
import { useHydrated } from "../../../lib/use-hydrated";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });

export default function ProjectsPage() {
  const { projects, createProject, reset } = useDemoStore();
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <li key={i}>
                <Skeleton className="h-32 rounded-square" />
              </li>
            ))}
          </ul>
        </LoadingScreen>
      ) : projects.length === 0 ? (
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
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                href={`/dashboard/projects/${encodeURIComponent(project.id)}`}
                className="group block h-full"
              >
                <Surface className="h-full p-6">
                <h2 className="break-words text-body underline-offset-4 decoration-1 group-hover:underline">
                  {project.name}
                </h2>
                <MetaText className="mt-1 block">Created {formatDate(project.createdAt)}</MetaText>
                <p className="mt-6 text-body text-muted">
                  <strong className="tabular-nums">{project.messagesUsed.toLocaleString("en-US")}</strong> messages
                  used
                </p>
                </Surface>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
