# Askwell — Design rules

Replaces the old glass style in `project.md` §13. Every screen and component follows this. When a choice is unclear, pick the quieter, simpler option.

> Source text arrived garbled. Reconstructed lines are marked **(assumed)**. The lead confirms them with the product owner.

## 1. Restraint
Calm, minimal, content-led. Every element earns its place. Remove before you add. Prefer whitespace over boxes, dividers and decoration. Hierarchy comes from size, space and placement, not heavy weights, many colours or loud effects.

## 2. Tokens first
All design decisions live as tokens in one place (CSS variables / Tailwind theme). Never hard-code values in components.

- **Colour:** one warm near-black "ink" on white, a soft neutral surface, a muted grey for secondary text, a hairline border colour. No brand colour flooding the UI. The dark/inverse theme re-scopes the same tokens.
- **Spacing:** a gutter token and a section-space token that grow at each breakpoint.
- **Type scale:** caption, body, heading, display. Fluid `clamp()` for large sizes.
- **Radius:** square corners on surfaces; pill for buttons **(assumed)**. Nothing in between.
- **Motion:** one easing curve, one short duration (~200 ms). Respect `prefers-reduced-motion`.

## 3. Typography
- One typeface, one regular weight (400). Never bold headings.
- Hierarchy = size and space.
- Small UPPERCASE eyebrow labels (tracking ~0.12em) above titles and for group labels.
- Secondary info (dates, counts) in muted grey with tabular numerals.
- Emphasis: only the key fact (a number, a deadline, a name) gets `<strong>`, while the surrounding text is muted. Max one per paragraph.
- `text-wrap: balance` on headings, `pretty` on paragraphs.
- Left-align text, including empty states.

## 4. Layout
- Shared containers: page (wide), prose (~40 rem for reading). Footer shares the header's left edge.
- Generous vertical rhythm from the section-space token, not from lines.
- Tight grids for visual items, airy gaps between rows.
- Mobile first. 20 px gutter at 375 px and up **(assumed)**. No horizontal scroll.
- One consistent left edge. Labels, inputs and buttons in a form share the same width and edge.

## 5. Borders and surfaces
- Hairline 1 px borders in a very light grey. Ink border only for emphasis (secondary buttons, focus).
- Prefer a subtle surface tint (`#f6f5f3`-like) over a border for grouping.
- No shadows, no glass, no blur, no gradients. Square corners on surfaces.

## 6. Buttons and links
- Three button styles: primary (ink fill, pill), secondary (ink outline, pill), and a quiet text/ghost button **(assumed)**. 48 px minimum height.
- Inline links are underlined and fade on hover. Nav and footer links have no underline until hover or the current page.
- One primary action per view.

## 7. Icons
- One icon set: 24 px grid, 1.25 px stroke, round caps and joins, no fill, inherits `currentColor`. No two-tone, no emoji.
- Shown at 20 px. Always paired with an accessible label. Decorative ones are `aria-hidden`.

## 8. Navigation
- Slim sticky header with a hairline bottom border. Wordmark left, few text links, 2–4 icon actions right. On mobile, collapse into one menu icon.
- Max ~5–6 top-level items. The rest go in the footer or a menu.
- Show the current location (`aria-current`, underline). Never rely on hover menus or tooltips alone.

## 9. Colour as signal
- The UI is monochrome. Colour only signals state (success, warning, error, info), as a small glyph or dot before the text. The text stays ink.
- Dusty, desaturated tones, ≥ 3:1 contrast, lighter variants in dark theme.
- Two reusable components: an inline message (glyph + text) and a hairline-bordered notice. Never colour whole paragraphs.

## 10. Language
- Plain, short, human. "Add project", not "Add new project to your account". Prefer 1–3 word labels.
- Sentence case everywhere except eyebrows.
- Errors: say what happened. Calm, specific, no exclamation marks, no jargon, no error codes.
- Empty states: one line of explanation and one clear action.
- If a label needs a tooltip, rename the label.
- One word per concept across the product.

## 11. Interaction and states
- Every interactive element has hover, focus-visible (2 px ink outline, 3 px offset), disabled (40% opacity) and loading states.
- Feedback is subtle: a fade or a glyph filling in. Never bouncing or sliding.
- Forms: visible label above each field, never placeholder-only.

## 12. Accessibility
WCAG AA contrast, semantic HTML, `role="status"` for live messages, 48 px touch targets.

## Output rules
- Build primitives first (container, section, button, link, eyebrow, meta text, signal message, status dot, icon), then compose pages from them.
- No new colours, radii, weights or shadows. If something seems to need one, propose a token instead.
- Before finishing, ask: what can I remove? what is still shouting? what reads in 2 seconds?
