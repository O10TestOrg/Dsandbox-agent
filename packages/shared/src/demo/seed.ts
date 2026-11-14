import type { DemoConversation, DemoKnowledgeSource, DemoMessage, DemoProject } from "./types";

export const DEMO_MESSAGE_MAX_CHARS = 1000;

export const DEMO_PROJECTS: DemoProject[] = [
  { id: "demo-coffee", name: "Bean & Brew Coffee", createdAt: "2026-09-01T09:00:00.000Z", messagesUsed: 24 },
  { id: "demo-saas", name: "Taskly (SaaS tool)", createdAt: "2026-09-08T10:30:00.000Z", messagesUsed: 41 },
  { id: "demo-store", name: "Northwind Outfitters", createdAt: "2026-09-15T14:00:00.000Z", messagesUsed: 67 },
];

export const DEMO_KNOWLEDGE_SOURCES: DemoKnowledgeSource[] = [
  { id: "ks-coffee-1", projectId: "demo-coffee", title: "Opening hours and location", type: "text", status: "ready", createdAt: "2026-09-01T09:10:00.000Z" },
  { id: "ks-coffee-2", projectId: "demo-coffee", title: "Menu.pdf", type: "pdf", status: "ready", createdAt: "2026-09-01T09:20:00.000Z" },
  { id: "ks-coffee-3", projectId: "demo-coffee", title: "Allergen notes", type: "md", status: "ready", createdAt: "2026-09-02T11:00:00.000Z" },
  { id: "ks-saas-1", projectId: "demo-saas", title: "Pricing plans", type: "md", status: "ready", createdAt: "2026-09-08T10:40:00.000Z" },
  { id: "ks-saas-2", projectId: "demo-saas", title: "Getting started guide", type: "txt", status: "ready", createdAt: "2026-09-08T11:00:00.000Z" },
  { id: "ks-saas-3", projectId: "demo-saas", title: "Integrations list", type: "text", status: "processing", createdAt: "2026-09-09T08:15:00.000Z" },
  { id: "ks-store-1", projectId: "demo-store", title: "Shipping and delivery", type: "text", status: "ready", createdAt: "2026-09-15T14:10:00.000Z" },
  { id: "ks-store-2", projectId: "demo-store", title: "Returns policy.pdf", type: "pdf", status: "ready", createdAt: "2026-09-15T14:30:00.000Z" },
  { id: "ks-store-3", projectId: "demo-store", title: "Size guide", type: "md", status: "failed", createdAt: "2026-09-16T09:00:00.000Z" },
  { id: "ks-store-4", projectId: "demo-store", title: "Gift cards FAQ", type: "txt", status: "ready", createdAt: "2026-09-16T09:30:00.000Z" },
];

const msg = (id: string, role: DemoMessage["role"], body: string, createdAt: string): DemoMessage => ({
  id,
  role,
  body,
  createdAt,
});

export const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: "conv-coffee-1",
    projectId: "demo-coffee",
    createdAt: "2026-10-01T08:05:00.000Z",
    messages: [
      msg("m-coffee-1-1", "visitor", "What time do you open?", "2026-10-01T08:05:00.000Z"),
      msg("m-coffee-1-2", "bot", "We're open 7am–6pm Monday to Saturday, and 8am–4pm on Sundays.", "2026-10-01T08:05:03.000Z"),
    ],
  },
  {
    id: "conv-coffee-2",
    projectId: "demo-coffee",
    createdAt: "2026-10-03T12:20:00.000Z",
    messages: [
      msg("m-coffee-2-1", "visitor", "Do you have oat milk?", "2026-10-03T12:20:00.000Z"),
      msg("m-coffee-2-2", "bot", "Yes! Oat, soy and almond milk are available for no extra charge.", "2026-10-03T12:20:04.000Z"),
      msg("m-coffee-2-3", "visitor", "Great, and is there wifi?", "2026-10-03T12:21:00.000Z"),
      msg("m-coffee-2-4", "bot", "Free wifi for everyone. Just ask at the counter for the password.", "2026-10-03T12:21:03.000Z"),
    ],
  },
  {
    id: "conv-coffee-3",
    projectId: "demo-coffee",
    createdAt: "2026-10-06T16:40:00.000Z",
    messages: [
      msg("m-coffee-3-1", "visitor", "Can I book the shop for a birthday?", "2026-10-06T16:40:00.000Z"),
      msg("m-coffee-3-2", "bot", "I don't know — that isn't in my knowledge yet.", "2026-10-06T16:40:03.000Z"),
    ],
  },
  {
    id: "conv-saas-1",
    projectId: "demo-saas",
    createdAt: "2026-10-02T09:10:00.000Z",
    messages: [
      msg("m-saas-1-1", "visitor", "How much does Taskly cost?", "2026-10-02T09:10:00.000Z"),
      msg("m-saas-1-2", "bot", "Taskly is free for up to 3 users. Team is $8 per user per month.", "2026-10-02T09:10:03.000Z"),
      msg("m-saas-1-3", "visitor", "Is there a free trial of Team?", "2026-10-02T09:11:00.000Z"),
      msg("m-saas-1-4", "bot", "Yes, Team comes with a 14-day free trial. No card needed.", "2026-10-02T09:11:03.000Z"),
    ],
  },
  {
    id: "conv-saas-2",
    projectId: "demo-saas",
    createdAt: "2026-10-04T13:00:00.000Z",
    messages: [
      msg("m-saas-2-1", "visitor", "Does it work with Slack?", "2026-10-04T13:00:00.000Z"),
      msg("m-saas-2-2", "bot", "Taskly connects with Slack, Google Calendar and GitHub from Settings → Integrations.", "2026-10-04T13:00:04.000Z"),
    ],
  },
  {
    id: "conv-saas-3",
    projectId: "demo-saas",
    createdAt: "2026-10-07T15:30:00.000Z",
    messages: [
      msg("m-saas-3-1", "visitor", "How do I get started?", "2026-10-07T15:30:00.000Z"),
      msg("m-saas-3-2", "bot", "Create a workspace, add your first project and invite your team. It takes about two minutes.", "2026-10-07T15:30:03.000Z"),
      msg("m-saas-3-3", "visitor", "Can I export my tasks?", "2026-10-07T15:31:00.000Z"),
      msg("m-saas-3-4", "bot", "I don't know — that isn't in my knowledge yet.", "2026-10-07T15:31:03.000Z"),
    ],
  },
  {
    id: "conv-store-1",
    projectId: "demo-store",
    createdAt: "2026-10-01T18:00:00.000Z",
    messages: [
      msg("m-store-1-1", "visitor", "How long does shipping take?", "2026-10-01T18:00:00.000Z"),
      msg("m-store-1-2", "bot", "Standard shipping takes 3–5 working days. Orders over $50 ship free.", "2026-10-01T18:00:03.000Z"),
    ],
  },
  {
    id: "conv-store-2",
    projectId: "demo-store",
    createdAt: "2026-10-05T10:45:00.000Z",
    messages: [
      msg("m-store-2-1", "visitor", "Can I return a jacket?", "2026-10-05T10:45:00.000Z"),
      msg("m-store-2-2", "bot", "Of course. Unworn items can be returned within 30 days for a full refund.", "2026-10-05T10:45:04.000Z"),
      msg("m-store-2-3", "visitor", "Who pays for return postage?", "2026-10-05T10:46:00.000Z"),
      msg("m-store-2-4", "bot", "Returns are free. Use the prepaid label in your parcel.", "2026-10-05T10:46:03.000Z"),
    ],
  },
  {
    id: "conv-store-3",
    projectId: "demo-store",
    createdAt: "2026-10-09T20:15:00.000Z",
    messages: [
      msg("m-store-3-1", "visitor", "Do you sell gift cards?", "2026-10-09T20:15:00.000Z"),
      msg("m-store-3-2", "bot", "Yes, digital gift cards from $10 to $200. They're emailed instantly and never expire.", "2026-10-09T20:15:03.000Z"),
    ],
  },
];
