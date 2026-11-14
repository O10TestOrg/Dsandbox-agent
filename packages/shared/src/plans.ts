export type Plan = "free" | "pro";

export interface PlanLimits {
  /** Max projects per owner. */
  projects: number;
  /** Max chat messages per project per month. */
  messagesPerMonth: number;
  /** Max knowledge sources per project. */
  knowledgeSources: number;
}

/** project.md §5. Display only: the demo never enforces these. */
export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: { projects: 1, messagesPerMonth: 100, knowledgeSources: 3 },
  pro: { projects: 5, messagesPerMonth: 2000, knowledgeSources: 25 },
};
