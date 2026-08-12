# DESIGN.md — SK ZIC South Africa landing page

Derived from `BRAND-DNA.md`. Where this document and BRAND-DNA disagree, BRAND-DNA wins.

## Aesthetic lane

**Named reference:** a laminated OEM service specification card that lives on a workshop wall,
crossed with a flow-meter readout. Measured, instrumented, legible in daylight, with the
technical data set as the hero rather than hidden in fine print.

**Explicitly not:** editorial-magazine (no display serif, no drop caps, no broadsheet columns),
not liquid-glass or glassmorphic, not motorsport, not SaaS-template.

**The competitor test.** A rival would describe theirs as "a premium dark landing page with a
floating oil bottle and a red gradient". This is a daylight-white technical document that goes
dark only when we go inside the engine, and whose progress indicator is a cross-section of the
oil film itself.

## Signature device — The Film Rail

The page's scroll progress indicator, navigation and brand device in one object. It is
BRAND-DNA's "Protection Layer" made structural.

A fixed element on the left edge (desktop) or top edge (mobile) built from three bands:

```
──────────────  Metal Grey #A9ADB2   1px   upper bearing surface
▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ZIC Red   #E31E24   2–8px  the oil film
──────────────  Metal Grey #A9ADB2   1px   lower journal surface
```

The red band's **thickness is driven by scroll position and by chapter meaning**:

| Chapter | Film state | Rail thickness |
|---|---|---|
| Hero, proof bar | at rest | 2px |
| Ch.01 Inside | fluid-film | 8px |
| Ch.02 YUBASE | fluid-film | 6px |
| Ch.03 VHVI cold end | boundary | 2px, hairlines nearly touching |
| Ch.03 VHVI hot end | fluid-film | 7px |
| Ch.04 Find Your ZIC onward | steady | 4px |

Implemented with `clip-path: inset()` and `transform: scaleX()` on GPU-composited layers.
Never with width or height animation.

Chapter ticks sit on the rail as 1px Hairline marks with Roboto Mono numerals. Clicking a tick
scrolls to that chapter. On mobile the rail collapses to a 3px top bar with the same colour
logic and no ticks.

## Chapter stamp

Replaces the banned "tiny uppercase label above every heading" pattern with a real technical
document header, used exactly once per chapter:

```
CH.03 / 07 ── VHVI TECHNOLOGY ── VISCOSITY INDEX
```

Roboto Mono SemiBold, 13px, tracking 0.12em, Steel Text on light / Metal Grey on dark, with a
1px Hairline rule running from the stamp to the right margin. The chapter number is the point:
it is a document, and the reader can see where they are.

## Colour

Tokens from BRAND-DNA §3, expressed as OKLCH with hex fallbacks. No pure `#000` or `#fff` for
surfaces; every neutral is tinted a fraction toward the ZIC red hue.

| Token | Hex | Role |
|---|---|---|
| `--zic-red` | `#E31E24` | Flow paths, CTAs, active states, proof marks, the Film Rail |
| `--zic-red-deep` | `#B8181D` | Pressed states |
| `--carbon` | `#090B0E` | Dark chamber backgrounds |
| `--graphite` | `#181C21` | Product modules, secondary dark panels |
| `--deep-steel` | `#2A3037` | Structured technical surfaces |
| `--oil-gold` | `#C89608` | Technology highlight, the oil itself in imagery |
| `--eng-white` | `#F7F7F5` | Default light canvas |
| `--pure-white` | `#FFFFFF` | Product cards, table cells |
| `--fluid-grey` | `#E8E9E7` | Data surfaces, technical diagrams |
| `--metal-grey` | `#A9ADB2` | Mechanical accents, rail hairlines |
| `--steel-text` | `#626C76` | Metadata, secondary text |
| `--hairline` | `#D6D9DB` | Dividers, scales, grid rules |
| `--pma-navy` | `#122A57` | **Parts-Mall Africa distribution chapter only** |

**Strategy: Committed, alternating.** Not a single drench. The page alternates light chambers
and carbon chambers so the dark sections mean something (BRAND-DNA rule 7: *darkness must
reveal something*). Distribution: ~45% Engineering White, ~35% Carbon/Graphite, ~15% ZIC Red,
~5% metallic neutrals.

**Red discipline.** Flow paths, CTAs, active states, motion indicators, proof points. Never a
large background fill, never a gradient wash, never flame. If red is covering more than about
15% of a viewport, it is wrong.

**Contrast floors.** Body ≥ 4.5:1 in both chambers. `--steel-text` on `--eng-white` passes;
`--steel-text` on `--carbon` does **not**, so dark-chamber secondary text uses `--metal-grey`.

## Typography

| Role | Family | Usage |
|---|---|---|
| Display | **Manrope** ExtraBold / Bold | Heroes, chapter headlines |
| Body / UI | **Inter** Regular / Medium / SemiBold | Paragraphs, labels, product explanations |
| Technical | **Roboto Mono** Medium / SemiBold | SAE grades, API/ACEA, OEM approvals, chapter stamps, all numerals in data |

Mandated by BRAND-DNA §4. Identity preservation beats greenfield font selection.

### Scale

Fluid `clamp()`, ratio ≥ 1.25 between steps.

| Step | Size | Line height | Tracking |
|---|---|---|---|
| Display XL (hero) | `clamp(2.75rem, 7vw, 6.5rem)` | 0.94 | −0.03em |
| H2 chapter | `clamp(2rem, 4.5vw, 3.75rem)` | 0.98 | −0.02em |
| H3 | `clamp(1.375rem, 2vw, 1.75rem)` | 1.15 | −0.01em |
| Lead | `1.125rem` | 1.65 | 0 |
| Body | `1rem` | 1.6 | 0 |
| Mono label | `0.8125rem` | 1.3 | 0.12em, uppercase |
| Mono data | `0.9375rem` | 1.4 | 0.02em, `font-variant-numeric: tabular-nums` |

Body measure capped at **68ch**. On dark chambers add `0.05` to line height, per BRAND-DNA's
light-on-dark rule.

Uppercase is reserved for mono labels and chapter stamps. Never for body copy.

## Layout

- 12-column grid. Margins **80 / 40 / 20** px at desktop / tablet / mobile. Gutter 32–48px.
- Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 104 · 128`.
- Radii: buttons 4px, cards 8px, large containers 12px max. No pill shapes, no exaggerated SaaS
  rounding.
- **Centred by default.** Every section composes on the vertical centre axis: stamp, headline,
  lead, then content. Headline measure capped at 1280px, body measure at 820px, so centred type
  never becomes a wall.
- **Depth comes from parallax, not offset.** Three planes at `0.15× / 0.60× / 1.15×` scroll speed.
  Because the product plane exceeds `1.0×`, renders drift upward relative to the page and read as
  nearest. This is what stops a centred layout reading flat.
- **The Film Rail is the only deliberately off-axis element.** It anchors the left edge so the
  symmetry has something to measure against.
- Tabular data is the one exception: the specification table in Ch.04 keeps left-aligned columns,
  because centred table columns are unreadable.
- Breakpoints: `375 / 768 / 1024 / 1440`.
- `min-height: 100dvh`, never `100vh`.

## Components

**Buttons.** 4px radius, 48px min height, 44×44 min touch target.
Primary: ZIC Red fill, Pure White label. Pressed: `--zic-red-deep` + `scale(0.97)`.
Secondary: 1px Deep Steel border, transparent fill.
Every button carries `transition: transform 140ms var(--ease-out), background-color 140ms ease`.

**Specification table.** The core component of Chapter 04. A real table on desktop with a
sticky header; expanding disclosure rows revealing approvals and pack sizes. Collapses to
stacked disclosure cards below 768px, never a horizontally scrolling table. Product names in
Manrope, grades and specs in Roboto Mono tabular, plain-language line in Inter.

**Claim chip.** Small mono tag distinguishing the BRAND-DNA claim verbs. `APPROVED BY` gets
ZIC Red text on a Fluid Grey ground; `MEETS OR EXCEEDS` gets Steel Text on Fluid Grey. The
visual difference is the point.

**No identical card grids. No nested cards. No icon-above-heading squares.**

## Motion

Tokens:

```css
--ease-out:    cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
```

Never `ease-in`. Never `transition: all`. Only `transform`, `opacity`, `clip-path`, `filter`.

| Element | Duration |
|---|---|
| Button press | 140ms |
| Spec label / tooltip | 180ms |
| Disclosure row expand | 240ms (transition `grid-template-rows`, not `height`) |
| Section entrance | 260ms, stagger 50ms |
| Hero and scrub sequences | scroll-linked, no fixed duration |

Entrances start at `opacity: 0; transform: translateY(12px) scale(0.96)`. **Never `scale(0)`.**
Exits run at roughly 65% of enter duration.

Hover effects gated behind `@media (hover: hover) and (pointer: fine)`.

**`prefers-reduced-motion: reduce`** — the hero renders as a static three-bottle composition
with the specification labels already resolved; the temperature scrubber becomes a static chart
with a keyboard-operable slider; all translate and scale motion is removed; opacity and colour
transitions are kept because they aid comprehension.

## Imagery

Real photography and real macro imagery only. **No SVG or CSS pseudo-3D bottles, no illustrated
engine cutaways, no generated diagrams.**

| Asset | Purpose | Status |
|---|---|---|
| Oil crown splash, isolated on black | Hero convergence burst | Generated ✓ |
| Oil ribbon in flight | Flow transition between chapters | Generated ✓ |
| Oil film between two steel surfaces | Ch.01 hero, the Protection Layer | Generated ✓ |
| Amber oil vortex on carbon | Ch.02 YUBASE | Generated ✓ |
| Highveld dawn, frost, bakkie idling | Ch.03 cold-start argument | Generated ✓ |
| Parts trade counter interior | Ch.06 distribution | Generated ✓ |
| Blank 6 L canister, studio white | **Placeholder only** | Generated ✓ |
| **Real SK ZIC product photography** | Hero, Ch.04 | **Required from Parts-Mall** |

The blank canister is deliberately unbranded so it cannot be mistaken for real SK ZIC
packaging. It holds the composition until Parts-Mall supplies actual product shots. Do not
generate imitation ZIC labels.

Delivery: AVIF with WebP fallback, explicit `width`/`height`, hero preloaded, everything below
the fold `loading="lazy"`.

## Bans

Inherited and specific.

- Gradient text, `background-clip: text`
- Glassmorphism as decoration
- Coloured side-stripe borders
- The hero-metric template (big number, small label, gradient accent)
- Identical card grids
- Emoji as icons
- Em dashes in copy
- Racing aggression, flame effects, chequered flags, carbon-fibre texture
- Red as a large decorative background fill
- Transferring one product's approvals onto another
