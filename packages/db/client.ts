import "server-only";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// Node has no global WebSocket in every runtime we deploy to; the Pool needs one.
neonConfig.webSocketConstructor = ws;

function createDb(connectionString: string) {
  // WebSocket Pool: supports transactions (the HTTP driver cannot).
  return drizzle(new Pool({ connectionString }), { schema });
}

export type Database = ReturnType<typeof createDb>;

let instance: Database | undefined;

/**
 * The database client, created on first call and reused for the life of the process.
 * Reads DATABASE_URL only here, never at import, so `next build` works without it.
 */
export function getDb(): Database {
  if (instance) return instance;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  instance = createDb(connectionString);
  return instance;
}
