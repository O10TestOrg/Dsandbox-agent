import type { IsoDate } from "./common";

export interface ConversationSummaryDto {
  id: string;
  visitorId: string;
  /** First visitor message, truncated. */
  preview: string;
  messageCount: number;
  createdAt: IsoDate;
}

export interface MessageDto {
  id: string;
  role: "visitor" | "bot";
  body: string;
  createdAt: IsoDate;
}

/** GET /api/projects/:id/conversations (newest first) */
export interface ListConversationsResponse {
  conversations: ConversationSummaryDto[];
}

/** GET /api/conversations/:id */
export interface GetConversationResponse {
  conversation: ConversationSummaryDto;
  messages: MessageDto[];
}
