"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "../../../../components/Button";
import { EmptyState } from "../../../../components/EmptyState";
import { Icon } from "../../../../components/Icon";
import { ProjectForm } from "../../../../components/ProjectForm";
import { LoadingScreen, Skeleton } from "../../../../components/Skeleton";
import { Eyebrow } from "../../../../components/Text";
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
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full rounded-square" />
      </LoadingScreen>
    );
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <div className="space-y-6">
        <h1 className="text-heading">Project not found</h1>
        <EmptyState title="This project doesn't exist" action={<ButtonLink href="/dashboard/projects" variant="secondary">All projects</ButtonLink>}>
          It may have been deleted, or the link is wrong.
        </EmptyState>
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
    <div className="space-y-8">
      <div className="space-y-4">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
            <div className="min-w-0 space-y-2">
              <Eyebrow>Project</Eyebrow>
              <h1 className="break-words text-heading">{project.name}</h1>
            </div>
          )}
          {renaming ? null : (
            <div className="-ml-6 flex shrink-0 gap-1 sm:ml-0">
              <Button variant="quiet" onClick={() => setRenaming(true)}>
                Rename
              </Button>
              <Button variant="quiet" onClick={onDelete}>
                <Icon name="trash" />
                Delete
              </Button>
            </div>
          )}
        </header>
      </div>
      <div>{children}</div>
    </div>
  );
}
