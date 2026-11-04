/**
 * One-off (2026-11-04): exports the content that moved to CloudIA from the old content/*.ts files
 * into seed.json, in the CMS models' shapes. Those files were removed by the migration, so this only
 * runs on a checkout of commit 1d7e231 (Node 24, from the repository root):
 *   node cloudia/migration/export-content.ts > cloudia/migration/seed.json
 * Kept as the record of how seed.json was produced; it is not part of the site build.
 */
import { PRODUCTS } from '../../content/products.ts'
import { COMPANY } from '../../content/company.ts'
import { PRIMARY_CTA, SECONDARY_CTA, BRANCH_FINDER } from '../../content/cta.ts'
import { PROOF_CELLS, YUBASE_CAPACITY } from '../../content/proof.ts'
import { GOOGLE_RATING, KBPI } from '../../content/trust.ts'
import { HOME_FAQS } from '../../lib/seo.ts'

const whatsappMessage = decodeURIComponent(COMPANY.whatsappHref.split('?text=')[1] ?? '')

const seed = {
  products: PRODUCTS.map((p, index) => ({
    slug: p.id,
    imageFile: `public${p.image}`,
    data: {
      name: p.name,
      family: p.family,
      grade: p.grade,
      order: (index + 1) * 10,
      packSizes: p.packSizes,
      oilType: p.oilType,
      technology: p.technology ?? null,
      specification: p.specification,
      shortSpec: p.shortSpec ?? null,
      claims: (p.claims ?? []).map((c) => ({ verb: c.verb, value: c.value })),
      whoItsFor: p.whoItsFor,
      positioning: p.positioning,
      benefits: p.benefits.map((text) => ({ text })),
      properties: Object.entries(p.properties ?? {}).map(([label, value]) => ({ label, value })),
      warning: p.warning ?? null,
      imageWidth: p.imageWidth,
      imageHeight: p.imageHeight,
      imageNote: p.imageNote ?? null,
    },
  })),
  faqs: HOME_FAQS.map((f, index) => ({
    slug: `faq-${index + 1}`,
    data: { question: f.question, answer: f.answer, order: (index + 1) * 10 },
  })),
  company: {
    legalName: COMPANY.legalName,
    tradingName: COMPANY.tradingName,
    country: COMPANY.country,
    registrationNumber: COMPANY.registrationNumber,
    vatNumber: COMPANY.vatNumber,
    email: COMPANY.email,
    // Head office address: hard-coded in five places before (layout, contact, footer, support pages, llms-full.txt).
    addressStreet: '901 Herman Street, PZR Business Park',
    addressLocality: 'Meadowdale, Germiston',
    addressPostalCode: '1401',
    phone: COMPANY.phone,
    whatsapp: COMPANY.whatsapp,
    whatsappMessage,
    primaryCtaLabel: PRIMARY_CTA.label,
    primaryCtaHref: PRIMARY_CTA.href,
    secondaryCtaLabel: SECONDARY_CTA.label,
    secondaryCtaHref: SECONDARY_CTA.href,
    branchFinderLabel: BRANCH_FINDER.label,
    branchFinderHref: BRANCH_FINDER.href,
  },
  trust: {
    proofCells: PROOF_CELLS.map((c) => ({
      label: c.label,
      // The network cell becomes live: the site fills these from Parts-Mall's branch data.
      value: c.label === '[ NETWORK ]'
        ? '{branches} branches, {provinces} provinces and {countries} Southern African countries.'
        : c.value,
    })),
    yubaseCapacity: YUBASE_CAPACITY.map((c) => ({ amount: c.amount, site: c.site })),
    googleRatingScore: GOOGLE_RATING.score,
    googleRatingOutOf: GOOGLE_RATING.outOf,
    googleRatingCount: GOOGLE_RATING.count,
    googleRatingSource: GOOGLE_RATING.source,
    googleRatingHref: GOOGLE_RATING.href,
    kbpiYears: KBPI.years,
    kbpiIndex: KBPI.index,
    kbpiClaim: KBPI.claim,
    kbpiHref: KBPI.href,
    sourcesNote:
      'Reviewed 2026-08-19 (from content/trust.ts and content/proof.ts). Google rating: self-reported by Parts-Mall Africa on koreanautoparts.co.za, a snapshot, re-check periodically. Korea Brand Power Index: skzic.com/eng/index.do, retrieved 2026-08-19; the year count moves every year, re-verify before relying on it. Base oil, heritage and accreditation claims: docs/RESEARCH.md §1.2 and §2.2. YUBASE capacity: docs/RESEARCH.md §1.2.',
  },
}
console.log(JSON.stringify(seed, null, 2))
