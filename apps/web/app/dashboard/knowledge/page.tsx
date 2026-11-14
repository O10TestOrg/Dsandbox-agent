import { EmptyState } from "../../../components/EmptyState";

export const metadata = { title: "Knowledge" };

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Knowledge</h1>
      <EmptyState title="No knowledge yet">Sources your bot learns from will show up here.</EmptyState>
    </section>
  );
}
