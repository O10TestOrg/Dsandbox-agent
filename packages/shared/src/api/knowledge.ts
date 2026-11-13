import { z } from "zod";
import type { IsoDate, OkResponse } from "./common";
import { idSchema } from "./common";

export const MAX_KNOWLEDGE_FILE_BYTES = 10 * 1024 * 1024;
export const KNOWLEDGE_FILE_TYPES = ["pdf", "md", "txt"] as const;
export const MAX_KNOWLEDGE_TITLE_LENGTH = 200;
export const MAX_KNOWLEDGE_TEXT_LENGTH = 200_000;

export const knowledgeFileTypeSchema = z.enum(KNOWLEDGE_FILE_TYPES);
export type KnowledgeFileType = z.infer<typeof knowledgeFileTypeSchema>;
export type KnowledgeSourceType = "text" | KnowledgeFileType;
export type KnowledgeSourceStatus = "uploading" | "processing" | "ready" | "failed";

export interface KnowledgeSourceDto {
  id: string;
  title: string;
  type: KnowledgeSourceType;
  status: KnowledgeSourceStatus;
  createdAt: IsoDate;
}

const title = z.string().trim().min(1).max(MAX_KNOWLEDGE_TITLE_LENGTH);

/** POST /api/projects/:id/knowledge (paste text) */
export const pasteKnowledgeSchema = z.object({
  title,
  content: z.string().trim().min(1, "Text is empty").max(MAX_KNOWLEDGE_TEXT_LENGTH),
});
export type PasteKnowledgeRequest = z.infer<typeof pasteKnowledgeSchema>;
export interface PasteKnowledgeResponse {
  source: KnowledgeSourceDto;
}

/** POST /api/projects/:id/knowledge/upload-url */
export const uploadUrlRequestSchema = z.object({
  filename: title,
  type: knowledgeFileTypeSchema,
  size: z.number().int().positive().max(MAX_KNOWLEDGE_FILE_BYTES, "File is larger than 10 MB"),
});
export type UploadUrlRequest = z.infer<typeof uploadUrlRequestSchema>;
export interface UploadUrlResponse {
  sourceId: string;
  /** Random path under the project, for `upload()` from `@vercel/blob/client`. */
  pathname: string;
  /** Vercel Blob client-upload token. */
  clientToken: string;
}

/** POST /api/projects/:id/knowledge/finalize */
export const finalizeUploadSchema = z.object({ sourceId: idSchema });
export type FinalizeUploadRequest = z.infer<typeof finalizeUploadSchema>;
export interface FinalizeUploadResponse {
  source: KnowledgeSourceDto;
}

/** DELETE /api/knowledge/:id */
export type DeleteKnowledgeResponse = OkResponse;
