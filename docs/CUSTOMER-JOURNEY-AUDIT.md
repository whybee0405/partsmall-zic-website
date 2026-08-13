# Customer journey audit

**Page:** SK ZIC South Africa landing page
**Date:** 13 August 2026
**Method:** Code review against the shipped build, plus measured scroll geometry at
1440×900 and 393×852 (`scripts/journey.mjs`), and click-through tests of every
in-page CTA (`scripts/anchors.mjs`).

This audit covers the journey only — whether a visitor can get from arrival to a
decision. It is not a visual or accessibility review.

---

## 1. Who arrives

Four audiences, in rough order of commercial value to Parts-Mall Africa. The page
was written for the first; the others are served by inheritance.

| # | Visitor | What they came for | Decides on |
|---|---|---|---|
| 1 | **Independent workshop owner / RMI mechanic** | Does ZIC meet the spec this car needs, and can I get it this week | Specification match, stock proximity, trade terms |
| 2 | **Fleet manager** | Consistent supply, documented approvals, drain intervals | Datasheets, supply reliability, price stability |
| 3 | **DIY / retail driver** | Which oil for my car, where to buy it | Plain-language match, a shop, a price |
| 4 | **Prospective agent / reseller** | Is this a line worth carrying | Margin, brand pull, distribution support |

The page's argument — specification before viscosity, base oil as the root of
performance — is pitched squarely at 1 and 2. That is the right choice. The
findings below are mostly about whether those two can *act* once persuaded.

---

## 2. The journey as built

Measured depth to each section. "Screens" is scroll distance divided by viewport
height — how many full swipes from the top.

| Section | Desktop (1440×900) | Phone (393×852) |
|---|---|---|
| Hero | 0 | 0 |
| Descent (falling canister + notes) | 0.7 | 0.6 |
| Splash / impact | 4.0 | 3.1 |
| The five (range reveal) | 5.1 | 4.0 |
| Proof band | 6.4 | 5.0 |
| Ch.01 What is happening inside? | 6.8 | 5.7 |
| Ch.02 YUBASE | 9.6 | 7.0 |
| Ch.03 Stable under change | 10.9 | 8.6 |
| **Ch.04 Find your ZIC (the product table)** | **13.9** | **9.8** |
| Ch.05 ATF MULTI | 15.4 | 11.8 |
| Ch.06 Where to get it | 16.8 | 13.8 |
| Enquire | 18.1 | 15.7 |
| Footer | 19.5 | 17.4 |
| **Total page** | **20.2** | **18.3** |

Stage by stage:

| Stage | Intent | What the page does | Verdict |
|---|---|---|---|
| **Arrive** | "Is this the right place?" | Hero names the brand, the distributor and the region in one stamp line | Works |
| **Orient** | "Where is what I need?" | Nav has Technology / Products / Availability | **Desktop only** — see S1 |
| **Believe** | "Is this a serious oil?" | Proof band, then YUBASE chapter: SK Enmove *makes* the base oil others buy | Works, and it is the strongest card |
| **Understand** | "Why does that matter to me?" | Ch.01 lubrication states, Ch.03 viscosity index against SA conditions | **Desktop only** — see S4 |
| **Select** | "Which one do I need?" | Ch.04 table: spec-first, family filter, disclosure per row | Works on desktop; no per-row action — see S3 |
| **Verify** | "Can I actually get it?" | Ch.06 branch counts by province, external branch finder | Works |
| **Act** | "Right, how do I buy it?" | Enquiry form | **Broken** — see B1 |

---

## 3. Findings

Severity is by commercial consequence, not by effort to fix.

### Blocking

**B1 — The enquiry form submits into nothing.**
`components/sections/Enquire.tsx:107` posts to `/api/enquire`. There is no `app/api`
directory in the project. Every submission on the page's only conversion path
fails. A visitor who reads all twenty screens, is persuaded, fills in eight fields
and presses the button gets an error page.

This is the single most expensive defect on the site. Everything else in this
document is an optimisation by comparison.

**B2 — Both datasheet links are dead.**
`components/sections/Footer.tsx:15-16` — "Download TDS" and "Download MSDS" are
`href="#"`. For audience 2 (fleet) the TDS *is* the decision document. Offering it
and then not delivering is worse than not offering it: it converts a warm visitor
into a disappointed one at the last moment.

### Severe

**S1 — There is no wayfinding below 1024px.**
`components/Nav.tsx:88` hides the entire link list with `hidden … lg:flex`. On a
phone the only control in the nav is "Enquire Now". The product table is **9.8
screens down** with no way to jump to it.

South African trade traffic is overwhelmingly mobile. This strands the
highest-intent visitor — the one who already knows what ZIC is and wants to check
a grade — behind ten screens of narrative they did not ask for.

**S2 — Time-to-product is 13.9 screens on desktop.**
The opening sequence is 6.4 screens before the first factual claim. It is good
work and it earns attention, but there is currently no way to decline it. A
returning visitor pays the full cost every time.

**S3 — The product table has no per-row action.**
`components/sections/Products.tsx` discloses specification, pack sizes, properties
and warnings, and then offers the visitor nothing to do. Having identified their
product, they must scroll a further 4.2 screens to a generic form and re-describe
it from memory.

Note the contrast: ATF MULTI gets a product-level CTA at
`components/sections/Transmission.tsx:111` ("Enquire about this fluid →"). The
main range — the five products that matter most — does not.

**S4 — The persuasion mechanism is desktop-only.**
Ch.01 and Ch.03 are the two sections that *demonstrate* rather than assert: the
oil film visibly thins as the copy describes boundary lubrication, and the
viscosity curves diverge as the readout head crosses the temperature axis. Both
fall back to static stacks below 768px (`Inside.tsx:57`, `Vhvi.tsx:50`).

Mobile visitors — the majority — get the claims without the proof. The argument
that makes this page different from a brochure is the one that does not survive
the trip to a phone.

### Moderate

**M1 — No price, no stock, no lead time.**
"Enquire Now" asks the visitor to wait. For a workshop owner deciding between ZIC
and a shelf they can already see, an unanswered price question is a reason to stop.
This is a business decision as much as a design one, but it should be a decision,
not a default.

**M2 — No phone number and no WhatsApp.**
The only direct contact is an email address in the footer
(`components/sections/Footer.tsx:77`). In South African trade, WhatsApp is the
default channel for exactly this kind of enquiry. A workshop will message a number
long before it fills in a form.

**M3 — A specification-first page ships a disputed specification.**
ZIC X3000 carries API **CG-4** in `content/products.ts` while SK ZIC's own
catalogue and the pack artwork say **CF-4**. The same product uses a placeholder
pack shot (a genuine X3000 render, but the wrong market's pack). The entire
argument of the page is "start with the specification" — the one product whose
specification is unresolved undermines it.

**M4 — The range reveal is decorative.**
The five packs in the opening sequence are named, graded and labelled, and none of
them is a link. The moment of highest product interest in the whole page routes
nowhere.

**M5 — No way to search by vehicle.**
The enquiry form asks for "2019 Hyundai Creta 1.6"; the table filters only by
family (petrol / diesel / transmission). The visitor is asked for a vehicle at the
end of the journey but cannot use one at the point of selection.

**M6 — The form's stated behaviour is not its actual behaviour.**
`Enquire.tsx:9-11` documents "Validation on blur, not on keystroke. Errors render
below the field they belong to." Neither is implemented — there is native `required`
validation and nothing else. There is also no success state, so even with B1 fixed
the visitor gets no confirmation that anything happened.

### Minor

**N1 — The hero's two CTAs are ranked against the trade visitor.**
"Enquire Now" is primary; "Find your specification" is secondary. For audiences 1
and 2, specification-first is the better opening move, and it is also the page's
own stated philosophy.

**N2 — "Become an agent" has no journey.**
It sits in the footer resource list beside consumer downloads
(`Footer.tsx:18`). Audience 4 arrives with different questions — margin,
territory, support — and the page answers none of them.

---

## 4. What is working

Worth stating plainly, because it should not be traded away in fixing the above.

- **One CTA constant.** `content/cta.ts` is consumed by every button on the page.
  When the ecommerce store ships, the swap is one file. This is unusually
  disciplined and should be preserved.
- **All in-page anchors work under Lenis.** Verified by click test: the hero CTA
  lands on `#enquire` (16,300px), the nav lands on `#products` (12,552px). Smooth
  scroll libraries routinely break this; here it holds.
- **Claim taxonomy is honest.** The footer distinguishes "Approved by" from "meets
  or exceeds", and the ATF MULTI chapter puts a warning label on the company's own
  product. For audience 1 this is a trust signal that no amount of copy can buy.
- **Availability is answered concretely.** Branch counts by province, named
  neighbouring countries, RMI accreditation. This is the reason a workshop picks a
  distributed brand over an import.

---

## 5. Recommended order of work

Ranked by consequence per unit of effort.

| Priority | Action | Addresses |
|---|---|---|
| 1 | Build `/api/enquire` — server action, validation, an inbox, a success state | B1, M6 |
| 2 | Add mobile navigation: a sheet or a sticky "Find your ZIC" control below 1024px | S1, S2 |
| 3 | Add a per-row "Enquire about this" to the product table, pre-filling the product | S3, M4 |
| 4 | Publish real TDS/MSDS files, or remove the links until they exist | B2 |
| 5 | Add WhatsApp and a phone number beside the form | M2 |
| 6 | Resolve X3000 CG-4 vs CF-4 with Parts-Mall; source the correct 6 L pack shot | M3 |
| 7 | Design the mobile interactions for Ch.01 and Ch.03 (swipe panels, carousel) | S4 |
| 8 | Decide the pricing posture: indicative pricing, or an explicit "trade pricing on enquiry" | M1 |
| 9 | Vehicle lookup at the point of selection | M5 |

Items 1 and 4 are content and back-end blockers requiring Parts-Mall input:
the destination inbox, the datasheet PDFs, and the X3000 specification.

---

## 6. Note on measurement

Scroll depths above are for the current build and will move as sections change.
Re-run `scripts/journey.mjs` against a local production server to refresh them.
The audit's structural findings do not depend on the exact figures.
