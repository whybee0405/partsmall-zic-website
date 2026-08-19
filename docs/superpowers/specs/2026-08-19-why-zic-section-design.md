# Why ZIC section — design

## Context

Comparing the current site against SK ZIC's official "Why ZIC? — 10 Benefits" page
(`skzic.com/eng/ibuilder.do?menu_idx=150`) surfaced a real content gap: the ten benefits already
exist in `BRAND-DNA.md` §9, transcribed with the correct copy guardrails, but were never turned
into an actual section on the page.

The current section order (`app/page.tsx`) is Hero → Splash → The Five → Proof → Inside → Yubase
→ Vhvi → Products → Transmission → Distribution → Enquire. After the Proof manifest establishes
authority, the page goes straight into three chapters of mechanism-level engineering (lubrication
states, YUBASE base-oil chemistry, a pinned viscosity-index temperature scrubber) with no
plain-language "what this means for you" layer first. That translation layer is exactly what the
official 10 Benefits page provides, and it is what this design adds.

## Goals

- Give the page a benefit-first bridge between the authority claims (Proof) and the mechanism
  deep-dive (Inside/Yubase/Vhvi), so a visitor gets "why this matters to you" before "how it
  works."
- Reuse the official ZIC 10 Benefits content (`BRAND-DNA.md` §9) rewritten in plain,
  non-technical language, respecting the guardrails already noted there: never override OEM
  service intervals, no absolute lifespan guarantees, no unsupported fuel-economy or horsepower
  figures, no product-specific approval claims transferred to the whole range.
- Add light South African localisation (cold-start, heat/load, stop-start driving) on a few of
  the ten items, consistent with how the rest of the page localises context without changing
  the ZIC identity (`BRAND-DNA.md` §2, "Localise Context, Not Identity").
- Ship using existing conventions and components only — no new design system, no new asset
  generation (icons), no new motion primitive.

## Non-goals

- Not a chapter in the numbered Ch.01–06 technical sequence. It does not get a Film Rail tick,
  a `Stamp` component, or a nav link, matching how the existing Proof manifest is also
  unnumbered.
- Not replacing or shortening Inside/Yubase/Vhvi. Per `BRAND-DNA.md` rule 4 ("Technology
  Creates Authority"), the technical depth is a differentiator and stays as-is — this section
  is additive, a sequencing fix, not a rewrite of the technical chapters.
- No custom icons per benefit. Considered and rejected in favor of a numbered-grid style
  (matching Proof's manifest aesthetic) to avoid a ten-icon asset-generation dependency.
- No product-specific certification claims. Benefit 08 ("Certified by Global Automakers") stays
  a brand-level fact, not a claim that a specific SA-stocked ZIC product carries a specific OEM
  approval — that would violate the "Product Claims Are Product-Specific" rule.

## Placement & structure

New section `why-zic`, inserted between `Proof` and `Inside` in `app/page.tsx`.

In `content/sections.ts`, `SECTIONS` gets one new entry inserted between `proof` and `inside`:

```ts
{ id: 'why-zic', label: 'Why ZIC', film: 2, dark: false },
```

No `tick` field — same treatment as `proof`, so the Film Rail and the existing chapter stamps
(`Ch.01/06` … `Ch.06/06`) in Inside/Yubase/Vhvi/Products/Transmission/Distribution are untouched.
`dark: false` makes this an Engineering White chamber, breaking up the Proof→Inside dark run
(Carbon → Carbon today) back into an alternating light/dark rhythm: White → Dark (Proof) →
**White (Why ZIC)** → Dark (Inside) → White (Yubase) → Dark (Vhvi) → ...

Not added to `NAV_LINKS` — Proof isn't either, and this section is a bridge, not a primary
destination someone would jump to directly.

## Content model

New file `content/why-zic.ts`:

```ts
export interface WhyZicCell {
  id: string;
  title: string;
  body: string;
}

export const WHY_ZIC: WhyZicCell[] = [
  { id: '01', title: 'Elevated Engine Protection', body: 'High viscosity index keeps the protective film doing its job under heat and load, not just when the engine is idling in the driveway.' },
  { id: '02', title: 'Outstanding Cleanliness', body: 'A precisely balanced additive package keeps sludge and deposits from building up as the kilometres add up.' },
  { id: '03', title: 'Extended Replacement Interval', body: 'Oil that holds its performance for longer gets more distance out of each service, within whatever interval your manufacturer sets.' },
  { id: '04', title: 'Improved Fuel Efficiency', body: 'Lower viscosity means less drag on moving parts, so the engine works a little less to do the same job.' },
  { id: '05', title: 'Enhanced Durability', body: "On the N3 in summer or grinding up a mountain pass, a strong oil film at high temperature means less metal-on-metal wear over the engine's life." },
  { id: '06', title: 'Excellent Low-Temperature Performance', body: 'On a frosty Highveld morning, ZIC keeps flowing so oil reaches the top end fast instead of leaving the engine running dry in those first seconds.' },
  { id: '07', title: 'Extended Engine Lifespan', body: "Consistent protection and cleanliness help the engine keep running the way it did when it left the factory floor, for longer." },
  { id: '08', title: 'Certified by Global Automakers', body: 'The same formulations ZIC sells to workshops are supplied as factory-fill oil to major automakers worldwide.' },
  { id: '09', title: 'Improved Engine Function', body: 'Through stop-start Joburg traffic or a loaded highway run, the engine keeps delivering the output it was built for.' },
  { id: '10', title: 'Reduced Oil Consumption', body: 'A stable oil film at high temperature means less oil burns off, so the level on the dipstick holds steadier between checks.' },
];
```

Source: `BRAND-DNA.md` §9 (official 10 Benefits, already transcribed with guardrail notes), plus
the SA localisation lens in `docs/RESEARCH.md` §3 for items 05, 06, and 09.

## Component

New file `components/sections/WhyZic.tsx`, following the existing `Proof.tsx` pattern (plain
manifest, no `Stamp`, no icons — the claims/benefits carry themselves):

- Section wrapper: `id="why-zic"`, background `var(--color-eng-white)`, no `chamber-dark` class
  (matches `Yubase.tsx`'s light-chamber pattern — background set inline, no special class needed
  for light chambers).
- Eyebrow: `<p className="t-label">` reading `[ WHY ZIC ]`, colour `var(--color-zic-red)`.
- H2: `<h2 className="t-display t-h2">` reading "Ten reasons, before the engineering."
- Lead: `<p className="t-lead">`, capped at `var(--measure-body)`, reading "The chapters ahead
  explain how ZIC works. This is what it means for the vehicle in front of you."
- Grid: `<ul>` of 10 `<li>` cells, `grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5`, so mobile
  renders 5 rows of 2 and desktop renders 2 rows of 5. Each cell:
  - A `Rule` component (top hairline) instead of Proof's `borderLeft` chain — a 5-column,
    2-row grid can't cleanly chain left-borders the way Proof's single-row 4-column grid does.
  - `id` (e.g. `01`) in `t-mono`, `var(--color-zic-red)`.
  - `title` in Manrope SemiBold, `var(--color-carbon)`.
  - `body` in Inter, `var(--color-deep-steel)`, one line of description.

Imports `WHY_ZIC` from `content/why-zic.ts` and the existing `Rule` component from
`components/ui.tsx`. No new shared UI component needed.

## Motion

None. `framer-motion` is named in `LANDING-PAGE-SPEC.md`'s stack table but is not actually an
installed dependency (checked `package.json`) and is not used anywhere in `components/sections/`
today. The codebase's real conventions are: GSAP `ScrollTrigger` count-ups for sections with
numeric data worth animating (`Yubase.tsx`, `Distribution.tsx`), and plain static rendering for
sections without it. `Proof.tsx` — the closest structural analog to Why ZIC, a plain manifest
grid with no numeric data — has no `useEffect`, no GSAP import, and no scroll-triggered reveal
at all. Why ZIC follows that same precedent exactly: no motion, no new dependency, no
`lib/scroll` import. This also keeps it a plain server component (no `'use client'` directive
needed), unlike Yubase/Distribution/Inside/Vhvi/OpeningSequence, which all require it for GSAP.

## Responsive behaviour

| Breakpoint | Grid |
|---|---|
| `< lg` | `grid-cols-2` — 5 rows of 2 |
| `≥ lg` | `grid-cols-5` — 2 rows of 5 |

Matches the responsive vocabulary already used in `Proof.tsx` (`grid-cols-1 sm:grid-cols-2
lg:grid-cols-4`) and `Yubase.tsx` (`grid-cols-1 sm:grid-cols-3`).

## Accessibility

- Plain semantic `<ul>`/`<li>` markup — this is real content, not decoration, so no
  `aria-hidden`.
- Contrast: title/body colours checked against Engineering White must clear 4.5:1, per the
  existing accessibility rule applied to every other light chamber on the page.
- No new interactive elements, so no new focus-management or keyboard-navigation surface.
- No motion to gate: the section renders fully in place on load, so
  `prefers-reduced-motion` has nothing to affect here (see Motion section above).

## Testing

Manual verification (no automated visual test coverage on this page today):

- Confirm the section renders between Proof and Inside at 375px, 768px, 1024px, 1440px, matching
  the grid breakpoints above.
- Confirm the Film Rail does not gain a tick or renumber any existing chapter stamp.
- Confirm chamber alternation reads correctly scrolling from Proof (dark) through Why ZIC
  (light) into Inside (dark).
- Confirm contrast of title/body text against Engineering White.
- Confirm the section reads correctly with text scaled to 200%.
