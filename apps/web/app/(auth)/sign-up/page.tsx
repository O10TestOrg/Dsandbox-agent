import Link from "next/link";
import { redirect } from "next/navigation";
import { APP_NAME } from "@askwell/shared";
import { AuthCard } from "../../../components/AuthCard";
import { AuthForm } from "../../../components/AuthForm";
import { getDemoName } from "../../../lib/demo-session";

// Reads the demo cookie per request.
export const dynamic = "force-dynamic";

export const metadata = { title: `Sign up · ${APP_NAME}` };

export default async function SignUpPage() {
  if (await getDemoName()) redirect("/dashboard");
  return (
    <AuthCard
      title="Create your account"
      subtitle={`Try the ${APP_NAME} demo.`}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="text-ink underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-up" />
    </AuthCard>
  );
}
