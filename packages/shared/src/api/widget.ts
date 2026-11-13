import { z } from "zod";
import type { WidgetConfig } from "../widget-config";
import { idSchema, publicKeySchema } from "./common";

export const MAX_MESSAGE_LENGTH = 1000;

/** GET /api/widget/config */
export const widgetConfigQuerySchema = z.object({ key: publicKeySchema });
export type WidgetConfigQuery = z.infer<typeof widgetConfigQuerySchema>;
/** Plan-applied: Free gets defaults + badge. */
export type WidgetConfigResponse = WidgetConfig;

/** POST /api/widget/chat */
export const chatRequestSchema = z.object({
  key: publicKeySchema,
  visitorId: idSchema,
  conversationId: idSchema.optional(),
  message: z.string().trim().min(1, "Message is empty").max(MAX_MESSAGE_LENGTH, "Message is too long"),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export interface ChatResponse {
  conversationId: string;
  reply: string;
}
