import { DEMO_CONVERSATIONS, DEMO_PROJECTS } from "@askwell/shared";
import { Surface } from "../../components/Surface";

/** A static, read-only preview of one seeded chat. Rendered as text, never HTML. */
export function SampleChat() {
  const conversation = DEMO_CONVERSATIONS.find((c) => c.id === "conv-saas-1") ?? DEMO_CONVERSATIONS[0];
  if (!conversation) return null;
  const project = DEMO_PROJECTS.find((p) => p.id === conversation.projectId);

  return (
    <Surface className="mx-auto w-full max-w-md p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <p className="min-w-0 truncate text-sm">{project?.name ?? "Sample project"}</p>
        <span className="shrink-0 rounded-pill border border-line px-2 py-0.5 text-xs text-muted">Demo</span>
      </div>
      <ul className="mt-4 space-y-3">
        {conversation.messages.map((m) => (
          <li key={m.id} className={`flex ${m.role === "visitor" ? "justify-end" : "justify-start"}`}>
            <p
              className={`max-w-[85%] rounded-square px-3 py-2 text-sm ${
                m.role === "visitor" ? "bg-ink text-paper" : "border border-line"
              }`}
            >
              {m.body}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">Sample chat from the demo data. Nothing here is live.</p>
    </Surface>
  );
}
