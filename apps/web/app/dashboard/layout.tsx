import { redirect } from "next/navigation";
import { APP_NAME } from "@askwell/shared";
import { Container } from "../../components/Container";
import { DashboardNav } from "../../components/DashboardNav";
import { StorageNotice } from "../../components/StorageNotice";
import { getDemoName } from "../../lib/demo-session";

// Reads the demo cookie per request. The proxy redirects too; this covers the case it is skipped.
export const dynamic = "force-dynamic";

export const metadata = { title: APP_NAME };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const name = await getDemoName();
  if (!name) redirect("/sign-in");
  return (
    <div className="min-h-screen bg-paper text-ink">
      <DashboardNav name={name} appName={APP_NAME} />
      <main>
        <Container className="space-y-8 py-8 md:py-12">
          <StorageNotice />
          {children}
        </Container>
      </main>
    </div>
  );
}
