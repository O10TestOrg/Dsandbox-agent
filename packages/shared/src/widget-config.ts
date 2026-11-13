import { z } from "zod";

export const WIDGET_POSITIONS = ["bottom-right", "bottom-left", "top-right", "top-left"] as const;
export const WIDGET_ANIMATIONS = ["fade", "slide", "scale"] as const;

export const widgetPositionSchema = z.enum(WIDGET_POSITIONS);
export const widgetAnimationSchema = z.enum(WIDGET_ANIMATIONS);
export type WidgetPosition = z.infer<typeof widgetPositionSchema>;
export type WidgetAnimation = z.infer<typeof widgetAnimationSchema>;

export const MAX_WIDGET_LABEL_LENGTH = 40;
export const MAX_WIDGET_HEADER_LENGTH = 80;

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #1a1a1a");

export const widgetConfigSchema = z.object({
  buttonColor: hexColor,
  position: widgetPositionSchema,
  label: z.string().trim().min(1).max(MAX_WIDGET_LABEL_LENGTH),
  animation: widgetAnimationSchema,
  headerText: z.string().trim().min(1).max(MAX_WIDGET_HEADER_LENGTH),
  showBadge: z.boolean(),
});
export type WidgetConfig = z.infer<typeof widgetConfigSchema>;

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  buttonColor: "#111111",
  position: "bottom-right",
  label: "Chat with us",
  animation: "fade",
  headerText: "Ask us anything",
  showBadge: true,
};
