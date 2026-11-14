import { DEMO_CONVERSATIONS, DEMO_PROJECTS } from "@askwell/shared";
import { Surface } from "../../components/Surface";
import { Eyebrow, MetaText } from "../../components/Text";

/** A static, read-only preview of one seeded chat. Rendered as text, never HTML. */
export function SampleChat() {
  const conversation = DEMO_CONVERSATIONS.find((c) => c.id === "conv-saas-1") ?? DEMO_CONVERSATIONS[0];
  if (!conversation) return null;
  const project = DEMO_PROJECTS.find((p) => p.id === conversation.projectId);

  return (
    <Surface bordered className="w-full">
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-4">
        <p className="min-w-0 truncate">{project?.name ?? "Sample project"}</p>
        <Eyebrow className="shrink-0">Demo</Eyebrow>
      </div>
      <ol className="space-y-5 px-5 py-5">
        {conversation.messages.map((m) => (
          <li key={m.id} className={m.role === "visitor" ? "bg-surface px-4 py-3" : "px-4"}>
            <MetaText>{m.role === "visitor" ? "Visitor" : "Bot"}</MetaText>
            <p className="mt-1">{m.body}</p>
          </li>
        ))}
      </ol>
    </Surface>
  );
}
