import { APP_NAME } from "@askwell/shared";

// A layout only so the client-side Projects page gets a title: the tab pages below set their own.
export const metadata = { title: `Projects · ${APP_NAME}` };

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
