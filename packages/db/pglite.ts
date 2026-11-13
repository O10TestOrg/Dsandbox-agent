import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite-pgvector";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema";

const migrationsDir = join(fileURLToPath(new URL(".", import.meta.url)), "migrations");

/**
 * In-memory Postgres for tests: pgvector enabled, every migration applied in order.
 * Each call returns a fresh, isolated database.
 */
export async function createTestDb() {
  const client = new PGlite({ extensions: { vector } });
  await client.exec("CREATE EXTENSION IF NOT EXISTS vector;");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
    const sqlText = readFileSync(join(migrationsDir, file), "utf8");
    for (const statement of sqlText.split("--> statement-breakpoint")) {
      if (statement.trim()) await client.exec(statement);
    }
  }
  const db = drizzle(client, { schema });
  return { db, client };
}
