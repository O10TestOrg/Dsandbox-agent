import { z } from "zod";
import type { IsoDate, OkResponse } from "./common";

export const MAX_PROJECT_NAME_LENGTH = 80;
const projectName = z.string().trim().min(1).max(MAX_PROJECT_NAME_LENGTH);

export interface ProjectDto {
  id: string;
  name: string;
  publicKey: string;
  messagesUsed: number;
  /** Monthly limit from the owner's plan, so the UI never computes it. */
  messagesLimit: number;
  periodStart: IsoDate;
  createdAt: IsoDate;
}

/** GET /api/projects */
export interface ListProjectsResponse {
  projects: ProjectDto[];
}

/** POST /api/projects */
export const createProjectSchema = z.object({ name: projectName });
export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export interface CreateProjectResponse {
  project: ProjectDto;
}

/** PATCH /api/projects/:id */
export const renameProjectSchema = z.object({ name: projectName });
export type RenameProjectRequest = z.infer<typeof renameProjectSchema>;
export interface RenameProjectResponse {
  project: ProjectDto;
}

/** DELETE /api/projects/:id */
export type DeleteProjectResponse = OkResponse;
