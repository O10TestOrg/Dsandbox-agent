export type DemoProject = {
  id: string;
  name: string;
  createdAt: string;
  messagesUsed: number;
};

export type DemoKnowledgeSourceType = "text" | "pdf" | "md" | "txt";
export type DemoKnowledgeSourceStatus = "processing" | "ready" | "failed";

export type DemoKnowledgeSource = {
  id: string;
  projectId: string;
  title: string;
  type: DemoKnowledgeSourceType;
  status: DemoKnowledgeSourceStatus;
  createdAt: string;
};

export type DemoMessage = {
  id: string;
  role: "visitor" | "bot";
  body: string;
  createdAt: string;
};

export type DemoConversation = {
  id: string;
  projectId: string;
  createdAt: string;
  messages: DemoMessage[];
};
