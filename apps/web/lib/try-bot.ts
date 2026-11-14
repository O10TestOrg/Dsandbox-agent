import { DEMO_MESSAGE_MAX_CHARS, getScriptedReply } from "@askwell/shared";
import type { DemoActions } from "./demo-store";

/** How long the bot "types" before its reply lands. */
const TYPING_DELAY_MS = 800;

type SendActions = Pick<DemoActions, "startConversation" | "appendMessage">;

type Validation = { ok: true; text: string } | { ok: false; error: string };

/** The message trimmed, or why it can't be sent. */
export function validateMessage(raw: string): Validation {
  const text = raw.trim();
  if (!text) return { ok: false, error: "Type a message first." };
  if (text.length > DEMO_MESSAGE_MAX_CHARS) {
    return { ok: false, error: `Messages can be at most ${DEMO_MESSAGE_MAX_CHARS} characters.` };
  }
  return { ok: true, text };
}

type SendResult = { ok: true; conversationId: string } | { ok: false; error: string };

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Sends a visitor message and records the scripted bot reply after `wait()`.
 * `conversationId: null` starts a new conversation. Only the visitor message counts toward usage (the store does that).
 */
export async function sendMessage(
  actions: SendActions,
  input: { projectId: string; conversationId: string | null; text: string },
  wait: () => Promise<void> = () => delay(TYPING_DELAY_MS),
  /** Called once the visitor message is stored, before the typing delay, so the UI can show the chat right away. */
  onStarted?: (conversationId: string) => void,
): Promise<SendResult> {
  const checked = validateMessage(input.text);
  if (!checked.ok) return checked;

  const missing = { ok: false, error: "This chat no longer exists. Start a new chat." } as const;
  const conversationId = input.conversationId ?? actions.startConversation(input.projectId);
  if (!conversationId || !actions.appendMessage(conversationId, "visitor", checked.text)) return missing;

  onStarted?.(conversationId);
  await wait();
  // Empty id: the conversation vanished while the bot was typing (e.g. the demo was reset).
  if (!actions.appendMessage(conversationId, "bot", getScriptedReply(input.projectId, checked.text))) return missing;
  return { ok: true, conversationId };
}

const SAMPLE_QUESTIONS: Record<string, string[]> = {
  "demo-coffee": ["What are your opening hours?", "Do you have oat milk?", "Is there wifi?"],
  "demo-saas": ["How much does it cost?", "Does it work with Slack?", "How do I get started?"],
  "demo-store": ["How long does shipping take?", "Can I return an item?", "Do you sell gift cards?"],
};

const GENERIC_QUESTIONS = ["What are your opening hours?", "How much does it cost?"];

/** 2–3 questions the bot can answer for a sample project, or generic ones for a project the user made. */
export function suggestedQuestions(projectId: string): string[] {
  return Object.hasOwn(SAMPLE_QUESTIONS, projectId) ? SAMPLE_QUESTIONS[projectId]! : GENERIC_QUESTIONS;
}
