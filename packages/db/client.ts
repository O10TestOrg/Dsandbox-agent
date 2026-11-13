import "server-only";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema";

// Node has no global WebSocket in every runtime we deploy to; the Pool needs one.
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// WebSocket Pool: supports transactions (the HTTP driver cannot).
const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema });
export type Database = typeof db;
