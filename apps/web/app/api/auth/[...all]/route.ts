import { getAuth } from "../../../../lib/auth";

// Resolve Better Auth per request so the database is never touched at build time.
async function handler(request: Request) {
  return (await getAuth()).handler(request);
}

export { handler as GET, handler as POST };
