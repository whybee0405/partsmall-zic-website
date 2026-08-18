# Custom cursor — design

## Context

SK ZIC South Africa is a premium, cinematic single-page marketing site with a restrained
industrial/engineering visual language (carbon/graphite/steel palette, ZIC red and oil-gold
accents, monospace technical stamps, hairline rules) and its own bespoke motion system
(`lib/parallax.ts` rAF loop, GSAP already a dependency, Lenis-driven smooth scroll). Roughly
two-thirds of the site's chapters are dark chambers (`dark: true` in `content/sections.ts`),
alternating with light chambers as the user scrolls.

The request: replace the native cursor with something that fits the brand, ideally built on
an existing library rather than from scratch, covering the standard interaction states.

## Goals

- Custom cursor that reads as an abstract ZIC brand mark (red dot + ring), not literal
  iconography — matches the site's existing restraint (no other literal icons in the design).
- Covers the states that actually exist on this site: default, hover (links/buttons/tabs),
  magnetic pull on primary CTAs, text-input hover, and disabled/wait.
- Legible against both chamber backgrounds (and photography) without manually tracking scroll
  position against chapter boundaries.
- Fully inert on touch devices and under `prefers-reduced-motion: reduce` — native cursor only.

## Non-goals

- Content-aware states (e.g. a "view product" label on product cards, a state tied to
  film-rail scrubbing). Explicitly out of scope per user decision — core UI states only.
- Drag state. Nothing on the site is currently draggable; the chosen library supports it,
  so it can be wired later if a draggable element is added, but nothing is built for it now.
- Any literal automotive/oil iconography (drop, gauge, wrench) — abstract mark was preferred.

## Library choice

Evaluated against the current stack (GSAP already a dependency, no Framer Motion, mostly
bespoke motion primitives):

- **Cuberto `mouse-follower`** (chosen) — GSAP-based, so it uses the animation engine already
  in `package.json` rather than adding a second one. Ships an automatic state-detection system
  (CSS-selector → state map) plus hover, active, sticky/magnetic, text, media, and hidden
  states out of the box. Most mature/battle-tested of the options surveyed.
- `react-creative-cursor` — pure React, no separate imperative library to wire up, but younger
  and less proven. Passed over in favor of reusing the existing GSAP dependency.
- `react-animated-cursor` — lightweight, but only click/hover states; would still require
  building magnetic pull and text/disabled handling by hand, defeating the point of using a
  library.

No surveyed library ships pre-themed automotive/oil cursor art — that part is always custom
skinning on top, regardless of library choice.

## Architecture

New client component `components/Cursor.tsx`, mounted in `app/page.tsx` alongside `Nav`,
`FilmRail`, and `BackToTop` (same "global overlay" pattern those already use).

`Cursor.tsx`:

- On mount (`useEffect`), checks `matchMedia('(hover: hover) and (pointer: fine)')` **and**
  `matchMedia('(prefers-reduced-motion: no-preference)')`. If either is false, the library is
  never initialized and the function returns early — native cursor is untouched. This mirrors
  the existing `@media (hover: hover) and (pointer: fine)` gate on button hovers in
  `globals.css`, and the existing global reduced-motion block.
- If both checks pass, dynamically imports and instantiates `mouse-follower`, configured with
  a `stateDetection` selector map (see States below) rather than `data-cursor` attributes
  sprinkled through every section component — keeps the change contained to `Cursor.tsx` plus
  CSS instead of touching every section file.
- Checked once on mount; not re-evaluated live (no realistic case of a fine-pointer device
  gaining/losing that capability mid-session on this site).
- Calls the library's `destroy()` on unmount.

## States

Scoped to interactions that actually exist on the site today:

| State | Trigger (selector) | Behavior |
|---|---|---|
| Default | idle | Solid ZIC-red dot (~6px) + thin 1px ring (~32px), ring trails with easing |
| Hover | `a, button, [role="tab"]` | Ring scales to ~48px |
| Sticky/magnetic | `.btn-primary` | Ring + dot snap and center on the button with a subtle pull — built-in library affordance, not bespoke |
| Text | `input, textarea` | Custom cursor fades to opacity 0; native I-beam takes over |
| Disabled/wait | `button:disabled` | Custom cursor hides; falls back to the `cursor: wait` already set inline in `Enquire.tsx`'s submit button |

## Visual skinning

- Dot: solid `--color-zic-red`, always — legible against both `--color-carbon` and
  `--color-eng-white`, the site's two chamber backgrounds, so it doesn't need to react to
  chamber changes.
- Ring: `mix-blend-mode: difference`, so it self-inverts for contrast against whatever is
  underneath (dark chamber, light chamber, or product photography) without tracking scroll
  position against `content/sections.ts`'s `dark` flag. Standard technique for cursors that
  must stay legible over arbitrary, changing backgrounds; also reads as a precision-instrument
  mark rather than decoration, consistent with the brand's technical tone.

## Edge cases

- SSR: `mouse-follower` must only be touched after mount (dynamic import inside `useEffect`),
  never at module scope or during render, since it manipulates the DOM directly.
- Unmount: `destroy()` must run in the effect cleanup to avoid leaking listeners on route
  changes (not applicable today — single page — but cheap to do correctly).
- The disabled/wait state relies on the custom cursor hiding cleanly so the native `cursor:
  wait` (already set inline on the submitting-state submit button) shows through with no
  double-cursor flash.

## Testing

Manual verification in a real browser (no automated test coverage planned for cursor visuals):

- Hover each target: nav links, family-filter tabs, product disclosure rows, form fields
  (text/tel/email/select/textarea), the primary CTA (magnetic pull), and the disabled
  submitting state.
- Confirm native cursor only (no custom cursor mounted) under `prefers-reduced-motion: reduce`.
- Confirm native cursor only on a touch-emulated / coarse-pointer viewport.
- Confirm the ring stays legible scrolling from a light chamber into a dark chamber and over
  product imagery.
