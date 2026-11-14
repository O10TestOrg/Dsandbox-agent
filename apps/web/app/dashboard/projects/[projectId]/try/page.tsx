import { APP_NAME } from "@askwell/shared";
import { TryBotPanel } from "../../../../../components/TryBotPanel";

export const metadata = { title: `Try your bot · ${APP_NAME}` };

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <section className="space-y-4">
      <h1 className="text-2xl tracking-tight">Try your bot</h1>
      <TryBotPanel projectId={projectId} />
    </section>
  );
}
