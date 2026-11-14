import { APP_NAME } from "@askwell/shared";
import { ConversationList } from "./ConversationList";

export const metadata = { title: `Conversations · ${APP_NAME}` };

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-heading">Conversations</h2>
        <p className="text-body text-muted">Every conversation with your bot, newest first.</p>
      </div>
      <ConversationList projectId={projectId} />
    </section>
  );
}
