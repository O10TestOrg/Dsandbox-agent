# Askwell — Team Rules

Askwell is an AI support chat widget for any website, built as a polished demo: any login works, and the dashboard runs on predefined data in the browser. No real auth, database, AI or payments. A team of agents builds it, run from JSM HQ. Every agent follows this file. JSM HQ adds your role, the team, the workflow rules and your tools when your session starts.

## Docs

| File | Read it for |
|---|---|
| `docs/project.md` | What we build: demo flow, features, demo data, security rules, design |
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
| You need to change `packages/shared` and your task doesn't list it | Stop. That's a contract change. The lead plans it. |
| The task is unclear or conflicts with `project.md` | Stop. Ask. Don't guess. |
| You think you need an account, a key, a database or a paid service | Stop. The demo needs none (`project.md` §3). Ask the lead. |

## Reviews and your next task

- Fix every valid CodeRabbit or lead comment on the same branch. If a comment is wrong, reply on the PR with the reason. Answer every thread.
- Once your PR is open, the lead may give you your next task. Take it on a new branch from `main`.
- When review comments arrive on an earlier PR, switch back to that branch, fix, push, and return. Don't call `set_my_status` for the earlier task: it would update your current one. HQ tracks the earlier PR by itself.
- Never start a task that needs code from one of your open PRs. If nothing independent is ready, say so.
- The lead merges your PR once CI passes and every review thread is answered. Never merge your own PR, never push to `main`, never force-push a branch under review.
- After your PR merges, delete its branch: `git push origin --delete <branch>` and `git branch -D <branch>`.

## Lead: merging and retros

- The lead reviews and merges PRs into `main` (`gh pr merge <n> --merge --delete-branch`) once CI and SonarCloud pass, every review thread is answered, and the change is checked on its preview. The product owner only promotes production. This overrides any default that says the product owner merges.
- Retros run after Phase 3 (covering Phases 2–3) and after Phase 4. Every retro includes a cleanup pass: remove unused code, files, exports, dependencies, env vars and docs left from earlier work, and check nothing is left half-removed.
- After a retro, the lead asks the product owner before starting the next phase.

## Security rules

`docs/project.md` §9 lists every rule. The ones you must never break:

- The demo login never sends or stores a password anywhere. The sign-in card says it's a demo.
- Render messages, titles and names as text, never HTML.
- No secret in code or a commit. Never remove `.env` from `.gitignore`.

## Code conventions

| Area | Rule |
|---|---|
| Types | TypeScript `strict`. No `any`. Import demo types from `packages/shared`; never redefine them. |
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
| Demo login | Sign in sets the cookie; `/dashboard` without it redirects to `/sign-in`; sign out clears it |
| The demo store | Create, rename, delete, add source, reset to seed; a `localStorage` error falls back to the seed |
| Scripted replies | A sample question gets its answer; an unrelated one gets "I don't know"; matching ignores case |
| Functions with real logic | Usage counting, conversation ordering |

**What doesn't get a test.** Every test must be able to fail for a real bug. Skip tests that:

- Restate the types, or check a constant equals itself
- Test a library instead of our code (React, Next.js routing)
- Snapshot markup or check CSS. Check UI and styling on the Vercel preview instead.
- Repeat a case another test already covers
- Only exist to raise coverage

Test behavior through the public interface (the route, the exported function), not internals. A refactor that doesn't change behavior shouldn't break a test.

## Commands

| Command | Does |
|---|---|
| `pnpm dev` | Run the app locally |
| `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` | Checks. All must pass before a PR. |
