"use client";

import { PLAN_LIMITS } from "@askwell/shared";
import { Surface } from "../../../../../components/Surface";
import { usagePercent } from "../../../../../lib/usage";
import { useDemoStore } from "../../../../../lib/use-demo-store";

const FREE_LIMIT = PLAN_LIMITS.free.messagesPerMonth;
const fmt = new Intl.NumberFormat("en-US");

export function UsagePanel({ projectId }: { projectId: string }) {
  const { projects } = useDemoStore();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const used = project.messagesUsed;
  const percent = usagePercent(used, FREE_LIMIT);

  return (
    <Surface className="space-y-4 p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm text-muted">Messages this month</h2>
        <p className="text-2xl tabular-nums">
          {fmt.format(used)} / {fmt.format(FREE_LIMIT)}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Messages used this month"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${fmt.format(used)} of ${fmt.format(FREE_LIMIT)} messages`}
        className="h-3 w-full overflow-hidden rounded-pill bg-line"
      >
        <div
          className="h-full w-full origin-left bg-ink transition-transform motion-reduce:transition-none"
          style={{ transform: `scaleX(${percent / 100})` }}
        />
      </div>
      <p className="text-sm text-muted">
        This project is on the Free plan. This is a demo: nothing is charged and no messages are blocked, even over the
        limit.
      </p>
    </Surface>
  );
}
