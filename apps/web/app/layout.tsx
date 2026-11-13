import type { Metadata } from "next";
import { APP_NAME } from "@askwell/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "AI support chat for any website.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
