"use client";

// global-error replaces the root layout, so it brings its own document and the tokens.
import "./globals.css";
import { useEffect } from "react";
import { APP_NAME } from "@askwell/shared";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { SignalMessage } from "../components/Signal";
import { Eyebrow } from "../components/Text";

/** A crash in the root layout itself. Same calm page as error.tsx, nothing technical shown. */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <title>{`Something went wrong · ${APP_NAME}`}</title>
        <main className="flex min-h-screen items-center bg-paper py-section text-ink">
          <Container size="prose">
            <div className="space-y-6">
              <div className="space-y-2">
                <Eyebrow>{APP_NAME}</Eyebrow>
                <h1 className="text-heading">Something went wrong</h1>
              </div>
              <SignalMessage tone="danger" role="alert">
                {APP_NAME} couldn&apos;t load. Try again, or come back in a moment.
              </SignalMessage>
              <div className="flex flex-wrap items-center gap-6">
                <Button onClick={() => retry()}>Try again</Button>
                {/* A plain <a>: the app's router may be what failed, so do a full page load. */}
                <a href="/" className="inline-flex min-h-12 items-center underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60">
                  Go home
                </a>
              </div>
            </div>
          </Container>
        </main>
      </body>
    </html>
  );
}
