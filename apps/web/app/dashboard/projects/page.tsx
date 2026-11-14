import { EmptyState } from "../../../components/EmptyState";

export const metadata = { title: "Projects" };

export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <EmptyState title="No projects yet">Your demo projects will show up here.</EmptyState>
    </section>
  );
}
