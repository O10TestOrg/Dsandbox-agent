import Link from "next/link";
import { redirect } from "next/navigation";
import { APP_NAME } from "@askwell/shared";
import { AuthCard } from "../../../components/AuthCard";
import { AuthForm } from "../../../components/AuthForm";
import { getSession } from "../../../lib/session";

// Reads the session per request; never prerender (it would touch the database at build).
export const dynamic = "force-dynamic";

export const metadata = { title: `Sign up · ${APP_NAME}` };

export default async function SignUpPage() {
  if (await getSession()) redirect("/dashboard");
  return (
    <AuthCard
      title="Create your account"
      subtitle={`Start free with ${APP_NAME}.`}
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
