# SK ZIC South Africa — Landing Page

A scroll-driven, parallax landing page for **SK ZIC** motor oils and fluids in South Africa and
Southern Africa, published by **Parts-Mall Africa**, the authorised importer and distributor.

One page. No CMS. The CTA is `Enquire Now` until the Parts-Mall store ships, then it becomes
`Shop ZIC` via a single constant.

This is the first of a series. Parts-Mall Africa gets one of these per house brand (PMC,
Wingster, Essence), so the system built here has to survive being re-skinned.

---

## The scroll narrative

Everything is centre-aligned. Depth comes from parallax plane separation, not layout offset.

```
        ONE                    →        SPLASH           →         FIVE
  a single ZIC X7                  oil crown erupts          the SA range fans out
  centred, three                   around the canister       with leader lines and
  parallax planes                  on carbon black           spec callouts
```

Then six chapters: what is happening inside · YUBASE · VHVI and South African temperature ·
find your ZIC · "Multi" does not mean any · where to get it. Then the enquiry.

### Parallax planes

| Plane | Speed | Carries |
|---|---|---|
| `0` | `0.15×` | Ghost ZIC wordmark, background plates |
| `1` | `0.60×` | Type blocks, splash plate |
| `2` | `1.15×` | Product renders |

Plane 2 exceeding `1.0×` is the point: products drift upward relative to the page, which is what
stops a centred layout reading flat. One rAF loop drives all of them.

---

## Documents

Read in this order.

| File | What it is |
|---|---|
| `BRAND-DNA.md` | **Authoritative.** SK ZIC identity system v2.0. Colour, type, the 12 visual principles, the claim taxonomy. |
| `ZIC_South_Africa_Product_Master.md` | **Authoritative for availability.** The confirmed SA assortment from Parts-Mall Africa. |
| `PRODUCT.md` | The brief. Users, tone, anti-references, strategic principles. |
| `DESIGN.md` | Tokens, components, motion, bans. |
| `LANDING-PAGE-SPEC.md` | Section-by-section build spec, motion inventory, responsive behaviour, build order. |
| `RESEARCH.md` | Research dossier. Every claim sourced; unverified ones flagged. |
| `GA4-DEPLOYMENT-SETUP.md` | Future GA4, cookie consent, privacy, deployment, and verification checklist. GA4 is currently disabled. |
| `design-snapshots/` | Approved design baseline, rendered from Figma. |

**Figma:** [SK ZIC — Landing Page](https://www.figma.com/design/0S6E56v08klREoNwS06ry8) · page `node-id=178-2`

---

## The five products

South Africa stocks five products across seven pack SKUs. **Nothing outside this list may appear
as locally available.**

| Product | Grade | Packs | Specification |
|---|---|---|---|
| ZIC X7 | 5W-30 | 1 L · 4 L | API SP · ILSAC GF-6 |
| ZIC X5 | 10W-30 | 1 L · 4 L | API SN Plus |
| ZIC X7 Diesel | 5W-30 | 6 L | ACEA A3/B4 |
| ZIC X3000 | 15W-40 | 6 L | API CG-4 |
| ZIC ATF MULTI | Multi-vehicle | 1 L | Fully synthetic ATF |

Machine-readable: `content/products.ts`.

---

## Non-negotiables

Carried from `BRAND-DNA.md`. Getting these wrong is a warranty claim, not a design critique.

1. **Specification before recommendation.** Find the manufacturer's required spec, then match the
   product. Never by viscosity, vehicle age or driving style alone.
2. **Claims are product-specific.** One product's OEM approval never transfers to another.
3. **The claim verbs are not synonyms.** *Approved by* ≠ *meets or exceeds* ≠ *recommended for*.
   Never upgrade a verb for punchier copy.
4. **No Low SAPS product exists in the SA range.** X7 Diesel and X3000 are both non-DPF. The page
   must not imply a particulate-filter diesel is covered.
5. **Red is active, never decorative.** Flow, CTAs, active states, proof. Never a large fill.
6. **No em dashes in copy.**
7. **Never AI-upscale product packaging.** It fabricates label text. See `RESEARCH.md §4.8`.

---

## Open items before launch

Tracked in full at `LANDING-PAGE-SPEC.md §9`.

- ❗ **ZIC X3000 6 L pack shot** — no official render exists. Currently a flagged placeholder.
- ❗ **X3000 API category** — the Parts-Mall master says CG-4, SK ZIC's catalogue and the pack say CF-4.
- ZIC X5 10W-30 at higher resolution (only 380 px is published).
- TDS and MSDS PDFs.
- Enquiry routing inbox.
