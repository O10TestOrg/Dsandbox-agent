import { sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  vector,
  boolean,
} from "drizzle-orm/pg-core";
import { KNOWLEDGE_FILE_TYPES, WIDGET_ANIMATIONS, WIDGET_POSITIONS } from "@askwell/shared";
import { user } from "./auth";

export const widgetPositionEnum = pgEnum("widget_position", WIDGET_POSITIONS);
export const widgetAnimationEnum = pgEnum("widget_animation", WIDGET_ANIMATIONS);
export const knowledgeTypeEnum = pgEnum("knowledge_type", ["text", ...KNOWLEDGE_FILE_TYPES]);
export const knowledgeStatusEnum = pgEnum("knowledge_status", ["uploading", "processing", "ready", "failed"]);
export const messageRoleEnum = pgEnum("message_role", ["visitor", "bot"]);

export const EMBEDDING_DIMENSIONS = 1536;

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    publicKey: text("public_key").notNull().unique(),
    messagesUsed: integer("messages_used").notNull().default(0),
    periodStart: timestamp("period_start").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("projects_owner_id_idx").on(t.ownerId)],
);

export const widgetConfigs = pgTable("widget_configs", {
  projectId: text("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  buttonColor: text("button_color").notNull(),
  position: widgetPositionEnum("position").notNull(),
  label: text("label").notNull(),
  animation: widgetAnimationEnum("animation").notNull(),
  headerText: text("header_text").notNull(),
  showBadge: boolean("show_badge").notNull(),
});

export const knowledgeSources = pgTable(
  "knowledge_sources",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    type: knowledgeTypeEnum("type").notNull(),
    /** Null for pasted text. */
    blobPathname: text("blob_pathname"),
    status: knowledgeStatusEnum("status").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("knowledge_sources_project_id_idx").on(t.projectId),
    // Target of the composite FK from knowledge_chunks: a chunk and its source share one project.
    unique("knowledge_sources_id_project_id_unique").on(t.id, t.projectId),
  ],
);

export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    sourceId: text("source_id").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: EMBEDDING_DIMENSIONS }).notNull(),
  },
  (t) => [
    foreignKey({
      name: "knowledge_chunks_source_project_fk",
      columns: [t.sourceId, t.projectId],
      foreignColumns: [knowledgeSources.id, knowledgeSources.projectId],
    }).onDelete("cascade"),
    index("knowledge_chunks_project_id_idx").on(t.projectId),
    index("knowledge_chunks_source_id_idx").on(t.sourceId),
    index("knowledge_chunks_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("conversations_project_id_idx").on(t.projectId)],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    body: text("body").notNull(),
    // Usage columns: set on bot rows only.
    model: text("model"),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    costUsd: numeric("cost_usd", { precision: 12, scale: 6 }),
    latencyMs: integer("latency_ms"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("messages_conversation_id_idx").on(t.conversationId)],
);

export const stripeEvents = pgTable("stripe_events", {
  /** Stripe event ID. Makes the webhook idempotent. */
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  receivedAt: timestamp("received_at").notNull().defaultNow(),
});

export const events = pgTable(
  "events",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
    /** No message text. */
    props: jsonb("props").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("events_name_created_at_idx").on(t.name, t.createdAt)],
);
