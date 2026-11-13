import { APP_NAME, PLAN_LIMITS } from "@askwell/shared";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { GlassCard } from "../components/GlassCard";

const steps = [
  { title: "Add your product info", body: "Paste text or upload a PDF. That is all the bot knows." },
  { title: "Copy one script tag", body: "Paste it into any page on your site." },
  { title: "Visitors get answers", body: "The chat button answers their questions from your info." },
];

const fmt = (n: number) => n.toLocaleString("en-US");

const plans = [
  { name: "Free", limits: PLAN_LIMITS.free, perks: ["Default button", "Bottom right only", '"Powered by" badge'] },
  {
    name: "Pro",
    limits: PLAN_LIMITS.pro,
    perks: ["Any button color and label", "Any corner", "Custom header text", "No badge"],
  },
];

const snippet = `<script src="https://YOUR-DOMAIN/widget.js" data-key="pk_..."></script>`;

export default function Home() {
  return (
    <div className="theme-dark min-h-screen overflow-x-hidden bg-surface text-ink">
      <header>
        <Container className="flex items-center justify-between py-5">
          <span className="text-lg font-semibold tracking-tight">{APP_NAME}</span>
          <Button href="/sign-up" variant="ghost">Start free</Button>
        </Container>
      </header>

      <main>
        <section className="py-20 text-center sm:py-32">
          <Container>
            <h1 className="enter text-4xl font-semibold tracking-tight sm:text-6xl">
              Support answers on your site, in one script tag
            </h1>
            <p className="enter-2 mx-auto mt-6 max-w-xl text-lg text-muted">
              {APP_NAME} turns your product info into a chat bot that answers visitor questions.
            </p>
            <div className="enter-3 mt-8">
              <Button href="/sign-up">Start free</Button>
            </div>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <h2 className="reveal text-2xl font-semibold sm:text-3xl">How it works</h2>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="reveal">
                  <GlassCard className="h-full p-6">
                    <span className="text-sm text-muted">Step {i + 1}</span>
                    <h3 className="mt-2 text-lg font-medium">{s.title}</h3>
                    <p className="mt-2 text-muted">{s.body}</p>
                  </GlassCard>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <h2 className="reveal text-2xl font-semibold sm:text-3xl">See it in action</h2>
            <p className="mt-2 text-muted">A preview. The live widget arrives in a later phase.</p>
            <div className="reveal mt-8 flex justify-end">
              <div className="flex w-full max-w-sm flex-col gap-3">
                <GlassCard className="p-4">
                  <p className="text-sm text-muted">Visitor</p>
                  <p className="mt-1">What does the Pro plan include?</p>
                  <p className="mt-4 text-sm text-muted">{APP_NAME} bot</p>
                  <p className="mt-1">
                    Up to {PLAN_LIMITS.pro.projects} projects and {fmt(PLAN_LIMITS.pro.messagesPerMonth)} messages a
                    month each.
                  </p>
                </GlassCard>
                <div
                  aria-hidden="true"
                  className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl text-accent-ink shadow-glass"
                >
                  ?
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <h2 className="reveal text-2xl font-semibold sm:text-3xl">Pricing</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {plans.map((p) => (
                <div key={p.name} className="reveal">
                  <GlassCard className="h-full p-6">
                    <h3 className="text-xl font-medium">{p.name}</h3>
                    <ul className="mt-4 space-y-2 text-muted">
                      <li>{p.limits.projects} {p.limits.projects === 1 ? "project" : "projects"}</li>
                      <li>{fmt(p.limits.messagesPerMonth)} messages a month per project</li>
                      <li>{p.limits.knowledgeSources} knowledge sources per project</li>
                      {p.perks.map((perk) => (
                        <li key={perk}>{perk}</li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <h2 className="reveal text-2xl font-semibold sm:text-3xl">Install</h2>
            <p className="mt-2 text-muted">Paste this before the closing body tag.</p>
            <GlassCard className="reveal mt-6 p-4">
              <pre className="overflow-x-auto font-mono text-sm">
                <code>{snippet}</code>
              </pre>
            </GlassCard>
            <div className="mt-8">
              <Button href="/sign-up">Start free</Button>
            </div>
          </Container>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <Container className="text-sm text-muted">
          © {new Date().getFullYear()} {APP_NAME}
        </Container>
      </footer>
    </div>
  );
}
