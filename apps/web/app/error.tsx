"use client";

import { useEffect } from "react";
import { APP_NAME } from "@askwell/shared";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Link } from "../components/Link";
import { SignalMessage } from "../components/Signal";
import { Eyebrow } from "../components/Text";

/**
 * A crash below the root layout. The user sees one calm line, never the message, digest or stack.
 * `retry` re-fetches and re-renders the segment (preferred over `reset`, which only re-renders).
 */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  // Keep the details in the console for debugging; they never reach the page.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center bg-paper py-section text-ink">
      <title>{`Something went wrong · ${APP_NAME}`}</title>
      <Container size="prose">
        <div className="space-y-6">
          <div className="space-y-2">
            <Eyebrow>{APP_NAME}</Eyebrow>
            <h1 className="text-heading">Something went wrong</h1>
          </div>
          <SignalMessage tone="danger" role="alert">
            This page couldn&apos;t load. Try again, or go back home.
          </SignalMessage>
          <div className="flex flex-wrap items-center gap-6">
            <Button onClick={() => retry()}>Try again</Button>
            <Link href="/" className="inline-flex min-h-12 items-center">
              Go home
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
