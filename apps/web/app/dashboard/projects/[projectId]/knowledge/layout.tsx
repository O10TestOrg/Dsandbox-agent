import { APP_NAME } from "@askwell/shared";

// A layout only so the client-side Knowledge page gets a title.
export const metadata = { title: `Knowledge · ${APP_NAME}` };

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
