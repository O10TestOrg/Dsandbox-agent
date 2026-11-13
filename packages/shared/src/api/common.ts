import { z } from "zod";

export const publicKeySchema = z.string().regex(/^pk_[A-Za-z0-9_-]+$/, "Invalid public key");
export const idSchema = z.string().min(1).max(128);
/** Route params `:id`. */
export const idParamSchema = z.object({ id: idSchema });
export type IdParam = z.infer<typeof idParamSchema>;

export interface OkResponse {
  ok: true;
}
/** ISO 8601 timestamp. */
export type IsoDate = string;
