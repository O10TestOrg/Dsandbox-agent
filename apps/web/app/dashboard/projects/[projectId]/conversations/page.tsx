import { APP_NAME } from "@askwell/shared";
import { ConversationList } from "./ConversationList";

export const metadata = { title: `Conversations · ${APP_NAME}` };

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>
      <ConversationList projectId={projectId} />
    </section>
  );
}
