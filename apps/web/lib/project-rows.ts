import type { DemoConversation, DemoKnowledgeSource, DemoProject } from "@askwell/shared";
import { latestActivity } from "./conversations";

export type ProjectRow = {
  project: DemoProject;
  sources: number;
  conversations: number;
  messages: number;
  /** ISO time of the latest change: the project itself, a source added, or a conversation message. */
  updatedAt: string;
};

/** One row per project for the Projects table, in the store's order. */
export function projectRows(
  projects: readonly DemoProject[],
  sources: readonly DemoKnowledgeSource[],
  conversations: readonly DemoConversation[],
): ProjectRow[] {
  return projects.map((project) => {
    const mySources = sources.filter((s) => s.projectId === project.id);
    const myConversations = conversations.filter((c) => c.projectId === project.id);
    const times = [
      Date.parse(project.createdAt),
      ...mySources.map((s) => Date.parse(s.createdAt)),
      ...myConversations.map(latestActivity),
    ].filter((t) => !Number.isNaN(t));
    return {
      project,
      sources: mySources.length,
      conversations: myConversations.length,
      messages: project.messagesUsed,
      updatedAt: new Date(times.length ? Math.max(...times) : 0).toISOString(),
    };
  });
}
