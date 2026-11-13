import { describe, expect, it } from "vitest";
import {
  chatRequestSchema,
  createProjectSchema,
  finalizeUploadSchema,
  pasteKnowledgeSchema,
  updateConfigSchema,
  uploadUrlRequestSchema,
  widgetConfigQuerySchema,
  MAX_KNOWLEDGE_FILE_BYTES,
  MAX_MESSAGE_LENGTH,
  DEFAULT_WIDGET_CONFIG,
  widgetConfigSchema,
} from "./index";

const key = "pk_abc123";

describe("chatRequestSchema", () => {
  const base = { key, visitorId: "v1", message: "hi" };
  it("accepts a normal message, with or without conversationId", () => {
    expect(chatRequestSchema.safeParse(base).success).toBe(true);
    expect(chatRequestSchema.safeParse({ ...base, conversationId: "c1" }).success).toBe(true);
  });
  it("rejects an empty or whitespace-only message", () => {
    expect(chatRequestSchema.safeParse({ ...base, message: "" }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ ...base, message: "   " }).success).toBe(false);
  });
  it("rejects a message over the max length, accepts exactly the max", () => {
    expect(chatRequestSchema.safeParse({ ...base, message: "a".repeat(MAX_MESSAGE_LENGTH + 1) }).success).toBe(false);
    expect(chatRequestSchema.safeParse({ ...base, message: "a".repeat(MAX_MESSAGE_LENGTH) }).success).toBe(true);
  });
  it("rejects a key that is not a public key", () => {
    expect(chatRequestSchema.safeParse({ ...base, key: "sk_x" }).success).toBe(false);
  });
});

describe("widgetConfigQuerySchema", () => {
  it("requires a pk_ key", () => {
    expect(widgetConfigQuerySchema.safeParse({}).success).toBe(false);
    expect(widgetConfigQuerySchema.safeParse({ key }).success).toBe(true);
  });
});

describe("createProjectSchema", () => {
  it("trims and rejects blank names", () => {
    expect(createProjectSchema.safeParse({ name: "  " }).success).toBe(false);
    expect(createProjectSchema.parse({ name: "  Docs " }).name).toBe("Docs");
  });
});

describe("knowledge schemas", () => {
  it("paste needs a title and non-empty content", () => {
    expect(pasteKnowledgeSchema.safeParse({ title: "FAQ", content: "text" }).success).toBe(true);
    expect(pasteKnowledgeSchema.safeParse({ title: "", content: "text" }).success).toBe(false);
    expect(pasteKnowledgeSchema.safeParse({ title: "FAQ", content: " " }).success).toBe(false);
  });
  const file = { filename: "a.pdf", type: "pdf", size: 1000 };
  it("upload-url accepts pdf/md/txt within the size limit", () => {
    for (const type of ["pdf", "md", "txt"]) {
      expect(uploadUrlRequestSchema.safeParse({ ...file, type }).success).toBe(true);
    }
    expect(uploadUrlRequestSchema.safeParse({ ...file, size: MAX_KNOWLEDGE_FILE_BYTES }).success).toBe(true);
  });
  it("upload-url rejects a bad type, an oversize or empty file", () => {
    expect(uploadUrlRequestSchema.safeParse({ ...file, type: "exe" }).success).toBe(false);
    expect(uploadUrlRequestSchema.safeParse({ ...file, size: MAX_KNOWLEDGE_FILE_BYTES + 1 }).success).toBe(false);
    expect(uploadUrlRequestSchema.safeParse({ ...file, size: 0 }).success).toBe(false);
  });
  it("finalize needs a source id", () => {
    expect(finalizeUploadSchema.safeParse({}).success).toBe(false);
    expect(finalizeUploadSchema.safeParse({ sourceId: "s1" }).success).toBe(true);
  });
});

describe("updateConfigSchema", () => {
  it("accepts a partial update", () => {
    expect(updateConfigSchema.safeParse({ position: "top-left" }).success).toBe(true);
  });
  it("rejects an empty update, bad enums and bad colors", () => {
    expect(updateConfigSchema.safeParse({}).success).toBe(false);
    expect(updateConfigSchema.safeParse({ position: "middle" }).success).toBe(false);
    expect(updateConfigSchema.safeParse({ animation: "spin" }).success).toBe(false);
    expect(updateConfigSchema.safeParse({ buttonColor: "red" }).success).toBe(false);
    expect(updateConfigSchema.safeParse({ buttonColor: "#12ab9f" }).success).toBe(true);
  });
  it("rejects unknown fields", () => {
    expect(updateConfigSchema.safeParse({ plan: "pro" }).success).toBe(false);
  });
});

describe("plan data", () => {
  it("the default widget config is itself a valid config", () => {
    expect(widgetConfigSchema.safeParse(DEFAULT_WIDGET_CONFIG).success).toBe(true);
  });
});
