import Link from "next/link";
import { redirect } from "next/navigation";
import { APP_NAME } from "@askwell/shared";
import { AuthCard } from "../../../components/AuthCard";
import { AuthForm } from "../../../components/AuthForm";
import { getDemoName } from "../../../lib/demo-session";

// Reads the demo cookie per request.
export const dynamic = "force-dynamic";

export const metadata = { title: `Sign in · ${APP_NAME}` };

export default async function SignInPage() {
  if (await getDemoName()) redirect("/dashboard");
  return (
    <AuthCard
      title="Sign in"
      subtitle={`Welcome back to ${APP_NAME}.`}
      footer={
        <>
          No account yet?{" "}
          <Link href="/sign-up" className="text-ink underline">
            Sign up
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-in" />
    </AuthCard>
  );
}
