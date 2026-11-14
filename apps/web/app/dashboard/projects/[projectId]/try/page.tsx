import { APP_NAME } from "@askwell/shared";
import { TryBotPanel } from "../../../../../components/TryBotPanel";

export const metadata = { title: `Try your bot · ${APP_NAME}` };

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-heading">Try your bot</h2>
        <p className="text-body text-muted">Ask what your visitors would ask.</p>
      </div>
      <TryBotPanel projectId={projectId} />
    </section>
  );
}
