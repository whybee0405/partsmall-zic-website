/**
 * Hero trust signals. Every figure here is sourced, per the same rule as
 * proof.ts: do not add a claim without one, do not round further than the
 * source did.
 *
 * Reviewed 2026-08-19:
 * - Google rating and review count are self-reported by Parts-Mall Africa's
 *   own storefront (koreanautoparts.co.za), which trades as the official
 *   Parts-Mall distributor. This is not a live API pull — it is a snapshot
 *   of what the distributor states on its own site, and should be re-checked
 *   periodically rather than trusted as current indefinitely.
 * - Parts-Mall Africa's own Hellopeter and Facebook listings show zero
 *   reviews, so those platforms are not usable sources for this figure.
 * - No independently verifiable review-platform rating exists for the ZIC
 *   brand itself at any usable sample size. Checked: Amazon India (single
 *   SKUs at 3-7 reviews each, too thin and the wrong market), Amazon UAE
 *   (listings with no visible review counts), Russian aggregators including
 *   otzovik.com (a real third-party review site, but blocked the fetch —
 *   HTTP 507 — so no number could be confirmed). No Trustpilot listing
 *   found. A claimed Russian ZaRulem "best lubricant" award surfaced in
 *   search but only via secondary paraphrase, with no primary source
 *   confirmed, so it is deliberately left out here.
 * - The Korea Brand Power Index figure below is, by contrast, a real,
 *   large-sample, professionally-run survey result and is directly about
 *   the ZIC brand, not a retailer — confirmed against the official page.
 */
export const GOOGLE_RATING = {
  score: 4.6,
  outOf: 5,
  count: '1,000+',
  source: 'Google reviews',
  entity: 'Parts-Mall Africa',
  href: 'https://koreanautoparts.co.za/',
} as const;

/** Source: skzic.com/eng/index.do, retrieved 2026-08-19. See RESEARCH.md §1.2. */
export const KBPI = {
  years: 28,
  index: 'Korea Brand Power Index',
  claim: 'No.1 engine oil brand',
  href: 'https://www.skzic.com/eng/index.do',
} as const;
