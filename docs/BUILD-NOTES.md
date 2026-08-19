# Build notes

State of the code as of 2026-08-12. Read alongside `LANDING-PAGE-SPEC.md`.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Node 24, npm 11. Next 15.5, React 19, Tailwind v4, GSAP 3.13 (ScrollTrigger), Lenis 1.3.

## Where things live

```
app/
  globals.css        token layer, mirrors the ZIC collection in Figma
  layout.tsx         fonts, metadata, skip link, SmoothScroll mount
  page.tsx           section order
components/
  SmoothScroll.tsx   mounts the scroll stack, skipped under reduced motion
  FilmRail.tsx       left-edge cross-section / mobile progress bar
  Nav.tsx            fixed nav, resolves solid after 80px
  ui.tsx             Stamp, Cta, ClaimChip, Notice, Rule
  sections/          one file per section
                     OpeningSequence.tsx is sections 01-03 scrubbed;
                     Hero/Splash/TheFive are its reduced-motion fallback
content/
  products.ts        the five SA products, typed
  sections.ts        section register, drives the Film Rail
  cta.ts             PRIMARY_CTA — the ecommerce swap happens here
  proof.ts           authority claims, each sourced in RESEARCH.md
  branches.ts        branch counts and enquiry form options
lib/
  scroll.ts          Lenis + GSAP ticker sync, ScrollTrigger registration
  parallax.ts        the rAF plane loop
public/
  products/          genuine SK ZIC renders, transparent
  plates/            oil film, crown splash, vortex, location photography
```

## Motion architecture

Two systems, and they do not overlap.

### 1. GSAP ScrollTrigger scrubs — `lib/scroll.ts`

Used where scroll position *is* the timeline: the opening sequence, Ch.01's
lubrication states, Ch.03's temperature readout.

**Stages are pinned with CSS `position: sticky`, not `ScrollTrigger.pin`.**
Sticky needs no pin-spacer, causes no layout shift on refresh, and does not
fight Lenis. ScrollTrigger's only job is mapping scroll progress onto the
timeline. Scroll distance comes from the wrapper's height, so shortening the
sequence on mobile is a class change, not a second timeline.

**Lenis is driven from GSAP's ticker**, and ScrollTrigger is updated from
Lenis's scroll event. Left independent, they run a frame apart and every scrub
feels rubbery.

### 2. Plane parallax — `lib/parallax.ts`

Used on the ordinary scrolling chapters, where there is no timeline to scrub:
the background plates in Ch.02 and Ch.06. Elements opt in with `data-plane`.

Two decisions worth knowing before you change it:

1. **Planes anchor to their own `<section>`, not the document.** Anchoring to the
   document accumulates offset down an 11,000px page and the bottom sections end
   up hundreds of pixels out of place.
2. **Speeds soften below 768px** (`PLANE_SPEED_COMPACT`). Short viewports
   overshoot at full strength and elements visibly clip.

Sections that are sticky-pinned deliberately carry **no** `data-plane`: a plane
transform on a sticky element fights its own positioning.

### Reduced motion

`prefers-reduced-motion` is handled at the top, not per-animation. Lenis is never
constructed, the parallax loop never starts, no ScrollTrigger is created, and the
three scrubbed sections render a static fallback branch showing the same content
already resolved. `OpeningSequence` falls back to `Hero` + `Splash` + `TheFive`,
which exist only for that purpose.

### Why Framer Motion is gone

It was doing entrance reveals and one disclosure panel. Once GSAP arrived for the
scrubs, carrying both cost 42 kB for work CSS already does: the product table
discloses with a `grid-template-rows` transition, which is what the spec asked
for anyway. First load went 214 kB → 172 kB.

## Current state

| Section | Status |
|---|---|
| 01-03 Opening sequence | **Built and scrubbed.** One sticky stage, 360vh desktop / 220vh mobile. Type gives way to product, splash erupts, four products emerge from behind the centre with staggered leader lines and callouts. |
| 04 Proof | Built. |
| 05 Ch.01 Inside | **Built and scrubbed.** Three lubrication states cross-fade across 280vh, and the oil film in the photograph thins with them. |
| 06 Ch.02 YUBASE | Built. Background plate on parallax plane 0. |
| 07 Ch.03 VHVI | **Built and scrubbed.** Readout head travels the temperature axis across 300vh, both curves draw via stroke-dashoffset, scenario stops light as the head passes. |
| 08 Ch.04 Products | Built, fully interactive. Filter and disclosure work. |
| 09 Ch.05 ATF MULTI | Built. |
| 10 Ch.06 Distribution | Built. Background plate on parallax plane 0. |
| 11 Enquire | Built. **Form posts to `/api/enquire`, which does not exist yet.** |
| 12 Footer | Built. |

### Deliberately not done yet

1. **The enquiry endpoint.** `app/api/enquire/route.ts` plus a server action,
   destination inbox, and optional CRM webhook. Blur validation and the
   focus-first-invalid-field behaviour are specified but not implemented.
2. **Mobile Ch.03 carousel** and Ch.01 swipe panels. Both currently reuse the
   desktop scrub at a shorter distance, which works but is not the designed
   mobile interaction.
3. **AVIF/WebP conversion** with `srcset` widths. `next/image` negotiates format
   but not art direction.
4. **Real-device pass.** The scrubs have not been tested on a mid-range Android,
   which is what the primary user is actually holding.

## Known content issues

Carried from `LANDING-PAGE-SPEC.md §9`. These are content blockers, not
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
| First load JS | 180 kB | 172 kB |
| `public/` weight | — | 3.5 MB (from 26 MB) |

The hero canister is the LCP element and carries `priority`. It must not queue
behind the splash plate.
