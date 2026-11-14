import { APP_NAME } from "@askwell/shared";
import { UsagePanel } from "./UsagePanel";

export const metadata = { title: `Usage · ${APP_NAME}` };

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-heading">Usage</h2>
        <p className="text-body text-muted">Messages your bot answered this month.</p>
      </div>
      <UsagePanel projectId={projectId} />
    </section>
  );
}
