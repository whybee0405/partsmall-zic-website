# SK ZIC South Africa — Landing Page Specification

Companion documents: `BRAND-DNA.md` (identity), `PRODUCT.md` (brief and register),
`DESIGN.md` (tokens, components, motion), `RESEARCH.md` (facts and product intelligence).

---

## 1. Stack

Matches the motion architecture of `cloudia-premium-website` (GSAP + Lenis + a token package),
drops the Payload CMS layer entirely, and adds React so component-level motion can use Framer
Motion as requested.

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15**, App Router, TypeScript, React 19 | Static export capable; `next/image` handles the AVIF/WebP pipeline |
| Styling | **Tailwind CSS v4** over the ZIC token layer in `app/tokens.css` | Tokens are the contract; Tailwind is the shorthand |
| Scroll narrative | **GSAP 3 + ScrollTrigger** | Pinned, scrubbed, multi-act timelines. Framer Motion cannot pin and scrub a sequence this long cleanly |
| Smooth scroll | **Lenis** | Same as the reference repo; synced to ScrollTrigger via `ScrollTrigger.update` |
| Component motion | **Framer Motion (`motion`)** | Entrances, staggers, disclosure rows, hover and press |
| Content | Typed TS modules in `content/` | No CMS. `products.ts`, `chapters.ts`, `branches.ts`, `proof.ts` |
| Forms | Server action to email + optional webhook | No database |
| Deploy | Static or Node on Vercel | Single page, no auth |

**Why both GSAP and Framer Motion.** They own different jobs and do not fight: GSAP drives
everything attached to a `ScrollTrigger` (hero, temperature scrubber, Film Rail); Framer Motion
drives everything attached to a component's own lifecycle. No element is animated by both.

**Hardware acceleration note.** For the pinned hero elements, write full transform strings
(`transform: "translateX(-180px) rotate(-11deg)"`) rather than Framer's `x` / `rotate`
shorthands, which run on the main thread and drop frames while the hero imagery is still
decoding.

### The CTA constant

```ts
// content/cta.ts
export const PRIMARY_CTA = {
  label: 'Enquire Now',
  href: '#enquire',
  external: false,
} as const;
// When the Parts-Mall store ships, this becomes:
// { label: 'Shop ZIC', href: 'https://store.parts-mall.co.za/zic', external: true }
```

Every button on the page consumes this. The ecommerce swap is a one-line change.

---

## 2. Page architecture

Thirteen sections. **Everything is centre-aligned.** One dominant idea per fold. Chambers
alternate light and dark so that darkness always earns its place.

> **Layout note.** An earlier draft used asymmetric, left-aligned composition. That was overruled:
> the page is now centre-aligned throughout, on a symmetrical axis. Depth and hierarchy come from
> **parallax plane separation and scale**, not from layout offset. This is a deliberate choice and
> the rest of the system is tuned around it: the Film Rail is the only off-axis element, headline
> measures are capped so centred type never becomes a wall, and the product renders carry the
> visual weight that asymmetry would otherwise have provided.

| # | Section | Chamber | Rail |
|---|---|---|---|
| 00 | Navigation | transparent → Engineering White | 2px |
| 01 | **Hero — one product, centred** | Engineering White | 2px |
| 02 | **The Splash** | Carbon | 6px |
| 03 | **The Five — range reveal** | Carbon | 8px |
| 04 | Proof manifest | Carbon | 2px |
| 04a | Why ZIC — 10 benefits, plain language | Engineering White | 2px |
| 05 | Ch.01 — What is happening inside? | Carbon | 8px |
| 06 | Ch.02 — Performance begins with the base | Engineering White | 6px |
| 07 | Ch.03 — Stable under change | Carbon | 3px → 7px |
| 08 | Ch.04 — Find your ZIC | Engineering White | 4px |
| 09 | Ch.05 — "Multi" does not mean any | Graphite | 4px |
| 10 | Ch.06 — Where to get it | PMA Navy | 4px |
| 11 | Enquire | Carbon | 4px |
| 12 | Footer | Graphite | — |

### The parallax system

Three planes. Every element belongs to exactly one. Each is translated by
`scrollY × (speed − 1)` from a **single rAF loop** writing `transform` strings; never per-element
scroll listeners, never `background-attachment: fixed`.

| Plane | Speed | Carries |
|---|---|---|
| **0** | `0.15×` | Ghost ZIC wordmark, background plates. Barely moves. |
| **1** | `0.60×` | Type blocks, splash plate. Lags the scroll. |
| **2** | `1.15×` | Product renders. Overtakes the scroll, so it reads as nearest. |

Because plane 2 exceeds `1.0×`, products drift *upward* relative to the page as you scroll. That
is what separates them from the type and makes a centred composition read as dimensional rather
than flat.

---

## 3. Section detail

### 00 — Navigation

Fixed, 72px, transparent over the hero, resolving to Engineering White with a 1px Hairline
bottom border after 80px of scroll (opacity + backdrop only, no height animation).

Left: **SK ZIC** wordmark, with `Dynamics in Flow` locked beneath it in Roboto Mono 10px,
tracking 0.18em, Steel Text. The slogan travels with the mark so it is never replaced.

Centre (≥1024px only): `Technology · Products · Availability` anchor links.

Right: `Enquire Now` primary button.

Below 1024px the anchors collapse into a sheet triggered by a 44×44 button. The Enquire button
stays visible at all widths.

---

### 01 — Hero: one product, centred

Engineering White. **Nothing is off-axis.** A single ZIC X7 5W-30 4 L sits dead centre with the
type stacked symmetrically around it.

```
                  SK ZIC  ·  DISTRIBUTED ACROSS SOUTHERN AFRICA
                          BY PARTS-MALL AFRICA

                            Performance
                          Starts Within.

        The world's number one Group III base oil, engineered into
                motor oil for South African conditions.

                            [ product ]

                  ZIC X7  ·  5W-30  ·  FULLY SYNTHETIC  ·  4 L

                 [ Enquire Now ]   [ Find your specification ]
```

**Plane assignment**

| Element | Plane | Speed | Notes |
|---|---|---|---|
| Ghost `ZIC` wordmark | 0 | `0.15×` | 520px Manrope ExtraBold at 5% opacity, centred behind the product |
| Eyebrow, H1, lead | 1 | `0.60×` | Lifts and fades as the product overtakes it |
| Product render | 2 | `1.15×` | Contact shadow travels with it |
| Nav, CTAs | fixed | `1.0×` | Never parallaxed; they are controls, not scenery |

H1 at `clamp(2.75rem, 7.2vw, 6.5rem)`, line height 0.92, tracking −0.035em, centred, two lines.
The lead is capped at 600px so centred body copy never becomes a wall.

---

### 02 — The Splash

Carbon Black. The transformation moment, and the reason the page earns a dark chamber here.

Stamp: `THE TRANSITION · SCROLL 0.00 → 1.00 · PINNED 180vh`

Statement, centred, Manrope ExtraBold 76px:
> **One engineering standard.**

Beneath: *The same base oil, the same additive discipline, the same laboratory. What changes is
the job it is asked to do.*

The crown splash plate sits on plane 1 behind the product, which stays on plane 2. The splash
scales `0.72 → 1.12` with opacity `0 → 1`, and a ghost copy trails 80ms behind at 40% opacity for
depth. The canister base sits inside the crown so the product reads as rising out of the oil.

The splash resolves downward into the Film Rail. That handoff is the whole reason the rail exists
as a device rather than a decoration.

---

### 03 — The Five: range reveal

Carbon Black. The payoff.

Stamp: `FIVE PRODUCTS · SEVEN PACK SIZES`

H2, centred, 88px: **The South African range.**
Sub: *The SK ZIC line-up Parts-Mall Africa imports today, matched to the specifications this
market runs.*

The four other products emerge from **behind the centre canister** and translate outward to their
positions on a shallow arc, 70ms stagger, outermost last. All five share a common baseline on a
1px ground rule.

| # | Product | Grade | Spec | Pack | Height |
|---|---|---|---|---|---|
| 01 | ZIC X5 | 10W-30 | API SN Plus | 1 L · 4 L | 196px |
| 02 | ZIC X7 Diesel | 5W-30 | ACEA A3/B4 | 6 L | 262px |
| 03 | **ZIC X7** | 5W-30 | API SP · ILSAC GF-6 | 1 L · 4 L | 292px |
| 04 | ZIC X3000 | 15W-40 | API CG-4 | 6 L | 258px |
| 05 | ZIC ATF MULTI | Multi-vehicle | Fully synthetic ATF | 1 L | 206px |

Sizes follow real relative pack scale, so the line-up reads as a family photo rather than a
scaled grid. The centre product is tallest, fully opaque and carries a red leader line; the other
four sit at 97% opacity with Deep Steel leader lines.

**Callouts.** A 1px leader drops from each product to a 5px anchor dot, then a centred block:
product name (Manrope SemiBold), grade (Roboto Mono, ZIC Red), specification (Roboto Mono, Metal
Grey), pack sizes (Roboto Mono, Steel Text). Leader lines reveal with
`clip-path: inset(0 0 100% 0)` → `inset(0)`; the callout block fades up 12px behind it.

Footnote, centred: *Start with the specification your vehicle manufacturer requires. Then match
the ZIC product.*

**Mobile.** Five across does not fit at 375px. The reveal becomes a 2-up grid (2 + 2 + 1) with
the callout beneath each cell, revealed on `whileInView` with the same 70ms stagger. No pin.

---

### 04 — Proof manifest

Carbon Black. Four centred cells separated by 1px verticals, echoing the cover manifest in the
existing Parts-Mall Africa brand manual so the two documents feel related.

Not a hero-metric block. No oversized numerals, no gradient accents.

```
[ BASE OIL ]              [ HERITAGE ]             [ NETWORK ]              [ ACCREDITATION ]
World's No.1 Group III    Korea's No.1 engine      40+ branches, 9          RMI Approved
base oil, at ~35% of      oil brand every year     provinces and 5          distribution through
global supply.            since its 1995 launch.   Southern African         Parts-Mall Africa.
                                                   countries.
```

Sources for every claim live in `RESEARCH.md §1.2` and `§2.2`.

---

### 05 — Chapter 01: What is happening inside?

Carbon Black. Full-bleed.

Stamp: `CH.01 / 06 ── LUBRICATION ── THE PROTECTION LAYER`

H2: **What is happening inside?**

Lead: *Every claim a motor oil makes comes down to one thing: whether a film of liquid can keep
two pieces of moving steel from touching. Everything else is a consequence of that.*

The generated oil-film macro runs full-bleed at 21:9, the glowing amber film sitting on the
horizontal centre line. The Film Rail swells to 8px here, aligning with the film in the
photograph. The rail and the image are the same idea at two scales.

**The three states**, as a horizontally scrubbed sequence driven by vertical scroll (a
`ScrollTrigger` pin of about 200vh). Each state cross-fades the film thickness in the image
and updates a mono readout:

| State | Readout | Copy |
|---|---|---|
| Fluid film | `FILM: FULL · CONTACT: NONE` | The surfaces are completely separated. Wear is close to zero. This is where an engine spends most of its life once warm. |
| Boundary | `FILM: MINIMAL · CONTACT: ASPERITY` | The film has thinned to almost nothing and the additive layer is the only thing left. This is cold start, and it is where most engine wear actually happens. |
| Extreme pressure | `FILM: LOAD-BEARING · CONTACT: CHEMICAL` | Under very high load the EP additives bond chemically to the metal and carry what the fluid alone cannot. |

Mobile: the three states become a swipeable set of three panels with the same readouts, no pin.

---

### 06 — Chapter 02: Performance begins with the base

Engineering White. Asymmetric two-column: text in 1–6, imagery in 8–12.

Stamp: `CH.02 / 06 ── YUBASE ── GROUP III BASE OIL`

H2: **Performance begins with the base.**

Body:
> A finished motor oil is base oil plus additives, and the base oil is most of it. Conventional
> Group I and Group II base oils still carry the sulphur, aromatics and wax left over from
> crude. Those are the parts that oxidise, thicken and turn into sludge.
>
> YUBASE is SK Enmove's Group III base oil, hydrocracked and hydroisomerised until those
> impurities are gone. What is left is a base oil with a naturally high viscosity index and
> strong resistance to oxidation, before a single additive is blended in.
>
> SK Enmove does not buy this base oil. It makes it, at roughly 35% of world supply, and sells
> it to other lubricant brands. When you buy ZIC you are buying the base oil at the source.

The amber-vortex macro fills the right column, full-bleed to the right edge of the viewport
(breaking the grid on purpose).

Proof strip beneath, mono:
```
YUBASE CAPACITY   ULSAN 48,600 b/d  ·  ILBOC CARTAGENA 19,300 b/d  ·  PATRASK DUMAI 12,500 b/d
```

Pull quote, Manrope Bold, ZIC Red rule above: **"Performance begins with the base."**

---

### 07 — Chapter 03: Stable under change

Carbon Black. **The centrepiece of the page**, and the section that makes it South African
rather than a translated global page.

Stamp: `CH.03 / 06 ── VHVI TECHNOLOGY ── VISCOSITY INDEX`

H2: **Stable under change.**

Lead: *A South African engine can see minus three degrees on a Highveld winter morning and a
hundred and five degree sump on the N3 to Durban in the same week. Viscosity index is the
measure of how little the oil cares.*

**The temperature scrubber.** A scroll-driven instrument, pinned for about 220vh.

- A horizontal axis runs from `−3 °C` to `+105 °C`, labelled in Roboto Mono tabular figures.
- Two curves draw as you scroll: a **ZIC VHVI** curve in ZIC Red that stays close to flat, and
  a **conventional base oil** curve in Metal Grey that climbs steeply at the cold end and falls
  away at the hot end.
- A vertical readout head tracks the scroll position and reports the current temperature, the
  scenario, and what is happening to the oil.
- The generated Highveld-dawn photograph sits behind at low opacity at the cold end, cross-fading
  out as the scrubber moves toward the hot end.
- The Film Rail thins to 2px at the cold extreme (boundary lubrication) and swells to 7px at the
  warm middle. The rail is telling the same story as the chart.

Scenario stops:

| Temp | Scenario | Readout |
|---|---|---|
| −3 °C | Highveld winter, 05:40, first turn of the key | `COLD START · BOUNDARY LUBRICATION · OIL MUST REACH THE TOP END FAST` |
| 22 °C | Johannesburg stop-start, mid-morning | `HEAT CYCLING · NEVER REACHES STEADY STATE` |
| 90 °C | N3 to Durban, loaded, cruising | `STEADY STATE · FLUID FILM` |
| 105 °C | Van Reenen's Pass, sustained climb | `PEAK LOAD · FILM STRENGTH UNDER STRESS` |

Closing line: *A high viscosity index does not make the oil thicker or thinner. It makes it
change less. That is the whole argument.*

Mobile: the scrubber becomes a horizontal swipe carousel of the four scenario stops with the
curve rendered statically behind. Reduced motion: static chart, keyboard-operable range input
that moves the readout head.

---

### 08 — Chapter 04: Find your ZIC

Engineering White. The section the fleet manager scrolled here for.

Stamp: `CH.04 / 06 ── PRODUCT RANGE ── SPECIFICATION FIRST`

H2: **Find your ZIC.**

**The rule, stated plainly in a bordered notice before the table:**
> Start with the specification your vehicle manufacturer requires. Then match the ZIC product.
> Never the other way round. Never by vehicle age, driving style, or what is on special.

Filter chips (single-select, mono labels, ZIC Red active state, 44px touch targets):
`Petrol` · `Diesel` · `Transmission`

Three chips, because the confirmed SA range has three families. Do not ship chips for categories
Parts-Mall does not stock.

Sub-line beneath the H2: *Five products. Seven pack sizes. Everything Parts-Mall Africa actually
holds, and nothing it does not.*

**The specification table.** Desktop: a real table, sticky header, 1px Hairline rules, zebra
`--fluid-grey` at 40%. Columns:

| Product | Grades | Specification | Who it's for |
|---|---|---|---|

Product in Manrope SemiBold. Grades and Specification in Roboto Mono tabular. "Who it's for" in
Inter, the plain-language line from `RESEARCH.md §4`.

Each row expands (transition `grid-template-rows`, 240ms) to reveal:
- Full OEM approval list, each entry carrying its **claim chip**: `APPROVED BY` in ZIC Red,
  `MEETS OR EXCEEDS` in Steel Text. The chips make the BRAND-DNA claim taxonomy visible.
- Pack sizes, once confirmed by Parts-Mall.
- `Enquire about this product` link that pre-fills the enquiry form's interest field.

Below 768px: stacked disclosure cards, one per product, with the same content. Never a
horizontally scrolling table.

Content source: `content/products.ts`, transcribed from `RESEARCH.md §4`. Availability flags
(`confirmed` / `likely` / `range`) drive whether a product renders at all, so Parts-Mall can
switch products on and off in one file.

**The warning, rendered as a full-width bordered notice below the table:**
> ZIC X7 Diesel is formulated for diesel engines without DPF, CPF or SCR. ZIC X3000 is API CG-4,
> an older diesel category. Neither is a Low SAPS oil, so neither belongs in a modern
> particulate-filter diesel unless the manufacturer specification explicitly permits it.

There is currently **no ZIC product in the South African range for a particulate-filter diesel.**
The page must not imply otherwise, and must not name X7 LS or X9 LS as the answer, because
Parts-Mall does not stock them. If a visitor needs Low SAPS, the honest outcome is an enquiry.

---

### 09 — Chapter 05: "Multi" does not mean any

Graphite.

> **Revised.** This chapter originally argued the Hyundai/Kia SP-III / SP-IV differentiator. That
> was built on the global ZIC range. South Africa stocks **ZIC ATF MULTI only**, so that argument
> would have been selling a product Parts-Mall cannot supply. The honest version is stronger
> anyway: a brand that puts a warning label on its own multi-vehicle fluid is a brand you can
> believe about everything else.

Stamp: `CH.05 / 06 ── TRANSMISSION ── ZIC ATF MULTI`

H2: **"Multi" does not mean any.**

Body:
> ZIC ATF MULTI is a fully synthetic multi-vehicle automatic transmission fluid. It covers a lot
> of gearboxes, and that is exactly why it needs a warning label rather than a bigger claim.
>
> Before you fill, check the ATF specification the transmission actually requires. A fluid that
> suits most transmissions is not a fluid that suits yours until you have read the plate. Put the
> wrong fluid in an automatic and you will be quoting the customer for a gearbox, not an oil
> change.

Left column carries the argument and a six-item benefit list in two columns. Right column is a
bordered product panel: the real ATF MULTI 1 L render, the descriptor in Roboto Mono, pack size,
a `BEFORE YOU FILL` notice in ZIC Red, and a secondary `Enquire about this fluid →` button.

No gear-oil line. Parts-Mall does not stock G-FF, G-5, G-EP or Royal Grease in South Africa.

---

### 10 — Chapter 06: Where to get it

Opens Engineering White, resolves into PMA Navy. **This is where Parts-Mall Africa steps
forward in its own identity**, exactly as far as BRAND-DNA permits and no further.

Stamp: `CH.06 / 06 ── DISTRIBUTION ── PARTS-MALL AFRICA`

H2: **Forty branches. Nine provinces. Five countries.**

Body:
> SK ZIC reaches Southern Africa through Parts-Mall Africa, an RMI Approved importer and
> distributor carrying over 17,000 product lines for Korean and Japanese vehicles. The oil is
> engineered in Korea. The stock is on a shelf near you.

The trade-counter photograph runs full-bleed behind the upper half at 30% opacity over navy.

**Branch distribution table**, mirroring the module already used on the Parts-Mall Africa
homepage so the two pages feel like one company:

| Region | Branches |
|---|---|
| Gauteng | 16 |
| Limpopo | 6 |
| Cape Region | 3 |
| Free State | 3 |
| KwaZulu-Natal | 3 |
| Mpumalanga | 4 |
| North West | 4 |
| Elsewhere in Africa | 5 |

Footnote, mono: `Eswatini · Botswana · Mozambique · Namibia · Zimbabwe`

CTA row: `Find your nearest branch →` (out to parts-mall.co.za) and `Enquire Now` (primary).

RMI Approved mark placed here, at real size, not shrunk into a trust-badge row.

---

### 11 — Enquire

Carbon Black. A single red flow line descends from the Film Rail and resolves into the submit
button, closing the visual argument that started with the splash.

H2: **Tell us what you run.**

Lead: *Workshop, fleet, dealership or driveway. Tell us the vehicle or the specification and we
will point you at the right ZIC product and the nearest branch that has it.*

Fields, all with visible labels (never placeholder-only):

| Field | Type | Notes |
|---|---|---|
| Name | text | required |
| Business or workshop | text | optional |
| Phone | tel | required, `inputmode="tel"` |
| Email | email | required, `inputmode="email"` |
| Province | select | 9 provinces + Botswana / Eswatini / Mozambique / Namibia / Zimbabwe |
| I'm asking about | select | Passenger petrol · Diesel bakkie & SUV · European & DPF · Fleet & commercial · Drivetrain fluids · Reseller / territory |
| Vehicle or specification | text | optional, helper text: *e.g. "2019 Hyundai Creta 1.6" or "ACEA C3"* |
| Message | textarea | optional |

Validation on blur, not on keystroke. Errors render below the field with `role="alert"`. On
submit failure, focus moves to the first invalid field. Success replaces the form with a
confirmation that repeats what was sent and gives the branch-finder link.

Button label and destination come from `PRIMARY_CTA`.

---

### 12 — Footer

Graphite. Three columns plus a legal band.

- **Column 1** — SK ZIC wordmark, `Dynamics in Flow`, one line on SK Enmove.
- **Column 2** — Resources: `Download TDS`, `Download MSDS`, `Find a branch`, `Become an agent`.
- **Column 3** — Parts-Mall Africa lockup in navy, address, phone, email, social.

Legal band, Roboto Mono 11px, Steel Text:
> Product specifications and OEM approvals are product-specific and are stated as published by
> SK Enmove. "Approved by" indicates formal OEM certification; "meets or exceeds" is a
> manufacturer declaration. Always follow the specification and service interval in your
> vehicle's owner's manual. SK ZIC is a registered trademark of SK Enmove Co., Ltd.,
> distributed in Southern Africa by Parts-Mall Africa.

---

## 4. Motion inventory

| Trigger | What moves | Tech | Duration / range |
|---|---|---|---|
| Page load | Nav fade, hero stagger | Framer Motion | 260ms, 50ms stagger |
| Scroll, global | **Parallax planes 0 / 1 / 2** | Single rAF loop writing `transform` | continuous |
| Scroll 0.00–0.30 | Hero drift, canvas cross-fade to Carbon | GSAP pin + scrub 0.6 | scroll-linked |
| Scroll 0.30–0.58 | Splash scale and opacity, ghost trail | GSAP scrub | scroll-linked |
| Scroll 0.58–1.00 | Four products translate out, leader lines draw, callouts fade up | GSAP scrub + 70ms stagger | scroll-linked |
| Scroll, all | Film Rail thickness and fill | GSAP `clip-path` + `scaleX` | scroll-linked |
| Ch.01 pin | Lubrication state cross-fade | GSAP scrub | 200vh |
| Ch.03 pin | Temperature scrubber, curve draw | GSAP `stroke-dashoffset` | 220vh |
| Section enter | Headline and body reveal | Framer `whileInView`, `once: true`, `margin: "-100px"` | 260ms |
| Table row | Disclosure expand | Framer, `grid-template-rows` | 240ms |
| Button press | `scale(0.97)` | CSS | 140ms |
| Filter chip | Active state colour | CSS | 180ms |

**Parallax implementation.** One `requestAnimationFrame` loop reads `lenis.scroll` once per frame
and writes `transform: translate3d(0, Npx, 0)` to each registered plane. Never a scroll listener
per element, never `background-attachment: fixed`, never `top`/`margin`. Planes are registered by
a `data-plane="0|1|2"` attribute so the whole system is one hook.

**`prefers-reduced-motion: reduce`** — all planes collapse to speed `1.0` (parallax off), the hero
un-pins, the splash renders as a still at 35% opacity, and the five products render already
revealed with their callouts static. Opacity and colour transitions are kept; all translate and
scale motion is removed.

Everything above respects `prefers-reduced-motion`. Nothing above animates a layout property.

---

## 5. Responsive behaviour

| Breakpoint | Margin | Grid | Notable changes |
|---|---|---|---|
| 375 | 20px | 4 col | Rail becomes a 3px top bar. Hero pin 200vh. **The Five becomes a 2-up grid (2+2+1), no pin.** Parallax speeds soften to 0.4 / 0.8 / 1.08 so short viewports do not overshoot. Table becomes disclosure cards. Scrubber becomes a swipe carousel. |
| 768 | 40px | 8 col | Hero pin 280vh. The Five renders as a single row of five. Table renders as a table. |
| 1024 | 80px | 12 col | Nav anchors appear. Rail moves to the left edge with chapter ticks. |
| 1440 | 80px, max 1440 content | 12 col | Full hero pin 360vh. Chapter imagery bleeds to the viewport edge. |

Centre alignment holds at every breakpoint. Nothing reflows to a left-aligned column on mobile.

Verify at 375 portrait and landscape, with reduced motion on, and with text scaled to 200%.

---

## 6. Performance budget

- LCP element is the hero centre canister. Preload it; it must not wait on the splash plates.
- Splash and ribbon plates load after the hero has painted.
- CLS under 0.1: every image ships with `width`/`height`; the pinned sections reserve their
  height before GSAP initialises.
- Fonts: `font-display: swap`, preload Manrope ExtraBold and Inter Regular only.
- Main-thread budget: 16ms per frame during the hero scrub. Test on a mid-range Android, which
  is what the primary user is actually holding.
- Total JS under 180kB gzipped. GSAP core plus ScrollTrigger only; no GSAP plugins that require
  a licence.

---

## 7. Accessibility

- Contrast: body ≥ 4.5:1 in both chambers. Dark-chamber secondary text uses `--metal-grey`, not
  `--steel-text`.
- Every interactive element has a visible focus ring, 2px ZIC Red with a 2px offset.
- The Film Rail is `aria-hidden`; chapter navigation is served by real anchor links.
- The temperature scrubber has an accessible fallback: a labelled range input that moves the
  readout head, operable by keyboard.
- The specification table is a real `<table>` with `<th scope>`; disclosure rows use
  `aria-expanded` and `aria-controls`.
- Every image has alt text written in the brand voice, not a filename.
- All motion respects `prefers-reduced-motion: reduce`.

---

## 8. Build order

1. Tokens, fonts, `PRIMARY_CTA`, content modules from `RESEARCH.md`
2. Static page: all ten sections, correct type and layout, no motion
3. Accessibility and responsive pass on the static page
4. Film Rail
5. Hero sequence
6. Chapter 01 and 03 scrubbers
7. Component motion, disclosure rows, filters
8. Enquiry form and server action
9. Performance pass, reduced-motion pass, real-device test
10. Swap placeholder canister for real SK ZIC product photography

Steps 1 through 3 produce a complete, shippable page on their own. Motion is added to a page
that already works, never depended on to make it work.

---

## 9. Open items requiring Parts-Mall input

Resolved since the first draft: the confirmed SA assortment and pack sizes are now fixed by
`ZIC_South_Africa_Product_Master.md` v1.0, and real official SK ZIC product photography is in
place for four of the five products.

Outstanding:

1. **ZIC X3000 6 L pack shot.** ❗ Blocking. No official render of the 6 L exists on any SK ZIC
   channel; only 20 L and 1 L. The comp currently has no X3000 image. Do not ship a 20 L drum
   against a 6 L SKU.
2. **ZIC X5 10W-30 at higher resolution.** The only official render is 380 px. It holds at the
   1 L's small display size but will not survive a larger crop. Do not upscale it with a model:
   an attempt reconstructed the label as `SK ɘrmonƨ` / `SUNTHE3C` / `ZJC`.
3. **ZIC X3000 API category.** ❗ The Parts-Mall master says **API CG-4**; SK ZIC's global
   catalogue and the pack artwork say **API CF-4**. The comp shows CG-4. Confirm against the TDS
   for the pack landing in SA.
4. **ZIC X7 pack run.** The 4 L artwork prints API SN PLUS / ILSAC GF-5; the published spec is
   API SP / ILSAC GF-6. Copy follows the spec. Confirm which run is arriving.
5. **ZIC ATF MULTI label variant.** The available render carries Korean domestic label artwork.
   Confirm the SA-market label.
6. **TDS and MSDS PDFs** for the download links.
7. **Enquiry routing** — destination inbox, and whether a CRM webhook is wanted.
8. **The Brand Power Index count.** Published figures range from 23 to 25 consecutive years.
   Confirm before printing a number, or keep the conservative wording.
9. **Low SAPS gap.** There is no ZIC product in the SA range for a particulate-filter diesel.
   Confirm whether X7 LS or X9 LS is coming, or whether that enquiry gets routed to a person.
