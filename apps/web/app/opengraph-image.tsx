import { ImageResponse } from "next/og";
import { APP_NAME } from "@askwell/shared";

// Token values from globals.css (ink and paper). ImageResponse can't read CSS variables.
const INK = "#1c1b19";
const PAPER = "#ffffff";

const TAGLINE = "An AI support chat widget for any website.";

export const alt = `${APP_NAME}: ${TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The link preview: flat, ink on paper, the mark, the name and one line. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 88,
          background: PAPER,
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Same mark as app/icon.svg, without its paper background. */}
          <svg width="72" height="72" viewBox="3 3 26 26">
            <path d="M3 4h26v18H13l-7 6v-6H3z" fill={INK} />
            <path d="M8 10.5h16M8 15.5h9" stroke={PAPER} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 40, letterSpacing: "0.12em", textTransform: "uppercase" }}>{APP_NAME}</div>
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.1, maxWidth: 940 }}>{TAGLINE}</div>
        <div style={{ display: "flex", fontSize: 32 }}>A demo. Sign in with any email and look around.</div>
      </div>
    ),
    size,
  );
}
