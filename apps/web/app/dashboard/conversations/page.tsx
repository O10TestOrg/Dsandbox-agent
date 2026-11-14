import { EmptyState } from "../../../components/EmptyState";

export const metadata = { title: "Conversations" };

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Conversations</h1>
      <EmptyState title="No conversations yet">Chats with your bot will show up here.</EmptyState>
    </section>
  );
}
