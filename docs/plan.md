# Plan

The build order for Askwell. `docs/project.md` describes each feature in detail.

**Askwell is a demo.** From Phase 2 on, there is no real auth, database, AI or payments. Any login opens a dashboard with predefined projects, knowledge and chats that show how the product would work. Phases 0–1 built backend pieces (Neon, Drizzle, Better Auth) that Phase 2 removes.

## Rules

- Build phases in this order. Don't add, remove, or reorder phases.
- Every phase after Phase 0 has two parallel lanes, one per developer, so nobody waits.
- Each phase is one board in JSM HQ. The lead creates the board and its tasks there, with the product owner, before the phase starts. The next phase can be broken down while the current one is being built.
- Tasks and their status live only in JSM HQ. This file never lists tasks.
- A phase is done when all its tasks are merged and its "Done when" checks pass on the latest Vercel preview. Production goes live only once, in Phase 4.
- The lead merges a PR once CI passes and every review thread is answered. The developer then deletes the branch.
- Each phase lists the keys it needs. When an agent reaches a step that needs one, it stops and asks (see `CLAUDE.md`), and the product owner adds it. Agents never create accounts or handle raw keys in chat. The demo phases need none.
- Keep JSM HQ's "Export plan to docs/plan.md" off. It would overwrite this file.

---

## Phase 0 — Setup

**Goal:** an empty app that builds and deploys. This is the only phase with one lane, because everything else builds on it.

**Lanes:** one. The lead plans it like any other phase, and gives every task to one developer.

**Keys needed:** none at the start. The product owner connects Vercel during this phase, before its last task: imports the repo (automatic promotion off), allows `*.vercel.app` in each developer's sandbox, and adds `VERCEL_AUTOMATION_BYPASS_SECRET` to each developer's env file (Vercel → Deployment Protection → Protection Bypass for Automation). The product owner also creates the Neon project (branches `main` and `dev`) and installs the Neon–Vercel integration with a branch per preview. The lead plans the Vercel check as the last task.

| Includes                                                                  | project.md |
| ------------------------------------------------------------------------- | ---------- |
| Monorepo with `apps/web`, `apps/widget`, `packages/shared`, `packages/db` | §10        |
| Next.js app with TypeScript and Tailwind                                  | §3         |
| Vercel project: a preview per PR, production from `main` (automatic promotion off) | §3, §4 |
| `.env.example` with every variable                                        | §11        |

**Done when:** a PR gets a Vercel preview URL with its own Neon branch, and the home page loads on it.


---

## Phase 1 — Foundation (built before the demo pivot)

**Goal:** the shared contract, the database, sign-in, and the public face of the app.

**Keys needed:** `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for the Neon `dev` branch, the Neon MCP connected to each developer and limited to non-production branches, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Google OAuth client with the dev and preview callback URLs)

| Lane                        | Includes                                                                                                                                                | project.md |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **A — Contract + database** | Drizzle schema for all tables (incl. Better Auth's), pgvector, generated migrations, the DB client, owner-scoped query helpers, pglite test helper. Shared types for every API route. Plan limits. | §5, §7, §8 |
| **B — Auth + shells**       | Better Auth setup (`/api/auth/[...all]`), sign in / sign up pages, middleware, `plan = free` on new users, empty dashboard layout with navigation, landing page (static, no live widget yet) | §6.1, §6.2, §13 |

Lane B uses Better Auth's own schema from Lane A's first task; that task goes first.

**Done when:** migrations run on `dev`; a new user signs up (email or Google) and lands on an empty dashboard; the landing page is live.


---

## Phase 2 — Demo foundation

**Goal:** any login opens a dashboard shell; the backend is gone.

**Keys needed:** none. After this phase merges, the product owner may remove the Neon–Vercel integration and the old env vars from Vercel.

| Lane                       | Includes                                                                                                                                       | project.md |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **A — Demo data + cleanup** | Demo seed data and types in `packages/shared` (projects, knowledge sources, conversations, usage, scripted replies). Then remove `packages/db`, Better Auth, the DB migrate step, unused API types and env vars. | §5, §7     |
| **B — Demo login + shell** | `/sign-in` and `/sign-up` accept any email and password and set a demo cookie; `proxy.ts` redirects to sign-in without it; sign out clears it. Dashboard layout with navigation and "Reset demo". | §6.2, §13  |

Lane A's cleanup task goes last: it deletes code only once Lane B no longer imports it.

**Done when:** on the preview, any email and password land on the dashboard; sign out returns to sign-in; the preview builds with no database or auth env vars.

---

## Phase 3 — Demo screens

**Goal:** every dashboard screen works on predefined data.

**Keys needed:** none

| Lane                              | Includes                                                                                                                                        | project.md       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **A — Projects + knowledge**      | The demo store (seeded from `packages/shared`, saved in `localStorage`, reset). Projects list, create, rename, delete. Knowledge: list sources with status, add text or a file (fake processing → ready), delete. | §6.3, §6.4, §7   |
| **B — Conversations + bot + usage** | Conversations list and thread. "Try your bot" chat panel per project with scripted replies; a new chat shows up in Conversations. Usage per project. | §6.5, §6.6, §6.7 |

Lane B uses the seed data read-only until Lane A's store is merged.

**Done when:** on the preview, click through every screen; a "Try your bot" chat appears in Conversations and raises Usage; "Reset demo" restores the seed data.

---

## Phase 4 — Polish + launch

**Goal:** the demo flow works on production.

**Keys needed:** none. At the end, the product owner promotes the build.

| Lane                 | Includes                                                                                   | project.md |
| -------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| **A — Polish**       | Responsive down to 375 px, empty, loading and error states on every screen                 | §13        |
| **B — Landing + launch** | Landing page copy and CTA ("Try the demo"), pricing shown as display only, run the demo flow on `main` | §2, §6.1   |

**Done when:** the product owner promotes the build; every step of the demo flow (§2) passes on the production URL.
