"use client";

import { PLAN_LIMITS } from "@askwell/shared";
import { Notice } from "../../../../../components/Signal";
import { StatStrip } from "../../../../../components/StatStrip";
import { MetaText } from "../../../../../components/Text";
import { usagePercent } from "../../../../../lib/usage";
import { useDemoStore } from "../../../../../lib/use-demo-store";

const FREE_LIMIT = PLAN_LIMITS.free.messagesPerMonth;
const SOURCE_LIMIT = PLAN_LIMITS.free.knowledgeSources;
const fmt = new Intl.NumberFormat("en-US");

export function UsagePanel({ projectId }: { projectId: string }) {
  const { projects, sources } = useDemoStore();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  const sourceCount = sources.filter((s) => s.projectId === projectId).length;

  const used = project.messagesUsed;
  const percent = usagePercent(used, FREE_LIMIT);

  return (
    <div className="space-y-6">
      <StatStrip
        label="Usage this month"
        stats={[
          { label: "Messages", value: fmt.format(used), caption: "This month" },
          { label: "Limit", value: fmt.format(FREE_LIMIT), caption: "Free plan, per month" },
          {
            label: "Sources",
            value: fmt.format(sourceCount),
            caption: `Of ${fmt.format(SOURCE_LIMIT)} on the Free plan`,
          },
        ]}
      />
      <div className="space-y-3">
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
      </div>
      <Notice>Demo. Nothing is charged and no messages are blocked, even over the limit.</Notice>
    </div>
  );
}
