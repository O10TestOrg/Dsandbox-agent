import { redirect } from "next/navigation";
import { getDemoName } from "../../lib/demo-session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const name = await getDemoName();
  if (!name) redirect("/sign-in");
  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome, {name}</h1>
      <p className="mt-1 text-sm text-muted">Pick a section above to get started.</p>
    </section>
  );
}
