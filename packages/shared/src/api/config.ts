import { z } from "zod";
import { widgetConfigSchema, type WidgetConfig } from "../widget-config";

/** PATCH /api/projects/:id/config. Partial; the server answers 402 on Free. */
export const updateConfigSchema = widgetConfigSchema
  .partial()
  .strict()
  .refine((v) => Object.keys(v).length > 0, "Send at least one field");
export type UpdateConfigRequest = z.infer<typeof updateConfigSchema>;
export interface UpdateConfigResponse {
  config: WidgetConfig;
}
