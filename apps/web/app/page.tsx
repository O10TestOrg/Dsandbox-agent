import { APP_NAME } from "@askwell/shared";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
      <h1 className="text-5xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="text-lg text-white/70">An AI support chat widget for any website. Landing page coming soon.</p>
    </main>
  );
}
