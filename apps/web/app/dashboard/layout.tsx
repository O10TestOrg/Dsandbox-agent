import { redirect } from "next/navigation";
import { APP_NAME } from "@askwell/shared";
import { DashboardNav } from "../../components/DashboardNav";
import { getDemoName } from "../../lib/demo-session";

// Reads the demo cookie per request. The proxy redirects too; this covers the case it is skipped.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const name = await getDemoName();
  if (!name) redirect("/sign-in");
  return (
    <div className="min-h-screen bg-surface text-ink">
      <DashboardNav name={name} appName={APP_NAME} />
      <main className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8">{children}</main>
    </div>
  );
}
