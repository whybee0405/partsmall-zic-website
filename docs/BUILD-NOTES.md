# Build notes

State of the code as of 2026-08-12. Read alongside `docs/LANDING-PAGE-SPEC.md`.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Node 24, npm 11. Next 15.5, React 19, Tailwind v4, Lenis 1.3, Motion 12.

## Where things live

```
app/
  globals.css        token layer, mirrors the ZIC collection in Figma
  layout.tsx         fonts, metadata, skip link, SmoothScroll mount
  page.tsx           section order
components/
  SmoothScroll.tsx   Lenis + parallax mount, skipped under reduced motion
  FilmRail.tsx       left-edge cross-section / mobile progress bar
  Nav.tsx            fixed nav, resolves solid after 80px
  ui.tsx             Stamp, Cta, ClaimChip, Notice, Rule
  sections/          one file per section, named for the section
content/
  products.ts        the five SA products, typed
  sections.ts        section register, drives the Film Rail
  cta.ts             PRIMARY_CTA — the ecommerce swap happens here
  proof.ts           authority claims, each sourced in RESEARCH.md
  branches.ts        branch counts and enquiry form options
lib/
  parallax.ts        the rAF plane loop
public/
  products/          genuine SK ZIC renders, transparent
  plates/            oil film, crown splash, vortex, location photography
```

## The parallax loop

`lib/parallax.ts` is the only thing that writes transforms for scroll. Elements
opt in with `data-plane="0|1|2"`; speed comes from `PLANE_SPEED`.

Two decisions worth knowing before you change it:

1. **Planes anchor to their own `<section>`, not the document.** Anchoring to the
   document accumulates offset down an 11,000px page and the bottom sections end
   up hundreds of pixels out of place. Section-relative keeps every chamber
   composed as designed.
2. **Speeds soften below 768px** (`PLANE_SPEED_COMPACT`). Short viewports
   overshoot at full strength and elements visibly clip.

Under `prefers-reduced-motion` the loop never starts, Lenis is never constructed,
and CSS forces `transform: none` on every plane.

## Current state

| Section | Status |
|---|---|
| 01 Hero | Built. Static composition; the pinned scrub is not wired yet. |
| 02 Splash | Built. Splash and product are on separate planes, but the `0.72 → 1.12` scale scrub is not wired. |
| 03 The Five | Built. Reveal runs on `whileInView` with a 70ms stagger, not on a scroll scrub. |
| 04 Proof | Built. |
| 05 Ch.01 Inside | Built. The three lubrication states render side by side; the pinned horizontal scrub is not wired. |
| 06 Ch.02 YUBASE | Built. |
| 07 Ch.03 VHVI | Built. Curves draw on `whileInView`; the scroll-scrubbed readout head is not wired. |
| 08 Ch.04 Products | Built, fully interactive. Filter and disclosure work. |
| 09 Ch.05 ATF MULTI | Built. |
| 10 Ch.06 Distribution | Built. |
| 11 Enquire | Built. **Form posts to `/api/enquire`, which does not exist yet.** |
| 12 Footer | Built. |

### Deliberately not done yet

The spec's build order says steps 1 to 3 should produce a complete, shippable
page with no motion, and that animation gets added to a page that already works.
That is where this is. What remains:

1. **GSAP ScrollTrigger pins.** Hero (360vh), Ch.01 states (200vh), Ch.03
   scrubber (220vh). GSAP is not yet a dependency; add it when wiring these.
2. **The enquiry endpoint.** `app/api/enquire/route.ts` plus a server action,
   destination inbox, and optional CRM webhook. Field validation on blur and the
   focus-first-invalid-field behaviour are specified but not implemented.
3. **Ch.03 readout head** tracking scroll position across the temperature axis.
4. **Mobile Ch.03 carousel** and the Ch.01 swipe panels.
5. **AVIF/WebP conversion** with `srcset` widths. Currently serving PNG/JPEG
   through `next/image`, which handles format negotiation but not art direction.

## Known content issues

Carried from `docs/LANDING-PAGE-SPEC.md §9`. These are content blockers, not
code ones.

- ❗ `public/products/zic-x3000-15w40-6l.png` is **placeholder art**: a genuine
  SK ZIC X3000 render, but the 20W-50 4 L Pakistan pack. No 6 L render exists on
  any SK ZIC channel. Flagged in `content/products.ts` via `imageNote`.
- ❗ X3000 API category conflicts: the Parts-Mall master says CG-4, SK ZIC's
  catalogue and the pack artwork say CF-4. The code ships CG-4.
- ZIC X5 10W-30 is only available at 380px. Do not upscale it with a model; an
  attempt reconstructed the label as `SK ɘrmonƨ` / `SUNTHE3C` / `ZJC`.
- TDS and MSDS links in the footer are `#`.

## Budgets

| Metric | Budget | Now |
|---|---|---|
| First load JS | 180 kB | 161 kB |
| `public/` weight | — | 3.5 MB (from 26 MB) |

The hero canister is the LCP element and carries `priority`. It must not queue
behind the splash plate.
