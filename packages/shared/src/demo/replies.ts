export const DEMO_UNKNOWN_REPLY = "I don't know — that isn't in my knowledge yet.";

type ScriptedAnswer = { keywords: string[]; answer: string };

const SCRIPTS: Record<string, ScriptedAnswer[]> = {
  "demo-coffee": [
    { keywords: ["hours", "open", "close", "time"], answer: "We're open 7am–6pm Monday to Saturday, and 8am–4pm on Sundays." },
    { keywords: ["oat", "soy", "almond", "milk", "vegan"], answer: "Yes! Oat, soy and almond milk are available for no extra charge." },
    { keywords: ["wifi", "wi-fi", "internet"], answer: "Free wifi for everyone. Just ask at the counter for the password." },
    { keywords: ["price", "cost", "how much"], answer: "Coffees start at $3.50, and a flat white is $4.20. Pastries are $3–$5." },
    { keywords: ["allergen", "allergy", "nut", "gluten"], answer: "Our allergen notes list every item. Ask us about nuts and gluten and we'll point you to a safe choice." },
  ],
  "demo-saas": [
    { keywords: ["price", "pricing", "cost", "how much", "plan"], answer: "Taskly is free for up to 3 users. Team is $8 per user per month." },
    { keywords: ["trial", "free"], answer: "Yes, Team comes with a 14-day free trial. No card needed." },
    { keywords: ["slack", "integration", "github", "calendar"], answer: "Taskly connects with Slack, Google Calendar and GitHub from Settings → Integrations." },
    { keywords: ["start", "begin", "setup", "set up", "onboard"], answer: "Create a workspace, add your first project and invite your team. It takes about two minutes." },
  ],
  "demo-store": [
    { keywords: ["shipping", "delivery", "deliver", "ship"], answer: "Standard shipping takes 3–5 working days. Orders over $50 ship free." },
    { keywords: ["return", "refund", "exchange"], answer: "Of course. Unworn items can be returned within 30 days for a full refund. Returns are free." },
    { keywords: ["gift", "voucher"], answer: "Yes, digital gift cards from $10 to $200. They're emailed instantly and never expire." },
    { keywords: ["price", "cost", "how much", "discount"], answer: "Prices are shown on each product page. Orders over $50 ship free." },
  ],
};

export function getScriptedReply(projectId: string, message: string): string {
  const script = Object.hasOwn(SCRIPTS, projectId) ? SCRIPTS[projectId] : undefined;
  if (!script) return DEMO_UNKNOWN_REPLY;
  const text = message.toLowerCase();
  const hit = script.find((s) => s.keywords.some((k) => text.includes(k)));
  return hit ? hit.answer : DEMO_UNKNOWN_REPLY;
}
