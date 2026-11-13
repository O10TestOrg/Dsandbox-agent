// Run from the repo root via `pnpm db:generate` / `pnpm db:migrate`.
export default {
  dialect: "postgresql",
  schema: "./packages/db/schema",
  out: "./packages/db/migrations",
  // Migrations need a direct (non-pooled) connection.
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? "" },
};
