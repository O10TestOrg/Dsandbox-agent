import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";

// The proxy only checks that a cookie exists. This is the real check, on the server.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await getSession())) redirect("/sign-in");
  return <main className="p-8">Dashboard coming soon.</main>;
}
