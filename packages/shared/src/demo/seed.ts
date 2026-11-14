import type {
  DemoConversation,
  DemoKnowledgeSource,
  DemoKnowledgeSourceStatus,
  DemoKnowledgeSourceType,
  DemoMessage,
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

/** A message tuple: [role, body, time]. The id is built from the conversation id and position. */
type Line = [role: DemoMessage["role"], body: string, createdAt: string];

const convo = (id: string, projectId: string, ...lines: Line[]): DemoConversation => ({
  id,
  projectId,
  createdAt: lines[0]![2],
  messages: lines.map(([role, body, createdAt], i) => ({ id: `${id}-m${i + 1}`, role, body, createdAt })),
});

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

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  convo(
    "conv-coffee-1",
    "demo-coffee",
    ["visitor", "What time do you open?", "2026-10-01T08:05:00.000Z"],
    ["bot", "We're open 7am–6pm Monday to Saturday, and 8am–4pm on Sundays.", "2026-10-01T08:05:03.000Z"],
  ),
  convo(
    "conv-coffee-2",
    "demo-coffee",
    ["visitor", "Do you have oat milk?", "2026-10-03T12:20:00.000Z"],
    ["bot", "Yes! Oat, soy and almond milk are available for no extra charge.", "2026-10-03T12:20:04.000Z"],
    ["visitor", "Great, and is there wifi?", "2026-10-03T12:21:00.000Z"],
    ["bot", "Free wifi for everyone. Just ask at the counter for the password.", "2026-10-03T12:21:03.000Z"],
  ),
  convo(
    "conv-coffee-3",
    "demo-coffee",
    ["visitor", "Can I book the shop for a birthday?", "2026-10-06T16:40:00.000Z"],
    ["bot", DEMO_UNKNOWN_REPLY, "2026-10-06T16:40:03.000Z"],
  ),
  convo(
    "conv-saas-1",
    "demo-saas",
    ["visitor", "How much does Taskly cost?", "2026-10-02T09:10:00.000Z"],
    ["bot", "Taskly is free for up to 3 users. Team is $8 per user per month.", "2026-10-02T09:10:03.000Z"],
    ["visitor", "Is there a free trial of Team?", "2026-10-02T09:11:00.000Z"],
    ["bot", "Yes, Team comes with a 14-day free trial. No card needed.", "2026-10-02T09:11:03.000Z"],
  ),
  convo(
    "conv-saas-2",
    "demo-saas",
    ["visitor", "Does it work with Slack?", "2026-10-04T13:00:00.000Z"],
    ["bot", "Taskly connects with Slack, Google Calendar and GitHub from Settings → Integrations.", "2026-10-04T13:00:04.000Z"],
  ),
  convo(
    "conv-saas-3",
    "demo-saas",
    ["visitor", "How do I get started?", "2026-10-07T15:30:00.000Z"],
    ["bot", "Create a workspace, add your first project and invite your team. It takes about two minutes.", "2026-10-07T15:30:03.000Z"],
    ["visitor", "Can I export my tasks?", "2026-10-07T15:31:00.000Z"],
    ["bot", DEMO_UNKNOWN_REPLY, "2026-10-07T15:31:03.000Z"],
  ),
  convo(
    "conv-store-1",
    "demo-store",
    ["visitor", "How long does shipping take?", "2026-10-01T18:00:00.000Z"],
    ["bot", "Standard shipping takes 3–5 working days. Orders over $50 ship free.", "2026-10-01T18:00:03.000Z"],
  ),
  convo(
    "conv-store-2",
    "demo-store",
    ["visitor", "Can I return a jacket?", "2026-10-05T10:45:00.000Z"],
    ["bot", "Of course. Unworn items can be returned within 30 days for a full refund.", "2026-10-05T10:45:04.000Z"],
    ["visitor", "Who pays for return postage?", "2026-10-05T10:46:00.000Z"],
    ["bot", "Returns are free. Use the prepaid label in your parcel.", "2026-10-05T10:46:03.000Z"],
  ),
  convo(
    "conv-store-3",
    "demo-store",
    ["visitor", "Do you sell gift cards?", "2026-10-09T20:15:00.000Z"],
    ["bot", "Yes, digital gift cards from $10 to $200. They're emailed instantly and never expire.", "2026-10-09T20:15:03.000Z"],
  ),
]
