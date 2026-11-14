# Retro: Phase 0–1, database, contract, tooling

Reviewer: Dwight. Scope: Lane A's work on `main` at f9baa23 (PRs #2, #4, #7, #8, #10), plus process across all PRs #1–#11.
Line numbers refer to that commit. A **(contract)** tag marks a change to `packages/shared` or the schema. The lead plans those and the product owner approves them; I only flag them here.
"Known" means I checked it. "Guess" means I didn't verify it.

## Findings

| # | Area | file:line | What | Why it matters | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|---|---|
| 1 | Tooling | (no `.github/`) | No CI. Typecheck, lint, test and build only run on each agent's machine. | A green PR body proves nothing about the pushed commit. On #11 my rename commit left out the edits. My local checks passed on the working tree, and the bug was only caught by review. CI on the pushed SHA would have caught it in minutes. | must | GitHub Actions workflow: `pnpm install --frozen-lockfile`, then typecheck, lint, test, build on every PR. Make it a required check. | S |
| 2 | Database | packages/db/schema/app.ts:95 | HNSW index on `embedding`, but every search filters by `project_id`. In pgvector, an HNSW scan returns about `ef_search` (default 40) nearest rows across all projects, and the filter runs after that. | Once many projects exist, a small project's chunks are rarely in the global top 40, so `matchChunks` returns few or zero rows. The bot then says "I don't know" for questions it can answer. It won't show in tests with one project. (Known: documented pgvector behaviour. Neon reports `vector` 0.8.7, which has iterative scans.) | must (before Phase 3 `matchChunks`) | In `matchChunks`, run `SET LOCAL hnsw.iterative_scan = relaxed_order` (pgvector ≥ 0.8) in the query's transaction, or skip the ANN index for per-project search (≤ 25 sources each, so an exact scan via `knowledge_chunks_project_id_idx` is cheap). Add a test with chunks from many projects that checks a small project still gets its 5 rows. | S |
| 3 | Tests | packages/db/pglite.ts:15 | pglite serializes everything on one connection. Two "concurrent" transactions in a test run one after the other. | CLAUDE.md asks for limit tests "including two requests at once". On pglite those tests pass even with no row lock, so they can't fail for the bug they exist to catch. That's the "test that can't fail" CLAUDE.md forbids. | must (before Phase 2 limit functions) | (a) Write the counting functions as one conditional `UPDATE … RETURNING` or `INSERT … SELECT … WHERE count < limit`, so correctness doesn't depend on interleaving. Test their logic sequentially on pglite. (b) Add a small concurrency suite that runs against a real Postgres (a throwaway Neon branch via the WebSocket `Pool` on port 443, in CI). Guess: WebSockets on 443 work from our sandboxes, since HTTPS to Neon does. | M |
| 4 | Database | packages/db/client.ts:10-13 | `client.ts` throws at import when `DATABASE_URL` is unset. | Any module `next build` evaluates that imports it breaks the build where the variable is missing. It cost two rounds on #9 and #11 (lazy `getAuth()`, `force-dynamic` on pages). Every Phase 2+ route author will hit the same trap. | should | Export `getDb()`, which creates the Pool on first call and throws there if the URL is missing, or a lazy proxy. Keep `server-only`. | S |
| 5 | Database | packages/db/index.ts:3 | The public entry exports every table, and `client.ts` exports the raw `db`. Nothing stops a route doing `db.select().from(projects).where(eq(projects.id, id))`. | §9 relies on "every owner query goes through helpers". Right now that's convention only, so a tenant leak is one forgotten `where` away. | should | ESLint `no-restricted-imports` in `apps/web`: ban importing tables from `@askwell/db` and `drizzle-orm` operators outside an allowlist. Routes then call helpers only. Optionally move tables to `@askwell/db/schema` for `packages/db` internals and tests. | S |
| 6 | Database | packages/db/schema/app.ts:37-38 (and all `timestamp` columns) | `timestamp` without time zone everywhere, including `period_start`. | The monthly reset compares `period_start` with "start of this month". Without a zone, the result depends on the session/Node time zone (Vercel is UTC, local dev may not be). The result is off-by-hours resets and a wrong "used this month". | should **(contract)** | `timestamp(…, { withTimezone: true })` for new columns now. For existing ones, an additive migration plan (lead). At minimum, set the session `TimeZone=UTC` in `client.ts`. | S |
| 7 | Tooling | eslint.config.mjs:5-10 | Only `recommended` rules: no type-aware rules (`no-floating-promises`, `no-misused-promises`), and no React-hooks or Next plugin for `apps/web`. | An un-awaited query or `trackEvent` is silently dropped on Vercel when the function ends. Hook-order bugs in dashboard pages go unchecked. | should | Add `tseslint.configs.recommendedTypeChecked` (with `parserOptions.projectService`) for `packages/*` and `apps/web`, plus `eslint-plugin-react-hooks` and `@next/eslint-plugin-next` for `apps/web`. | M |
| 8 | Tests | packages/db/pglite.ts:15-26 | A fresh PGlite plus all migrations for every test: about 0.8–1.3 s each. The 18 db tests take about 18 s and grow linearly. | Phase 2–4 add many db tests. At 1 s each, the TDD loop slows down and people start skipping runs. | should | Migrate once per file (`beforeAll`), then reset between tests: `TRUNCATE … CASCADE` of app tables, or run each test inside a rolled-back transaction. Or build one migrated template and `clone()` it, if our pglite version supports that. | S |
| 9 | Contract | packages/shared/src/api/knowledge.ts:13, packages/shared/src/api/conversations.ts:14, packages/db/schema/app.ts:22-23 | Knowledge statuses and message roles are hand-written twice: as TS unions in shared and as string arrays in the pgEnums. Widget positions and animations already share one const. | Adding a status (e.g. `reclaimed`) to one side only compiles fine and fails at runtime. | could **(contract)** | Export `KNOWLEDGE_STATUSES` and `MESSAGE_ROLES` consts from shared and derive both the union and the pgEnum from them, as `WIDGET_POSITIONS` already does. | S |
| 10 | Contract | packages/shared/src/api/knowledge.ts:37-38 | `upload-url` takes `filename` and `type` separately. Nothing ties the extension to `type`. | §9 says to check "declared size and extension" at `upload-url`. Without a contract-level check, each route author must remember it. | could **(contract)** | `.refine()` that `filename` ends with `.${type}` (case-insensitive), or document that the route does it and test it there. | S |
| 11 | Contract | packages/shared/src/api/projects.ts:24, packages/shared/src/api/knowledge.ts:26, packages/shared/src/api/widget.ts:14 vs packages/shared/src/api/config.ts:7 | Some request schemas are `.strict()` (billing, config) and most aren't (they strip unknown keys). | It's harmless today: stripping is safe. But the rule is unclear for later authors, and a strict schema rejects fields a newer widget might send. | could **(contract)** | Pick one rule and write it in shared: strip by default, `.strict()` only where an unknown key signals a bug (config). | S |
| 12 | Contract | packages/shared/src/errors.ts:3,16 | `FORBIDDEN` (403) is defined but nothing uses it. Owner scoping deliberately answers 404. | Someone will reach for 403 on a foreign project and leak that it exists. | could **(contract)** | Comment that `FORBIDDEN` is not for ownership (use `NOT_FOUND`), or drop it until a real use exists. | S |
| 13 | Database | packages/db/schema/app.ts:109, 129 | `conversations` is indexed on `project_id` only, and `messages` on `conversation_id` only. Both are listed in time order. | "Newest first" and full threads sort in memory. That's fine at our size, so this is noted for scale only. | could **(contract)** | `(project_id, created_at desc)` and `(conversation_id, created_at)` indexes when Phase 4 lands. | S |
| 14 | Database | packages/db/schema/app.ts:144-145 | `events.user_id` and `events.project_id` have `ON DELETE SET NULL` but no index. | Deleting a user or project scans the whole `events` table to null the references. It grows forever (funnel log). | could **(contract)** | Indexes on `events(user_id)` and `events(project_id)`. | S |
| 15 | Database | packages/db/schema/app.ts:47, 63-65, 121-126 | Some invariants live only in app code: `button_color` hex format, `blob_pathname IS NULL` exactly when `type = 'text'`, usage columns only on `bot` rows. | Defence in depth: a bug in one route can store rows the rest of the app assumes can't exist. | could **(contract)** | `CHECK` constraints for the three rules. Each is one line and cheap to test on pglite. | S |
| 16 | Tests | packages/db/tests/app.test.ts:83-92 | "finds the nearest chunk by cosine distance" tests pgvector and Drizzle's `cosineDistance`, not our code, and without a project filter. | CLAUDE.md: don't test a library. It also gives false comfort about search (see #2). | could | Replace it with `matchChunks` tests in Phase 3 (project-scoped, `ready` sources only, many projects). | S |
| 17 | Tests | packages/db/tests/owner-queries.test.ts:49-50 vs packages/db/tests/user.test.ts:18-23 | "free by default" is asserted in both files. | It repeats a case. That's minor, but it's what CLAUDE.md asks us to avoid. | could | Keep the `getUserPlan` test, which goes through a public helper. Drop the duplicate default assertion from `user.test.ts`, or the reverse. | S |
| 18 | Database | packages/db/index.ts:1-2 | The comment says this entry "exports schema only", but it now also exports queries. | It misleads the next reader about what's safe to import client-side. Queries are still safe, since they take `db` as a parameter. | could | Update the comment. | S |
| 19 | Tooling | apps/web/package.json:22 | `@types/node` is `^26`, while `engines` and `.nvmrc` say Node 24. | Types allow Node 26-only APIs that crash on the Node 24 runtime. | should | Pin `@types/node` to `^24`. | S |
| 20 | Tooling | packages/db/package.json:20, packages/db/auth.cli-config.ts:9 | `@better-auth/cli` is `^1.4` while `better-auth` is `^1.7`. The CLI config still enables Google, which is deferred. | Regenerating auth tables with an older CLI can produce a schema that doesn't match what the 1.7 runtime expects. Google config there implies a feature we don't ship. | could | Align the CLI version with `better-auth` and remove the Google block until B1-T01. | S |
| 21 | Tooling | .gitignore:1-7 | `*.tsbuildinfo` isn't ignored. `next dev` also creates `apps/web/AGENTS.md` and rewrites `next-env.d.ts` between dev and build. | Every agent's tree shows these as untracked or modified. It invites `git add -A` mistakes and noisy diffs. | could | Ignore `*.tsbuildinfo` and `next-env.d.ts`. Decide once whether `apps/web/AGENTS.md` is committed (its own text says commit it) or ignored. | S |
| 22 | Tooling | drizzle.config.ts:7 | `url: process.env.DATABASE_URL_UNPOOLED ?? ""`. | With the variable missing, `db:migrate` fails with an unclear connection error. Inside the preview `buildCommand` that is hard to tell apart from a real migration error. | could | Throw a clear "DATABASE_URL_UNPOOLED is not set" error when running `migrate`. | S |
| 23 | Process | (all PRs) | TDD can't be verified: tests and code land in the same commit (#4, #7, #8, #10 are one or two commits). | CLAUDE.md makes test-first a rule, but reviewers can't tell. It's also how my weak sign-up test on #9 nearly slipped through, until I checked it against a mutation. | could | In the PR body, ask for "tests seen failing before the fix" (a line of the failing output), or a test commit before the code commit. | S |
| 24 | Process | (environment) | The slowest loops were all access gaps, not code: no Vercel build/runtime logs (4 round-trips through the product owner on #3, #5, #9, #11), no Neon MCP, no Postgres port, `BETTER_AUTH_URL` arriving empty twice, and GitHub rate limits. | Each failed deploy cost an hour or more of waiting. Agents had to guess causes (#11 is still unexplained). | must | 1) A read-only Vercel token for agents (`vercel inspect --logs`). 2) Attach the Neon MCP to every dev sandbox. 3) A sandbox check at startup that every App variable is non-empty. | S (product owner setup) |
| 25 | Process | apps/web/vercel.json | Vercel skips builds when nothing `apps/web` depends on changed ("Skipped - Not affected"), and the status still shows green. | An empty "redeploy" commit gives a fake green (seen on #3). | could | Document it in readme (done in #5). For a forced redeploy, the product owner uses "Redeploy" in Vercel, or the agent touches `apps/web`. | S |
| 26 | Process | pnpm-lock.yaml | Parallel lanes both edit the lockfile. The rule "second to merge regenerates" works but costs a rebuild per PR. | Merge friction scales with the number of lanes. | could | Batch new dependencies into one small "deps" PR per phase where possible. Keep the merge-main + `pnpm install` rule. | S |

## Checked, no change needed

**Shared contract**

| Item | Why it's fine |
|---|---|
| `PLAN_LIMITS` vs §5 (`plans.ts`) | Every row of §5 matches: 1/5 projects, 100/2,000 messages, 3/25 sources, and widget options, positions, animations and badge per plan. It's typed by `PlanLimits`, and the landing page reads it. |
| `LIMIT_REACHED` → 403 (`errors.ts:19`) | It's right as long as the client acts on `error.code`, not the status. 402 is taken by `PLAN_REQUIRED` ("upgrade unlocks this"). A Pro user at 5 projects can't upgrade further, so 402 would be wrong for them. 429 means "slow down", which isn't a monthly cap. Keep 403 and branch on the code. |
| Error envelope `{ error: { code, message } }` (`errors.ts`) | Matches CLAUDE.md. `ERROR_STATUS` keeps code→status in one place. |
| `chatRequestSchema` (`widget.ts`) | It trims before the 1-char minimum and the 1,000 max (§6.6), and `conversationId` is optional (§8). Tests cover the boundaries at exactly the max and one over. |
| `widgetConfigSchema` + `DEFAULT_WIDGET_CONFIG` | One source for the config shape, enums shared with the pgEnums, and a test that the default is valid. |
| `updateConfigSchema` partial + strict + non-empty | That's the right rule for a PATCH: an unknown key there is a bug, and an empty body is meaningless. |
| `uploadUrlRequestSchema` size limit | `MAX_KNOWLEDGE_FILE_BYTES` is shared with §6.4, and positive integer only. |
| `ProjectDto.messagesLimit` | The server computes the limit from the plan, so the UI never decides it (§5 rule). |
| Billing request schemas `{}` strict | No client input, so the server knows the user and the price. Matches §9 "plan bypass". |
| `APP_NAME` in one constant | Used by the landing page, layout and auth pages. Nothing is hardcoded. |

**Database**

| Item | Why it's fine |
|---|---|
| Columns vs §7 | Every table and column in §7 exists with the stated nullability. `blob_pathname` is nullable, usage columns are nullable, `stripe_customer_id` is unique and nullable, `public_key` is unique, and `widget_configs.project_id` is the PK (one per project). |
| `user.plan` text + `CHECK in ('free','pro')` | Better Auth owns the column type (text). The CHECK gives the same guarantee as an enum, and a test covers it. |
| Cascades | user → projects → config/sources/chunks/conversations → messages all cascade. `events` uses SET NULL so the funnel history survives deletes. All are tested on pglite. |
| Composite FK chunk → (source, project) (`app.ts:88-92`) | It makes "chunk and source in different projects" impossible at the DB level. That's a strong tenant guard for `matchChunks`, and it's tested. |
| `projects.messages_used` + `period_start` on the project row | This shape allows a single conditional `UPDATE … RETURNING` for `consumeMessage`, the race-free design §7 asks for. Ready for Phase 2. |
| `projects_owner_id_idx`, `*_project_id_idx` | Every owner and project-scoped lookup has its index. |
| `stripe_events(id PK)` | An insert-or-ignore on the event ID is enough for idempotency (§6.10). |
| Migration SQL (0000, 0001) | It's generated, additive only, and starts with `CREATE EXTENSION IF NOT EXISTS vector` (Neon allows it). The preview builds apply it on their own branch. |
| `client.ts` uses the WebSocket `Pool` + `server-only` | Transactions are needed for `saveChatTurn` and the row locks, and the HTTP driver can't do them. `server-only` keeps it out of client bundles (§9). Only the throw-at-import timing is a problem (finding 4). |
| Owner helpers (`queries/owner.ts`) | Each one filters by `owner_id`. A foreign ID returns `null`, which becomes 404, exactly like a missing one, so existence doesn't leak. They take `db` as a parameter, so they run on pglite in tests and inside a transaction later (`PgTransaction` is a `PgDatabase`). Tests cover the other-user case. |
| `getUserPlan` reads `user.plan` | The plan comes from the database, never the client (§9). |

**Tests**

| Item | Why it's fine |
|---|---|
| pglite applies the real migration files | Tests exercise the SQL we ship, not a `drizzle push` approximation. |
| Constraint tests (duplicate key, enums, plan CHECK, unique Stripe ID, composite FK) | Each can fail for a real bug, such as a dropped constraint in a future migration. |
| Owner-query tests go through the exported functions | They test behaviour through the public interface, with no internals. |
| Contract tests check boundaries | Exactly the max passes and max+1 fails. That's behaviour, not a restatement of types. |

**Tooling**

| Item | Why it's fine |
|---|---|
| pnpm workspace + `engine-strict` + `packageManager` pin | Same pnpm and Node everywhere, enforced. |
| `tsconfig.base.json` `strict` + `noUncheckedIndexedAccess` | These are the two flags that catch the most real bugs. `skipLibCheck` keeps typecheck fast. |
| Single root `vitest.config.ts` | One `pnpm test` runs every package. No per-package config needed yet. |
| `.env.example` vs §11 | All 14 variables are listed, with no values. |
| `.gitignore` covers `.env`, `.env*.local`, `.vercel`, `.next` | No secret or build output gets committed (§9). |
| Caret version ranges | `pnpm-lock.yaml` is committed and installs use `--frozen-lockfile` (Vercel's `installCommand`), so the ranges never float in a build. |

**Process**

| Item | Why it's fine |
|---|---|
| Branch names `feat/<topic>`, PR titles `[TASK-ID] …` | All 11 PRs follow it. |
| PR bodies: what changed, how tested, done-when | Present on every PR I checked (#2, #4, #7, #8, #10). Only #10 doesn't mention a preview, which is reasonable for a db-only change. |
| One task = one branch = one PR | Held. Review fixes went on the same branch. |

## Top 5 recommendations (ranked)

1. **Add CI on every PR** (finding 1): typecheck, lint, test and build on the pushed SHA, as a required check. It's the cheapest fix for the class of mistake that cost the most review time.
2. **Give agents Vercel build logs and the Neon MCP** (finding 24). Most Phase 0–1 delay was waiting on a human to read a log. #11's failure is still undiagnosed for that reason.
3. **Fix filtered vector search before `matchChunks` ships** (finding 2): iterative scan or exact per-project scan, plus a many-projects test. Otherwise retrieval quality degrades silently as users grow.
4. **Make the limit functions race-free by construction, and test concurrency on real Postgres** (finding 3). pglite can't fail a race test, so Phase 2's "two requests at once" tests would be theatre.
5. **Make tenant scoping and db import timing hard to get wrong** (findings 4 and 5): a lazy `getDb()`, and a lint rule that keeps tables and the raw `db` out of `apps/web` route code.
