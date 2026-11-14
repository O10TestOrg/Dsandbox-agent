"use client";

import { PLAN_LIMITS } from "@askwell/shared";
import { Notice } from "../../../../../components/Signal";
import { Eyebrow, MetaText } from "../../../../../components/Text";
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
    <div className="space-y-6">
      <Surface className="space-y-6 p-6 sm:p-8">
        <div className="space-y-2">
          <Eyebrow>Messages this month</Eyebrow>
          <p className="text-display tabular-nums">
            {fmt.format(used)}
            <span className="text-heading text-muted"> / {fmt.format(FREE_LIMIT)}</span>
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Messages used this month"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${fmt.format(used)} of ${fmt.format(FREE_LIMIT)} messages`}
          className="h-2 w-full overflow-hidden rounded-square bg-line"
        >
          <div
            className="h-full w-full origin-left bg-ink transition-transform motion-reduce:transition-none"
            style={{ transform: `scaleX(${percent / 100})` }}
          />
        </div>
        <MetaText className="block">{percent}% of the Free plan</MetaText>
      </Surface>
      <Notice>Demo. Nothing is charged and no messages are blocked, even over the limit.</Notice>
    </div>
  );
}
