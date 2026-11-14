import { EmptyState } from "../../../components/EmptyState";

export const metadata = { title: "Usage" };

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
      <EmptyState title="No usage yet">Messages used this month will show up here.</EmptyState>
    </section>
  );
}
