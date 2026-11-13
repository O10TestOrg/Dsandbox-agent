import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type * as schema from "../schema";

/** Any Drizzle Postgres database over our schema: Neon in the app, pglite in tests. */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
