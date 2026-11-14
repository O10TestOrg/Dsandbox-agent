import type { Metadata } from "next";
import { APP_NAME } from "@askwell/shared";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: `${APP_NAME} demo`,
  description: "A demo of an AI support chat widget. Sign in with any email, add product info and chat with a scripted bot.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
