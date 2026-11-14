# Retro: Phase 0–1, web app, UI, auth, deploy (Jim)

Reviewer: Jim. Scope: `main` at `f9baa23`, plus open PR #11 (`feat/auth-pages` at `7e98889`). This is a review only. Nothing is fixed here.

How I checked:
- Read every file in `apps/web` on `main` and in PR #11.
- Ran PR #11's tests and `next build` locally. Both pass at `7e98889`.
- Loaded the live preview with the bypass header: HTTP status of `/`, `/sign-in`, `/dashboard` and `/api/auth/*`, plus response headers.
- Took headless Chromium screenshots of the landing page at 375 px and 1280 px.
- Read the PR bodies of #2–#11.

What I couldn't check:
- I didn't see the sign-in and sign-up pages live. PR #11 had no green preview when I checked: its Vercel check had failed on an earlier commit.
- I didn't measure the client bundle size. Next 16's build output doesn't print it.

Line numbers point at `main` unless the row says `#11`.

## Findings

| # | Area | file:line | What | Why it matters | Severity | Proposed fix | Effort |
|---|---|---|---|---|---|---|---|
| 1 | Next.js / security | `apps/web/next.config.ts:3` | No security headers. The live preview sends only HSTS: no `Content-Security-Policy: frame-ancestors`, no `X-Frame-Options`. | §9 says every page except `/embed` sends `frame-ancestors 'self'`. Once #11 merges, the sign-in page can be framed by any site (clickjacking on a password form). | must | Add `headers()` in `next.config.ts`. Send `frame-ancestors 'self'` on everything except `/embed`, plus `Referrer-Policy` and `X-Content-Type-Options`. Add one test that reads the config. | S |
| 2 | Auth | `apps/web/lib/auth.ts:29` | No rate-limit config. Better Auth's built-in limiter uses memory storage, which on Vercel lives per serverless instance. | Sign-in and sign-up can be brute-forced or used to spam accounts. Each instance starts with a fresh counter, so the limit barely holds. | should | Put Arcjet (already in the stack) on `/api/auth/*`: a rate limit per IP on sign-in and sign-up, plus bot detection. Database storage for Better Auth's limiter is the alternative, but it needs a new table, which is a contract change. | M |
| 3 | Auth / deploy | `apps/web/lib/auth.ts:18` | If `BETTER_AUTH_URL` is missing, `baseURL` silently falls back to `VERCEL_URL`. That applies in production too. | In production that would be the per-deployment `*.vercel.app` URL, not the real domain. Cookies and callbacks then break after promotion, or work only on the wrong host. | should | When `VERCEL_ENV === "production"` and `BETTER_AUTH_URL` is unset, throw at first use. Keep the fallback for previews only. Add a unit test. | S |
| 4 | Deploy | `readme.md` (Deploys section) | There's no production checklist. Promotion needs, in order: `BETTER_AUTH_URL` and `BETTER_AUTH_SECRET` set for Production, `DATABASE_URL` on Neon `main`, migrations applied to `main`, then promote. | Production goes live once, by hand, in Phase 6. A missed step there causes an outage, or code that runs before its schema. | should | Add a "Promote to production" checklist to the readme Deploys section. | S |
| 5 | Deploy | `apps/web/vercel.json:5` | A production build never checks that Neon `main` has all migrations. | If someone promotes before migrating, the new code meets the old schema. It fails at runtime, not at build. | should | In the production build, add a read-only guard: compare the migration journal with `drizzle.__drizzle_migrations` and fail the build when the DB is behind. | M |
| 6 | Deploy | `apps/web/vercel.json` | Vercel skips the build ("Skipped - Not affected") when only root files change, such as `drizzle.config.ts`, the root `package.json` `db:*` scripts or `pnpm-lock.yaml` alone. | A change to the migrate setup gets no preview build, so a broken preview migrate shows up later on someone else's PR. | should | Add an `ignoreCommand` that builds when `apps/web`, `packages/*`, `drizzle.config.ts`, `package.json` or `pnpm-lock.yaml` changed. Or document in the readme that such PRs need a manual redeploy. | S |
| 7 | UI / a11y | `apps/web/components/AuthForm.tsx:17` (#11) | The inputs use `outline-none focus:border-ink`. Focus is shown only by a 1 px border change. | That's a weak focus indicator for keyboard users (WCAG 2.4.7, and 2.4.11 for focus appearance). | should | Add a shared focus-visible ring token, e.g. `focus-visible:ring-2 ring-ink ring-offset-2`. Use it on inputs, `Button` and the submit button. | S |
| 8 | UI / a11y | `apps/web/components/Button.tsx:22` | No explicit `focus-visible` style. It relies on the browser default outline. | The default outline is inconsistent across browsers and hard to see on the dark landing. | could | Use the same focus ring token as #7. | S |
| 9 | UI / tokens | `apps/web/components/AuthForm.tsx:75` (#11) | The error text uses a hard-coded `text-red-700`, not a token. | §13 says "one set of design tokens". On a dark surface red-700 would fail contrast. | could | Add `--danger` to both themes in `globals.css` and use `text-danger`. | S |
| 10 | Auth / copy | `apps/web/components/AuthForm.tsx:11-12,39` (#11) | Sign-up says "That email is already in use". Any unmapped error shows Better Auth's raw `message`. | The first reveals which emails have accounts (enumeration). That's an accepted trade-off for many products, but it's a product-owner call. The raw fallback can show library wording. | could | Product owner decides on enumeration. Map the known codes and use one generic fallback. | S |
| 11 | UI / landing | `apps/web/app/page.tsx:31` | The header has only "Start free". There's no "Sign in" link. | Returning users have no way into the dashboard from the landing page. | should | Add a "Sign in" ghost link next to "Start free" once #11 merges. | S |
| 12 | UI / landing | `apps/web/app/page.tsx:93-113` | Pricing shows limits but no price and no per-plan call to action. | §6.1 says pricing must match §5. §5 has no amount, but visitors expect one. The Pro card has no "Upgrade" or "Start" path. | could | Product owner gives the Pro price for the copy. Add "Start free" on Free and "Start free, upgrade later" on Pro. | S |
| 13 | UI / landing | `apps/web/app/page.tsx:23` | The install snippet shows `https://YOUR-DOMAIN/widget.js`. | It's fine as a placeholder, but it's easy to forget. §6.9 needs a working snippet in the dashboard. | could | Build it from `NEXT_PUBLIC_APP_URL` when the Install page is built (Phase 2+). Leave a TODO on the line now. | S |
| 14 | UI / design | `apps/web/app/globals.css:17-25` | On a pure black page there's nothing behind the glass cards to blur. In the screenshots they read as flat dark grey. | §13 asks for a visible glass effect. | could | Add a subtle background (a radial gradient or noise) to `.theme-dark` so the blur shows. Check it on the preview. | S |
| 15 | UI / landing | `apps/web/app/page.tsx:134` | The footer year comes from `new Date()` in a statically prerendered page. | The year is frozen at build time until the next deploy. That's minor and only wrong in January. | could | Accept it, or hard-code the year in a constant. | S |
| 16 | Next.js | `apps/web/next.config.ts:4` | `transpilePackages` lists `@askwell/shared` but not `@askwell/db`, which is also TypeScript source. | It builds today, because the bundler handles workspace TypeScript. The config is inconsistent, though, and may break with a bundler change. | could | Add `@askwell/db`. | S |
| 17 | Next.js / bundle | `packages/shared/src/index.ts` | The package index re-exports the zod schemas. A client component that imports any constant from `@askwell/shared` pulls zod into the browser bundle. | Today no client component imports `shared`. Phase 2 forms will, and the widget panel must stay small. | could | Add subpath exports (`@askwell/shared/constants` without zod). Or import only types in client code. | S |
| 18 | Tests | `apps/web/test/auth.test.ts:3-4` | It imports `../../../packages/db/pglite` by relative path. | It's brittle when files move, and it bypasses the package boundary. | could | Import `@askwell/db/pglite` and `@askwell/db/schema`. | S |
| 19 | Process | PRs #8, #9, #10 | The PR bodies have no preview URL. CLAUDE.md requires one. #8 and #10 are mine: I checked the preview but didn't add the URL. | The reviewer can't open the preview from the PR. | should | Add a PR template with "Preview URL:" and the done-when checklist. | S |
| 20 | Process | PR #11, commit "Rename middleware to proxy" | A rename was pushed with the test still importing `../middleware`, so the Vercel check went red. A later commit fixed it. | `pnpm test` and `pnpm build` weren't run before that push. | should | Add a pre-push hook, or a CI workflow, that runs `typecheck`, `lint`, `test` and `build`. A GitHub Actions check also makes this visible to everyone. | S |
| 21 | Process | P1F-T02 (#7) | I generated the Better Auth schema before writing its pglite tests. The tests came right after, not first. | It's a small TDD lapse. Generated code is a grey zone, but the rule is test-first. | could | For generated schema, write the "plan defaults to free" and "unique" tests first, then generate. | S |
| 22 | Process / tooling | Sandbox and HQ | Things that slowed Phase 0–1: Node and pnpm missing from the sandbox; `BETTER_AUTH_URL` empty through several restarts; Neon MCP not attached; port 5432 blocked; `*.neon.tech` and `*.vercel.app` needing approvals; `origin` still named after the repo's old owner, so `gh pr create` failed; agents can't read Vercel build logs, so the product owner had to confirm migrations. | Each one cost a round trip with the product owner. Unreadable logs block a done-when item on every database PR. | should | (a) Ship Node 24 and pnpm in the sandbox image. (b) An env-check script (`pnpm env:check`) that prints names and shapes, never values. (c) Commit a `db:migrate:ws` script that migrates over the Neon WebSocket on 443. (d) Point `origin` at `O10TestOrg/Dsandbox-agent`. (e) Give agents a read-only Vercel token, or the Vercel MCP, for deployment logs. (f) Pre-approve `*.neon.tech` and `*.vercel.app`. | M |
| 23 | Process | `pnpm-lock.yaml` | Lane A and Lane B both edit the lockfile on almost every task. | The second PR to merge always needs a merge from `main` plus `pnpm install`. | could | Batch dependency additions per phase, or let one lane own dependency PRs. The current "merge main, then `pnpm install`" rule works, so this is optional. | S |

## Checked, no change needed

| Area | Item | Why it's fine |
|---|---|---|
| UI | Landing at 375 px (screenshot) | One column, no horizontal scroll, readable type. The cards stack and the code block scrolls inside itself. |
| UI | Landing at 1280 px (screenshot) | The sections from §6.1 are there: hero, 3 steps, demo, pricing, install, footer. The live widget is deferred and the page says so. |
| UI | Contrast | Muted text is white at 65 % on black (about 8:1) and black at 60 % on `#f5f5f5` (about 5:1). Both pass AA. |
| UI | Reduced motion | All motion sits inside `prefers-reduced-motion: no-preference` (`globals.css:58`). `animation-timeline` is gated by `@supports`. |
| UI | Semantics | `lang="en"`. One `h1`, then `h2`/`h3` in order. The steps are an `ol`. The decorative chat button is `aria-hidden`. The form fields are wrapped in `label`s (#11). The error has `role="alert"`. |
| UI | Pricing numbers | They're read from `PLAN_LIMITS`, so they can't drift from §5. |
| UI | App name | Every use reads `APP_NAME`. |
| UI | Design tokens | One token set with light and dark themes, mapped into Tailwind with `@theme inline`. Components use only tokens, except finding 9. |
| Auth | Plan set by the client | `plan` and `stripeCustomerId` are `input: false` (`auth.ts:38-39`). `auth.test.ts:34-51` proves a hostile body can't set either. |
| Auth | Session on the server | `getSession()` reads `headers()` on the server (`session.ts:6`). The dashboard page checks it and redirects (#11). The proxy only checks that the cookie exists, as §6.2 intends. |
| Auth | Open redirect | No `callbackURL` or `next` parameter is read anywhere. Every redirect target is a fixed path (`/dashboard`, `/sign-in`). |
| Auth | Cookies | Better Auth defaults: `httpOnly`, `SameSite=Lax`, `Secure` with the `__Secure-` prefix on HTTPS. The proxy test covers both cookie names. |
| Auth | Base URL on previews | It falls back to `VERCEL_BRANCH_URL` / `VERCEL_URL`, both in `trustedOrigins`. `/api/auth/get-session` returns 200 on the live preview. |
| Auth | Build-time DB access | `getAuth()` imports the database client lazily, and the session pages are `force-dynamic`. `next build` never imports the DB client. I checked this by reading the code: `main` and #11 build, and `/` is prerendered. My sandbox has `DATABASE_URL` set, so I didn't test a build without it. |
| Auth | Password rules | The client has `minLength={8}`. Better Auth enforces min 8 and max 128 on the server. |
| Next.js | Server and client split | The landing and layout are server components. The only client code is `AuthForm` and `auth-client` (#11). No data fetching happens on the client. |
| Next.js | `server-only` | It guards `lib/auth.ts`, `lib/session.ts` and `packages/db/client.ts`. |
| Next.js | Secrets | There are no `NEXT_PUBLIC_*` variables. The client reads no env. The secret stays server-side. |
| Next.js | `force-dynamic` | It's used only on pages that read the session. Static pages stay static (`/` is prerendered). |
| Next.js | Next 16 proxy | In #11, `proxy.ts` exports `proxy` and its `matcher` is `/dashboard/:path*`. The build lists it as "Proxy (Middleware)". |
| Deploy | Install | `pnpm install --frozen-lockfile` fails the build on lockfile drift, which is what we want. |
| Deploy | Preview-only migrate | `VERCEL_ENV = "preview"` is the only path that migrates, and `\|\| exit 1` stops a half-migrated build. Production never migrates (§4). |
| Deploy | Root Directory `apps/web` | `apps/web` depends on `@askwell/db` and `@askwell/shared`, so database and contract PRs trigger a build. |
| Deploy | Additive migrations | `0000` and `0001` only create objects. A live version keeps working while they run. |
| Process | Branch names, PR titles, done-when | All PRs #2–#11 use `feat/<topic>` branch names, `[TASK-ID]` titles, a "how tested" section and a done-when list. |

## Top 5 recommendations

1. **Security headers now** (finding 1). This is a §9 rule, and it matters as soon as the password form ships. Effort S.
2. **Rate-limit `/api/auth/*` with Arcjet** (finding 2). It closes brute force and sign-up spam with a tool we already pay nothing for. Effort M.
3. **Make production promotion safe** (findings 3, 4, 5):
   - fail fast when `BETTER_AUTH_URL` is missing in production;
   - add a written promote checklist;
   - add a read-only "DB is behind" build guard.

   This is the riskiest step in the plan, and it's done once by hand. Effort S + S + M.
4. **Remove the agent blockers** (finding 22). Ship Node and pnpm in the image, commit an env-check script and `db:migrate:ws`, fix `origin`, and give agents read access to Vercel logs. Each blocker cost a product-owner round trip in Phase 0–1. Effort M.
5. **Enforce checks before review** (findings 19, 20). Add a CI workflow for typecheck, lint, test and build, plus a PR template with "Preview URL" and done-when. It stops red pushes and missing preview links at the source. Effort S.
