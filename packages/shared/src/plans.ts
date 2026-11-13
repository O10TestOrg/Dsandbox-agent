import type { WidgetAnimation, WidgetPosition } from "./widget-config";

export type Plan = "free" | "pro";

export interface PlanLimits {
  /** Max projects per owner. */
  projects: number;
  /** Max accepted chat messages per project per month. */
  messagesPerMonth: number;
  /** Max knowledge sources (files + pasted text) per project. */
  knowledgeSources: number;
  /** Which widget options the plan may change. */
  widget: {
    buttonColor: boolean;
    positions: readonly WidgetPosition[];
    label: boolean;
    animations: readonly WidgetAnimation[];
    headerText: boolean;
    /** Plan may hide the "Powered by" badge. */
    hideBadge: boolean;
  };
}

/** project.md §5. The one place plan limits live. */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    projects: 1,
    messagesPerMonth: 100,
    knowledgeSources: 3,
    widget: {
      buttonColor: false,
      positions: ["bottom-right"],
      label: false,
      animations: ["fade"],
      headerText: false,
      hideBadge: false,
    },
  },
  pro: {
    projects: 5,
    messagesPerMonth: 2000,
    knowledgeSources: 25,
    widget: {
      buttonColor: true,
      positions: ["bottom-right", "bottom-left", "top-right", "top-left"],
      label: true,
      animations: ["fade", "slide", "scale"],
      headerText: true,
      hideBadge: true,
    },
  },
};
