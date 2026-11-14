"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { GHOST_BUTTON } from "../../../../components/Button";
import { ProjectForm } from "../../../../components/ProjectForm";
import { ProjectTabs } from "../../../../components/ProjectTabs";
import { LoadingScreen, Skeleton } from "../../../../components/Skeleton";
import { useDemoStore } from "../../../../lib/use-demo-store";
import { useHydrated } from "../../../../lib/use-hydrated";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const { projects, renameProject, deleteProject } = useDemoStore();
  const [renaming, setRenaming] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // Saved data lives in the browser, so the server can't know if this id exists. Wait for the client.
  const hydrated = useHydrated();

  if (!hydrated || deleted) {
    return (
      <LoadingScreen>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full rounded-card" />
      </LoadingScreen>
    );
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Project not found</h1>
        <p className="text-sm text-muted">It may have been deleted.</p>
        <Link href="/dashboard/projects" className="inline-flex min-h-10 items-center text-sm underline">
          Back to projects
        </Link>
      </div>
    );
  }

  function onDelete() {
    if (!project || !window.confirm(`Delete “${project.name}” and everything in it?`)) return;
    setDeleted(true);
    deleteProject(project.id);
    router.push("/dashboard/projects");
  }

  return (
    <div className="space-y-4">
      <Link href="/dashboard/projects" className="inline-flex min-h-10 items-center text-sm text-muted hover:text-ink">
        ← Projects
      </Link>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {renaming ? (
          <div className="flex-1">
            <ProjectForm
              initialName={project.name}
              submitLabel="Save"
              onSubmit={(name) => {
                renameProject(project.id, name);
                setRenaming(false);
              }}
              onCancel={() => setRenaming(false)}
            />
          </div>
        ) : (
          <h1 className="break-words text-2xl font-semibold tracking-tight">{project.name}</h1>
        )}
        {renaming ? null : (
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => setRenaming(true)} className={GHOST_BUTTON}>
              Rename
            </button>
            <button type="button" onClick={onDelete} className={`${GHOST_BUTTON} text-danger`}>
              Delete
            </button>
          </div>
        )}
      </header>
      <ProjectTabs projectId={project.id} />
      <div>{children}</div>
    </div>
  );
}
