import { APP_NAME } from "@askwell/shared";
import { ButtonLink } from "../components/Button";
import { Container } from "../components/Container";
import { Eyebrow } from "../components/Text";

export const metadata = { title: `Page not found · ${APP_NAME}` };

/** A bad URL: say what happened, offer one way out. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-paper py-section text-ink">
      <Container size="prose">
        <div className="space-y-6">
          <div className="space-y-2">
            <Eyebrow>{APP_NAME}</Eyebrow>
            <h1 className="text-heading">Page not found</h1>
            <p className="text-body text-muted">This page doesn&apos;t exist, or it has moved.</p>
          </div>
          <ButtonLink href="/">Go home</ButtonLink>
        </div>
      </Container>
    </main>
  );
}
