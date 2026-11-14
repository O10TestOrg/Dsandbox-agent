import { UsagePanel } from "./UsagePanel";

export const metadata = { title: "Usage" };

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
      <UsagePanel projectId={projectId} />
    </section>
  );
}
