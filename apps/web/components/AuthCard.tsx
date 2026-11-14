import { Container } from "./Container";
import { GlassCard } from "./GlassCard";

/** One centered glass card for sign-in and sign-up. */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center py-10">
      <Container className="max-w-md">
        <GlassCard className="p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <p className="mt-4 rounded-control border border-line px-3 py-2 text-sm">
            Demo — any email and password work. Don&apos;t use a real password.
          </p>
          <div className="mt-6">{children}</div>
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </GlassCard>
      </Container>
    </main>
  );
}
