import { ConversationThread } from "./ConversationThread";

export const metadata = { title: "Conversation" };

export default async function Page({ params }: { params: Promise<{ projectId: string; conversationId: string }> }) {
  const { projectId, conversationId } = await params;
  return <ConversationThread projectId={projectId} conversationId={conversationId} />;
}
