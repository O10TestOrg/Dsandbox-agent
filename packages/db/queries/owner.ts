import { and, desc, eq } from "drizzle-orm";
import type { Plan } from "@askwell/shared";
import { projects, user } from "../schema";
import type { Db } from "./types";

export type Project = typeof projects.$inferSelect;

/**
 * The project, or `null` when it doesn't exist OR belongs to someone else.
 * The caller turns `null` into 404, so a foreign ID looks the same as a missing one.
 */
export async function getOwnedProject(db: Db, userId: string, projectId: string): Promise<Project | null> {
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, userId)))
    .limit(1);
  return row ?? null;
}

/** Only this user's projects, newest first. */
export function listOwnedProjects(db: Db, userId: string): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, userId))
    .orderBy(desc(projects.createdAt), desc(projects.id));
}

/** The plan stored on `user.plan`, or `null` for an unknown user. Never trust the client for this. */
export async function getUserPlan(db: Db, userId: string): Promise<Plan | null> {
  const [row] = await db.select({ plan: user.plan }).from(user).where(eq(user.id, userId)).limit(1);
  return row ? (row.plan as Plan) : null;
}
