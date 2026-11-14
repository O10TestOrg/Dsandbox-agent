import { APP_NAME, PLAN_LIMITS } from "@askwell/shared";
import { ButtonLink } from "../components/Button";
import { Container } from "../components/Container";
import { Section } from "../components/Section";
import { Surface } from "../components/Surface";
import { Eyebrow } from "../components/Text";
import { SampleChat } from "./_landing/SampleChat";

const steps = [
  { title: "Add your product info", body: "Paste text or upload a file. That is all the bot knows." },
  { title: "Ask your bot", body: "Try it in the dashboard. It answers from your info, or says it doesn't know." },
  { title: "Read the chats", body: "Every conversation is saved, and usage counts up against your plan." },
];

const fmt = (n: number) => n.toLocaleString("en-US");

const plans = [
  { name: "Free", limits: PLAN_LIMITS.free, perks: ["Default widget", '"Powered by" badge shown'] },
  {
    name: "Pro",
    limits: PLAN_LIMITS.pro,
    perks: ["Full widget customization", '"Powered by" badge hidden'],
  },
];

export default function Home() {
  return (
    <div className="theme-dark min-h-screen overflow-x-hidden bg-paper text-ink">
      <header>
        <Container className="flex items-center justify-between py-5">
          <span className="text-lg tracking-tight">{APP_NAME}</span>
          <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
            <ButtonLink href="/sign-in" variant="secondary">Try the demo</ButtonLink>
          </nav>
        </Container>
      </header>

      <main>
        <Section className="text-center">
          <Container>
            <h1 className="enter text-4xl tracking-tight sm:text-6xl">
              Support answers from your own product info
            </h1>
            <p className="enter-2 mx-auto mt-6 max-w-xl text-lg text-muted">
              {APP_NAME} is an AI support chat widget for any website. This is a demo: sign in with any email and look around.
            </p>
            <div className="enter-3 mt-8">
              <ButtonLink href="/sign-in">Try the demo</ButtonLink>
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <h2 className="reveal text-2xl sm:text-3xl">How it works</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="reveal">
                  <Surface className="h-full p-6">
                    <Eyebrow>Step {i + 1}</Eyebrow>
                    <h3 className="mt-2 text-lg">{s.title}</h3>
                    <p className="mt-2 text-muted">{s.body}</p>
                  </Surface>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        <Section>
          <Container>
            <h2 className="reveal text-2xl sm:text-3xl">See it in action</h2>
            <p className="mt-2 text-muted">A sample chat from the demo data.</p>
            <div className="reveal mt-8">
              <SampleChat />
            </div>
          </Container>
        </Section>

        <Section>
          <Container>
            <h2 className="reveal text-2xl sm:text-3xl">Pricing</h2>
            <p className="mt-2 text-muted">Demo — no payment. Display only.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {plans.map((p) => (
                <div key={p.name} className="reveal">
                  <Surface className="h-full p-6">
                    <h3 className="text-xl">{p.name}</h3>
                    <ul className="mt-4 space-y-2 text-muted">
                      <li>{p.limits.projects} {p.limits.projects === 1 ? "project" : "projects"}</li>
                      <li>{fmt(p.limits.messagesPerMonth)} messages a month per project</li>
                      <li>{p.limits.knowledgeSources} knowledge sources per project</li>
                      {p.perks.map((perk) => (
                        <li key={perk}>{perk}</li>
                      ))}
                    </ul>
                  </Surface>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section className="text-center">
          <Container>
            <ButtonLink href="/sign-in">Try the demo</ButtonLink>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-line py-8">
        <Container className="text-sm text-muted">
          © {new Date().getFullYear()} {APP_NAME}
        </Container>
      </footer>
    </div>
  );
}
