# Askwell

AI support chat widget for any website.

## Getting started

Needs Node 24 and pnpm 10.

```bash
pnpm install
cp .env.example .env   # then fill in the values
```

Checks (all must pass before a PR):

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Deploys

- Every PR gets a Vercel preview. While the Neon–Vercel integration is linked, each preview gets its own Neon branch (`preview/<branch>`).
- The Vercel project's Root Directory is `apps/web`, with files outside the root included (the app uses `packages/shared`). Install runs from the repo root with pnpm.
- Vercel skips a build when nothing `apps/web` depends on changed ("Skipped - Not affected").
- Previews are protected. Send the header `x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET`.
- Production is promoted by hand. Only the product owner does that, and runs any production migration first.
