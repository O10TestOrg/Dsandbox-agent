# Askwell — Team Rules

Askwell is an AI support chat widget for any website. A team of agents builds it, run from JSM HQ. Every agent follows this file. JSM HQ adds your role, the team, the workflow rules and your tools when your session starts.

## Docs

| File | Read it for |
|---|---|
| `docs/project.md` | What we build: features, data model, API routes, security rules, design |
| `docs/plan.md` | The phases, in build order (human-written) |

Your task (from `get_my_task`) lists the `project.md` sections it needs. Read those, not the whole file.

## How to talk to the product owner

- Lead with the answer or result. No preamble, no recap at the end.
- Short sentences, plain words. No paragraph over 3 sentences.
- A table for comparisons, a numbered list for steps. Plain text for a short answer.
- Need a decision? Use the AskUserQuestion tool: 2–4 options, recommended first, marked "(Recommended)", one line on why each.
- One decision at a time unless they're linked. Never more than 3.
- Say what you know vs. what you're guessing.

## Branches and commits

- Every new piece of work gets its own branch off an up-to-date `main`: `feat/<topic>` or `fix/<topic>`. Do this even when your session started on another feature branch.
- Never commit or push to a branch that already exists unless the product owner or lead names that branch. The one exception: your own open PR's branch, when you're fixing its review comments (see Reviews).
- Run `git branch --show-current` before your first commit.
- Commit only the files you changed for the task. Stage them by path (`git add <path>`), never `git add -A` or `git add .`. Leave unrelated working-tree edits out.

## Before you open a PR

- Run all checks (see Commands). All must pass.
- PR body: what changed, how you tested, and the task's done-when list with each item checked or explained.
- Vercel deploys a preview of every PR. Check your change on it, and put the preview URL in the PR. If the repo isn't connected to Vercel yet (early Phase 0), say so in the PR and skip this check.

## Checking your change on a Vercel preview

- Get the preview URL from GitHub, never from the branch name (Vercel shortens long names): the Vercel comment on your PR (`gh pr view <n> --comments`), or the PR's deployment status (`gh api repos/<owner>/<repo>/deployments?ref=<branch>`). Wait until the deployment succeeds.
- Previews are protected. Send the header `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET` on every request. For browser tests, also send `x-vercel-set-bypass-cookie: true` on the first request.
- If a preview URL is blocked by your sandbox, call `request_access` for `*.vercel.app` (all previews) rather than the single URL.

## When you must stop and ask

| Situation | Do |
|---|---|
| You need to change `packages/shared`, or change or drop an existing table or column | Stop. That's a contract change. The lead plans it; the product owner approves it. |
| The task is unclear or conflicts with `project.md` | Stop. Ask. Don't guess. |
| You need an account, a key, or a sign-in | Stop. Say exactly what you need and where it goes (e.g. your env file). Accounts and sign-ins are the product owner's job. |

## Reviews and your next task

- Fix every valid CodeRabbit or lead comment on the same branch. If a comment is wrong, reply on the PR with the reason. Answer every thread.
- Once your PR is open, the lead may give you your next task. Take it on a new branch from `main`.
- When review comments arrive on an earlier PR, switch back to that branch, fix, push, and return. Don't call `set_my_status` for the earlier task: it would update your current one. HQ tracks the earlier PR by itself.
- Never start a task that needs code from one of your open PRs. If nothing independent is ready, say so.
- Never merge your own PR, never push to `main`, never force-push a branch under review.

## Database rules

- The database is Neon Postgres. The app reaches it only through Drizzle in `packages/db`. Only server code imports `packages/db`.
- There is no RLS. Every owner query goes through the owner-scoped helpers in `packages/db` (e.g. `getOwnedProject(userId, projectId)`), which filter by `owner_id`. Never query a tenant table by ID alone (see `project.md` §7 and §9).
- Schema lives in `packages/db/schema`. After a schema change, run `pnpm db:generate` and commit the generated SQL in `packages/db/migrations`. Never edit a merged migration. Add a new table or column only if your task says so.
- Test migrations and query functions on pglite (`packages/db/pglite.ts`). Never run a Docker database.
- Each PR preview gets its own Neon branch and runs its migrations there. The `dev` branch is shared by every developer: never apply an unmerged migration to it. After your PR merges, run `pnpm db:migrate` against `dev` (or use the Neon MCP).
- The Neon MCP may touch `dev` and preview branches only. Never touch the `main` (production) branch. The product owner migrates production before promoting the build.
- Migrations are additive: the live version must keep working while one runs. Dropping or renaming a table or column happens in a later PR, once no deployed code uses it.

## Security rules

`docs/project.md` §9 lists every rule. The ones you must never break:

- Read the plan on the server in every gated action. Never trust the client.
- Every owner route reads the Better Auth session on the server. Middleware only redirects; it is not the check.
- Owner reads and writes go through owner-scoped helpers. Check ownership (`getOwnedProject`) before any write.
- Verify the Stripe webhook signature on the raw body before any update.
- Render visitor messages and bot replies as text, never HTML.
- No secret in `NEXT_PUBLIC_*`, the widget bundle, or a commit. Never remove `.env` from `.gitignore`.

## Code conventions

| Area | Rule |
|---|---|
| Types | TypeScript `strict`. No `any`. Import API types from `packages/shared`; never redefine them. |
| API input | A zod schema per route, next to its type in `packages/shared` |
| API errors | `{ error: { code, message } }` with the right HTTP status |
| Tests | Vitest, written test-first. See Test-driven development. |
| New dependency | Allowed. Name it and the reason in the PR body. |
| UI | Follow `project.md` §13 Design. Reuse components in `apps/web/components`. |
| App name | `APP_NAME` from `packages/shared`. Never hardcode it. |

## Test-driven development

Write the test before the code, for any behavior that can break:

1. Write a test for the next piece of behavior. Run it and watch it fail for the reason you expect.
2. Write the least code that makes it pass.
3. Refactor with the tests green. Repeat.

**Fixing a bug:** first write a test that reproduces it and fails. Then fix it.

**What gets a test:**

| Test it | Example |
|---|---|
| Every API route: its success path and the errors its contract names | 401 with no session, 402 on Free, 404 for another owner's project |
| Owner scoping | Another user's ID returns 404, never their data |
| Plan and quota limits, including two requests at once | The 2nd project on Free is refused; the 101st message is refused |
| Functions with real logic | Chunking, plan-applied widget config, Stripe event → plan |
| Migrations and query functions | On pglite |

**What doesn't get a test.** Every test must be able to fail for a real bug. Skip tests that:

- Restate the types, or check a constant equals itself
- Test a library instead of our code (Drizzle, Better Auth, Stripe's SDK, Next.js routing)
- Snapshot markup or check CSS. Check UI and styling on the Vercel preview instead.
- Repeat a case another test already covers
- Only exist to raise coverage

Test behavior through the public interface (the route, the exported function), not internals. A refactor that doesn't change behavior shouldn't break a test.

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Run the app locally |
| `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` | Checks. All must pass before a PR. |
| `pnpm db:generate` | Generate a SQL migration from the Drizzle schema (`drizzle-kit generate`) |
| `pnpm db:migrate` | Apply migrations to the branch in `DATABASE_URL_UNPOOLED` (`drizzle-kit migrate`). Never point it at production. |
