import { PLAN_LIMITS, type PlanLimits } from "@askwell/shared";
import { Surface } from "../../components/Surface";
import { Eyebrow } from "../../components/Text";

const fmt = (n: number) => n.toLocaleString("en-US");

const plans: { name: string; limits: PlanLimits; extras: string[] }[] = [
  { name: "Free", limits: PLAN_LIMITS.free, extras: ["Default widget", "“Powered by” badge shown"] },
  { name: "Pro", limits: PLAN_LIMITS.pro, extras: ["Full widget customization", "“Powered by” badge hidden"] },
];

/** Display only (project.md §5). Nothing is gated or charged. */
export function Pricing() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {plans.map((p) => (
        <li key={p.name} className="reveal">
          <Surface className="h-full p-6">
            <Eyebrow>{p.name}</Eyebrow>
            <ul className="mt-4 space-y-2 text-muted">
              <li>
                <strong className="tabular-nums">{p.limits.projects}</strong>{" "}
                {p.limits.projects === 1 ? "project" : "projects"}
              </li>
              <li>
                <strong className="tabular-nums">{fmt(p.limits.messagesPerMonth)}</strong> messages a month per project
              </li>
              <li>
                <strong className="tabular-nums">{p.limits.knowledgeSources}</strong> knowledge sources per project
              </li>
              {p.extras.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Surface>
        </li>
      ))}
    </ul>
  );
}
