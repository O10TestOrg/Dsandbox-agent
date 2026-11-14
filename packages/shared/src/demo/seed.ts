import type {
  DemoConversation,
  DemoKnowledgeSource,
  DemoKnowledgeSourceStatus,
  DemoKnowledgeSourceType,
  DemoProject,
} from "./types";
import { DEMO_UNKNOWN_REPLY } from "./replies";

export const DEMO_MESSAGE_MAX_CHARS = 1000;

const project = (id: string, name: string, createdAt: string, messagesUsed: number): DemoProject => ({
  id,
  name,
  createdAt,
  messagesUsed,
});

const source = (
  id: string,
  projectId: string,
  title: string,
  type: DemoKnowledgeSourceType,
  status: DemoKnowledgeSourceStatus,
  createdAt: string,
): DemoKnowledgeSource => ({ id, projectId, title, type, status, createdAt });

export const DEMO_PROJECTS: DemoProject[] = [
  project("demo-coffee", "Bean & Brew Coffee", "2026-09-01T09:00:00.000Z", 24),
  project("demo-saas", "Taskly (SaaS tool)", "2026-09-08T10:30:00.000Z", 41),
  project("demo-store", "Northwind Outfitters", "2026-09-15T14:00:00.000Z", 67),
];

export const DEMO_KNOWLEDGE_SOURCES: DemoKnowledgeSource[] = [
  source("ks-coffee-1", "demo-coffee", "Opening hours and location", "text", "ready", "2026-09-01T09:10:00.000Z"),
  source("ks-coffee-2", "demo-coffee", "Menu.pdf", "pdf", "ready", "2026-09-01T09:20:00.000Z"),
  source("ks-coffee-3", "demo-coffee", "Allergen notes", "md", "ready", "2026-09-02T11:00:00.000Z"),
  source("ks-saas-1", "demo-saas", "Pricing plans", "md", "ready", "2026-09-08T10:40:00.000Z"),
  source("ks-saas-2", "demo-saas", "Getting started guide", "txt", "ready", "2026-09-08T11:00:00.000Z"),
  source("ks-saas-3", "demo-saas", "Integrations list", "text", "processing", "2026-09-09T08:15:00.000Z"),
  source("ks-store-1", "demo-store", "Shipping and delivery", "text", "ready", "2026-09-15T14:10:00.000Z"),
  source("ks-store-2", "demo-store", "Returns policy.pdf", "pdf", "ready", "2026-09-15T14:30:00.000Z"),
  source("ks-store-3", "demo-store", "Size guide", "md", "failed", "2026-09-16T09:00:00.000Z"),
  source("ks-store-4", "demo-store", "Gift cards FAQ", "txt", "ready", "2026-09-16T09:30:00.000Z"),
]

const UNKNOWN_PLACEHOLDER = "{unknown}";

/**
 * Seed conversations in a compact text format: a header line `<id> <projectId> <start time>`,
 * then one line per message (`>` visitor, `<` bot), then a blank line.
 * Each visitor message follows the previous exchange by a minute; a bot reply follows its question by 3 s.
 */
const CONVERSATION_DATA = `
conv-coffee-1 demo-coffee 2026-10-01T08:05:00Z
> What time do you open?
< We're open 7am–6pm Monday to Saturday, and 8am–4pm on Sundays.

conv-coffee-2 demo-coffee 2026-10-03T12:20:00Z
> Do you have oat milk?
< Yes! Oat, soy and almond milk are available for no extra charge.
> Great, and is there wifi?
< Free wifi for everyone. Just ask at the counter for the password.

conv-coffee-3 demo-coffee 2026-10-06T16:40:00Z
> Can I book the shop for a birthday?
< {unknown}

conv-saas-1 demo-saas 2026-10-02T09:10:00Z
> How much does Taskly cost?
< Taskly is free for up to 3 users. Team is $8 per user per month.
> Is there a free trial of Team?
< Yes, Team comes with a 14-day free trial. No card needed.

conv-saas-2 demo-saas 2026-10-04T13:00:00Z
> Does it work with Slack?
< Taskly connects with Slack, Google Calendar and GitHub from Settings → Integrations.

conv-saas-3 demo-saas 2026-10-07T15:30:00Z
> How do I get started?
< Create a workspace, add your first project and invite your team. It takes about two minutes.
> Can I export my tasks?
< {unknown}

conv-store-1 demo-store 2026-10-01T18:00:00Z
> How long does shipping take?
< Standard shipping takes 3–5 working days. Orders over $50 ship free.

conv-store-2 demo-store 2026-10-05T10:45:00Z
> Can I return a jacket?
< Of course. Unworn items can be returned within 30 days for a full refund.
> Who pays for return postage?
< Returns are free. Use the prepaid label in your parcel.

conv-store-3 demo-store 2026-10-09T20:15:00Z
> Do you sell gift cards?
< Yes, digital gift cards from $10 to $200. They're emailed instantly and never expire.

`;

const messageTime = (start: string, index: number): string =>
  new Date(Date.parse(start) + (Math.floor(index / 2) * 60 + (index % 2) * 3) * 1000).toISOString();

const parseConversation = (block: string): DemoConversation => {
  const [header = "", ...lines] = block.split("\n");
  const [id = "", projectId = "", start = ""] = header.split(" ");
  return {
    id,
    projectId,
    createdAt: messageTime(start, 0),
    messages: lines.map((line, i) => {
      const body = line.slice(2);
      return {
        id: `${id}-m${i + 1}`,
        role: line.startsWith(">") ? "visitor" : "bot",
        body: body === UNKNOWN_PLACEHOLDER ? DEMO_UNKNOWN_REPLY : body,
        createdAt: messageTime(start, i),
      };
    }),
  };
};

export const DEMO_CONVERSATIONS: DemoConversation[] = CONVERSATION_DATA.trim()
  .split("\n\n")
  .map(parseConversation);
