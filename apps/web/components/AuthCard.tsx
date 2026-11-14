import { Container } from "./Container";
import { Notice } from "./Signal";
import { Eyebrow } from "./Text";

/** One centered form for sign-in and sign-up. Says it's a demo. */
export function AuthCard({
  appName,
  title,
  subtitle,
  children,
  footer,
}: {
  appName: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center bg-paper py-section">
      <Container size="prose">
        <div className="mx-auto max-w-sm space-y-8">
          <div className="space-y-2">
            <Eyebrow>{appName}</Eyebrow>
            <h1 className="text-heading">{title}</h1>
            <p className="text-body text-muted">{subtitle}</p>
          </div>
          <Notice>Demo. Any email and password work. Don&apos;t use a real password.</Notice>
          {children}
          <p className="text-body text-muted">{footer}</p>
        </div>
      </Container>
    </main>
  );
}
