// Server code imports `db` from "@askwell/db/client" (it is `server-only`).
// This entry exports schema only, so it is safe to import in tests and tooling.
export * from "./schema";
export * from "./queries";
