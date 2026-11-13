import "server-only";
import { headers } from "next/headers";
import { getAuth } from "./auth";

/** The signed-in session for this request, or null. Owner pages and routes call this on the server. */
export async function getSession() {
  return (await getAuth()).api.getSession({ headers: await headers() });
}
