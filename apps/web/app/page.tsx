import { APP_NAME } from "@askwell/shared";
import { ButtonLink } from "../components/Button";
import { Container } from "../components/Container";
import { Link } from "../components/Link";
import { Section } from "../components/Section";
import { Eyebrow } from "../components/Text";
import { Pricing } from "./_landing/Pricing";
import { SampleChat } from "./_landing/SampleChat";

const steps = [
  { title: "Add your product info", body: "Paste text or upload a file. That is all the bot knows." },
  { title: "Ask your bot", body: "It answers from your info, or says it doesn't know." },
  { title: "Read the chats", body: "Every chat is saved. Usage counts up against your plan." },
];

export default function Home() {
  return (
    <div className="theme-dark min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-10 border-b border-line bg-paper">
        <Container className="flex items-center justify-between gap-4">
          <span>{APP_NAME}</span>
          <nav aria-label="Main">
            <Link href="/sign-in" variant="nav">
              Try the demo
            </Link>
          </nav>
        </Container>
      </header>

      <main>
        <Section labelledBy="hero-title">
          <Container>
            <div className="max-w-reading">
              <Eyebrow className="enter">Demo</Eyebrow>
              <h1 id="hero-title" className="enter mt-3 text-display">
                Support answers from your own product info
              </h1>
              <p className="enter-2 mt-6 text-muted">
                {APP_NAME} is an AI support chat widget for any website. Sign in with any email and look around.
              </p>
              <div className="enter-3 mt-8">
                <ButtonLink href="/sign-in">Try the demo</ButtonLink>
              </div>
            </div>
          </Container>
        </Section>

        <Section labelledBy="how-title">
          <Container>
            <div className="max-w-reading">
              <Eyebrow>How it works</Eyebrow>
              <h2 id="how-title" className="mt-3 text-heading">
                Three steps
              </h2>
              <ol className="mt-8 space-y-8">
                {steps.map((s, i) => (
                  <li key={s.title} className="reveal">
                    <p className="text-caption tabular-nums text-muted">{i + 1}</p>
                    <h3 className="mt-1">{s.title}</h3>
                    <p className="mt-1 text-muted">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </Container>
        </Section>

        <Section labelledBy="sample-title">
          <Container>
            <div className="max-w-reading">
              <Eyebrow>Sample chat</Eyebrow>
              <h2 id="sample-title" className="mt-3 text-heading">
                See it in action
              </h2>
              <p className="mt-3 text-muted">A chat from the demo data. Nothing here is live.</p>
              <div className="reveal mt-8">
                <SampleChat />
              </div>
            </div>
          </Container>
        </Section>

        <Section labelledBy="pricing-title">
          <Container>
            <div className="max-w-reading">
              <Eyebrow>Pricing</Eyebrow>
              <h2 id="pricing-title" className="mt-3 text-heading">
                Two plans
              </h2>
              <p className="mt-3 text-muted">Demo — no payment. Display only.</p>
              <div className="mt-8">
                <Pricing />
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-line py-8">
        <Container className="text-caption text-muted">
          © {new Date().getFullYear()} {APP_NAME}
        </Container>
      </footer>
    </div>
  );
}
