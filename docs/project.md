# Project: Askwell

An AI support chat widget for any website — built as a **polished demo**. A visitor signs in with any email and password and lands in a dashboard full of predefined projects, knowledge and chats. Everything works in the browser on demo data, to show how the real product would work. There is no real auth, database, AI or payments.

This file is the source of truth for **what** we build. `docs/plan.md` says **in what order**. Tasks, owners and status live in JSM HQ.

---

## 1. Users

| User         | What they do                                                                                     | Where        |
| ------------ | ------------------------------------------------------------------------------------------------ | ------------ |
| **Demo user** | Signs in with anything, browses sample projects, knowledge and conversations, tries the bot, sees usage | Dashboard    |
| **Prospect** | Learns what the product does, sees pricing, opens the demo                                       | Landing page |

---

## 2. Demo flow

The whole demo in one flow. When this works end to end, the product is done.

1. Open the landing page. Click "Try the demo".
2. Sign in (or sign up) with any email and password. The dashboard opens.
3. See the sample projects. Create one, rename it, delete it.
4. Open a project's Knowledge. See its sources. Add a text or file; it shows "processing", then "ready".
5. Open Conversations. Read a predefined chat thread.
6. Open "Try your bot". Ask a question from the sample knowledge; get a scripted answer. Ask something unrelated; get "I don't know".
7. Back in Conversations, the new chat is there. Usage has gone up.
8. Click "Reset demo". The seed data is back.
9. Sign out. You are back on sign-in.

---

## 3. Stack

| Layer     | Tool                                         | Notes                                                                                       |
| --------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| App       | Next.js (App Router) + TypeScript + Tailwind | Landing (`/`), sign in / up, dashboard (`/dashboard`)                                       |
| Demo data | `packages/shared`                            | Seed data, types and scripted replies. The dashboard keeps its state in the browser (§7).   |
| Hosting   | Vercel                                       | Preview deployment per PR; production from `main` (automatic promotion off)                 |
| Analytics | Vercel Analytics + Speed Insights            | Page views and web vitals. No keys.                                                         |

**Removed in Phase 2:** Neon, Drizzle, Better Auth, Stripe, OpenAI, Arcjet, Vercel Blob, the widget loader. Don't add them back, or any paid service.

---

## 4. Environments

| Environment | What it is | Who deploys |
| --- | --- | --- |
| Production | Vercel production (from `main`) | The lead merges to `main`; the product owner promotes the build |
| Preview | A Vercel preview deployment per PR | Automatic on every push to a PR |
| Local | `pnpm dev` | Each developer |

| Rule | Detail |
| --- | --- |
| Merging | The lead merges a PR once CI passes and every review thread is answered. Developers never merge their own PR. |
| Branch cleanup | After a PR merges, its developer deletes the branch on GitHub and locally. |
| Production rollout | Once, in Phase 4: the product owner promotes the build. Vercel's automatic production promotion stays off. |

---

## 5. Plans

Pricing is display only: shown on the landing page and as labels in the dashboard. Nothing is gated or charged.

|                                | Free         | Pro                  |
| ------------------------------ | ------------ | -------------------- |
| Projects                       | 1            | 5                    |
| Messages / month (per project) | 100          | 2,000                |
| Knowledge sources (per project) | 3           | 25                   |
| Widget customization           | Default      | Full                 |
| "Powered by" badge             | Shown        | Hidden               |

**Name:** the app name lives in one constant, `APP_NAME` in `packages/shared`. Landing page, dashboard and page titles read it from there.

---

## 6. Features

### 6.1 Landing page

| Item      | Detail                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Sections  | Hero, how it works (3 steps), pricing (display only), footer           |
| CTA       | "Try the demo" → sign in                                               |
| Done when | Page is responsive; pricing matches §5; CTA opens sign in              |

### 6.2 Demo login

| Item       | Detail                                                                                          |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Pages      | `/sign-in` and `/sign-up`, one centered glass card each                                          |
| Accepts    | Any email and any non-empty password. Nothing is checked or stored on a server.                  |
| Session    | An `askwell_demo` cookie holding the display name (the part of the email before `@`). Not secret, not signed. |
| Protection | `apps/web/proxy.ts` redirects to `/sign-in` without the cookie. Sign out clears it.              |
| Notice     | The card says "Demo — any email and password work. Don't use a real password."                 |
| Done when  | Any login → dashboard; sign out → sign in; `/dashboard` without the cookie → sign in            |

### 6.3 Projects

| Item      | Detail                                                                   |
| --------- | ------------------------------------------------------------------------ |
| Seed      | 3 sample projects, each with knowledge, conversations and usage          |
| Actions   | List, create, rename, delete (in the demo store)                         |
| Done when | Create, rename and delete work and survive a reload; reset restores them |

### 6.4 Knowledge

| Item      | Detail                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------- |
| List      | Sources per project with title, type (`text`/`pdf`/`md`/`txt`) and status (`processing`/`ready`/`failed`) |
| Add       | Paste text with a title, or pick a file. Only the name and type are kept, never the file. Shows `processing` for ~2 s, then `ready`. |
| Delete    | Removes the source                                                                                  |
| Done when | Added source goes processing → ready; delete removes it                                             |

### 6.5 Try your bot

| Item      | Detail                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------- |
| Where     | A chat panel on each project page                                                                   |
| Replies   | `getScriptedReply(projectId, message)` in `packages/shared`: keyword match against the project's scripted Q&A, else "I don't know — that isn't in my knowledge yet." A short typing delay. |
| Saves     | The chat is added to the project's conversations; each visitor message adds 1 to usage              |
| Limit     | Messages max 1,000 characters                                                                       |
| Done when | A sample question gets its answer; an unrelated one gets "I don't know"; the chat shows in Conversations |

### 6.6 Conversations

| Item      | Detail                                                                |
| --------- | --------------------------------------------------------------------- |
| List      | Per project, newest first: first message preview, message count, time |
| Thread    | Full message history, visitor vs bot                                  |
| Done when | Seed threads show; a "Try your bot" chat shows up                      |

### 6.7 Usage

| Item      | Detail                                                   |
| --------- | -------------------------------------------------------- |
| Shown     | Messages used this month / the Free limit, per project   |
| Done when | Count goes up for each message sent in "Try your bot"    |

---

## 7. Demo data

| Part         | Where                                    | Detail |
| ------------ | ---------------------------------------- | ------ |
| Types + seed | `packages/shared/src/demo/`              | `DemoProject`, `DemoKnowledgeSource`, `DemoConversation`, `DemoMessage`, and the seed for each. Plain data, no I/O. |
| Scripted replies | `packages/shared/src/demo/`          | Q&A per sample project and `getScriptedReply` |
| Store        | `apps/web` (client)                      | Seeded from `packages/shared` on first visit, saved to `localStorage`, "Reset demo" restores the seed. A read or write that throws falls back to the seed. |

Nothing is stored on a server. Each browser has its own copy.

---

## 8. API routes

None. The demo has no API routes. The sign-in pages set the cookie with a server action or on the client.

---

## 9. Security rules

| Risk          | Rule                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------ |
| Fake auth     | The demo login is not real auth. Never collect or store a password. Say so on the card (§6.2). |
| XSS           | Messages, titles and names render as text, never HTML.                                     |
| Clickjacking  | Every page sends `frame-ancestors 'self'`.                                                 |
| Secrets       | There are none. Never commit a `.env` file or add a key.                                   |

---

## 10. Repo layout

```
apps/
  web/            # Next.js: landing, sign in / up, dashboard
packages/
  shared/         # APP_NAME, plan labels, demo types, seed data, scripted replies
docs/
  project.md      # this file
  plan.md         # phases (human-written)
```

`apps/widget` and `packages/db` are not part of the demo. `packages/db` is deleted in Phase 2.

---

## 11. Environment variables

| Variable              | Used by         | Public? |
| --------------------- | --------------- | ------- |
| `NEXT_PUBLIC_APP_URL` | Client + server | Yes     |

`.env.example` lists it with no value. `.env` is never committed.

---

## 12. Out of scope

| Feature                                            | Reason                               |
| -------------------------------------------------- | ------------------------------------ |
| Real auth, Google sign-in                          | Demo: any login works                |
| Database, migrations                               | Demo data lives in the browser       |
| Real AI answers, embeddings, file parsing          | Scripted replies are enough for a demo |
| Embeddable widget, Install snippet                 | Not part of the demo screens         |
| Customize page, Stripe billing, plan gating        | Pricing is display only              |
| Rate limiting, prompt-injection checks (Arcjet)    | No AI calls to protect               |
| Funnel events table                                | No database; Vercel Analytics only   |

---

## 13. Design

Every screen follows this. Agents don't pick their own style.

| Area | Look |
|---|---|
| Overall | Black and white, with glass effects (blurred, translucent panels) |
| Landing page | Dark, with simple motion: subtle entrance and scroll animations |
| Dashboard | Light, monochrome, glass panels |
| Sign-in / sign-up | Our own pages, using the dashboard's tokens: one centered glass card |
| Tokens | One set of design tokens (colors, radius, shadows, blur) shared by every page |
| States | Empty, loading and error states on every screen |
| Responsive | Works down to 375 px wide |
