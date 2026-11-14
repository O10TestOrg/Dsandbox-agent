import { Container } from "./Container";
import { Notice } from "./Signal";
import { Surface } from "./Surface";

/** One centered form for sign-in and sign-up. */
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
      <Container size="prose">
        <Surface className="p-6 sm:p-8">
          <h1 className="text-2xl tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <Notice className="mt-4">Demo — any email and password work. Don&apos;t use a real password.</Notice>
          <div className="mt-6">{children}</div>
          <p className="mt-6 text-center text-sm text-muted">{footer}</p>
        </Surface>
      </Container>
    </main>
  );
}
