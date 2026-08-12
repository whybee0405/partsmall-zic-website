# PRODUCT.md

**register:** brand

## What this is

A single-page authority site for **SK ZIC** motor oils and fluids in South Africa and Southern
Africa, published by **Parts-Mall Africa**, the importer and distributor. It is a scroll-driven
product narrative, not a catalogue and not a shop. It exists to convert an enquiry.

This is the first of a series. Parts-Mall Africa will get one of these for each house brand
(PMC, Wingster, Essence). The system built here has to survive being re-skinned.

## Users

**The workshop owner.** Runs an independent shop in Boksburg or Polokwane. Buys oil in 6 L and
20 L. Has been offered a dozen cheap imports this year and has been burned by at least one.
Needs to know: is this real, does it carry the approvals, and can I get it in stock this week.
Opens the page on a mid-range Android in daylight, between jobs, with oil on their hands.

**The fleet manager.** Runs 40 delivery vehicles or a long-haul operation. Cares about one
thing on this page: the OEM approval list. Volvo VDS-4, MAN M3775, Cummins CES 20081. Will
scroll past every piece of storytelling to find the table.

**The informed owner-driver.** Hyundai, Kia, VW, a bakkie. Has read the owner's manual, knows
their car wants ACEA C3 or VW 504.00, and is checking whether ZIC has it before phoning a
branch. Price-aware but specification-led.

**The prospective reseller.** Wants territory, margin and support.

None of these people want to be entertained. They want to be convinced, and then told where
to get it.

## Brand

SK ZIC is SK Enmove's lubricant brand. SK Enmove makes **YUBASE**, the world's number one
Group III base oil at roughly 35% global share. ZIC does not buy its base oil; it makes the
base oil other brands buy. That single fact is the spine of the whole page.

Brand slogan: **"Dynamics in Flow."** Enduring role: **"Fluid Solution."**
SA campaign thought: **"Performance Starts Within."** (secondary, never replaces the slogan)

Parts-Mall Africa is the **local distribution and access layer, not the visual parent brand**.
The page is dressed as ZIC. Parts-Mall appears as the endorsement and the answer to "where do
I get it", in its own navy, in one chapter and the footer. It does not colonise the hero.

Full identity system: `BRAND-DNA.md`. Product and market research: `docs/RESEARCH.md`.

## Tone

Engineered, plain-spoken, unhurried. The voice of somebody who actually knows what a viscosity
index is and does not need to raise their voice about it.

Technical claims are stated exactly as certified and never inflated. *Approved by* and *meets
or exceeds* are different things and the copy treats them as different things. Specification
comes before recommendation, always.

No hype adjectives. No "unleash", no "revolutionary", no "game-changing". No em dashes.

## Anti-references

- **Motorsport theatre.** Chequered flags, flame gradients, carbon-fibre textures, tyre smoke,
  aggressive italics. ZIC's argument is continuous protection under real conditions, not one
  explosive moment. BRAND-DNA bans this explicitly.
- **The generic lubricant landing page.** Blue-to-black gradient, a floating bottle, three
  identical icon cards, "Premium Quality / Trusted Worldwide / Best Price".
- **SaaS template grammar.** Glassmorphism, hero-metric blocks, pill badges above every
  heading, rounded-corner icon squares, identical card grids.
- **Editorial-magazine affectation.** Display serif italic, drop caps, ruled three-column
  broadsheet layouts. This is a technical product, not a Sunday supplement.
- **Fake 3D.** No CSS or SVG pseudo-3D bottles, no illustrated engine cutaways. Real product
  photography and real macro imagery, or nothing.

## Strategic principles

1. **Reveal the invisible.** The master visual question is *what is happening inside?* Inside
   the engine, inside the oil film, inside the fluid path. Photography that shows what a normal
   car advert cannot.
2. **Data is proof.** Specification tables, approval lists and test properties are identity,
   not fine print. Set them beautifully and put them in the open.
3. **Localise the context, not the identity.** Highveld winter starts and the N3 to Durban
   change what we talk about. They do not change how ZIC looks.
4. **Red is active.** ZIC Red marks flow, energy, interaction and proof. Never decoration,
   never a large background fill.
5. **The claim never outruns the certificate.** Product-specific, verb-accurate, always.
6. **Availability is the close.** 40+ branches across 9 provinces and 5 neighbouring countries
   is the reason a workshop owner picks ZIC over an import they have to wait three weeks for.

## Conversion

Single CTA: **"Enquire Now"**, resolving to an enquiry form with province and interest
category. Every CTA on the page routes to the same place.

When the Parts-Mall ecommerce store ships, the label and destination change in one place. Build
it as a single exported constant (`PRIMARY_CTA`) consumed by every button, so the swap to
"Shop ZIC" plus a store URL is a one-line change.
