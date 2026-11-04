import { createCloudia } from '@cloudia-cms/client';
import type {
  Company,
  Cta,
  Faq,
  Network,
  Product,
  Region,
  SiteContent,
} from './types';

/**
 * The site's editable content, from its CloudIA CMS (`cms` on the Compose network), plus the live
 * Parts-Mall Africa branch network from Parts-Mall's own CMS.
 *
 * Read once per 30 seconds and shared by every request in that window; while a source is
 * unreachable the last good copy keeps being served. Parts-Mall's branch figures fall back to the
 * last transcribed numbers (August 2026) when they have never been reachable since start-up, so an
 * outage there can never take this site down.
 */
export const CLOUDIA_URL = (process.env.CLOUDIA_URL || 'http://127.0.0.1:8788').replace(/\/$/, '');
const BRANCHES_URL =
  process.env.PARTSMALL_BRANCHES_URL ||
  'https://parts-mall.co.za/api/branches?where[active][equals]=true&limit=0&depth=0';
const TTL_MS = 30_000;

type Doc = Record<string, any>;
const cms = createCloudia({ url: CLOUDIA_URL, requestInit: { cache: 'no-store' } });

// ------------------------------------------------------------------ network (Parts-Mall)

/** Display order of the Distribution section, and where each Parts-Mall province belongs. */
const REGION_ORDER = [
  'Gauteng',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Cape Region',
  'Free State',
  'KwaZulu-Natal',
  'Elsewhere in Africa',
];
const REGION_OF: Record<string, string> = {
  'Western Cape': 'Cape Region',
  'Eastern Cape': 'Cape Region',
  'Northern Cape': 'Cape Region',
  'Pan-Africa': 'Elsewhere in Africa',
};
/** Neighbouring countries in the order the site has always listed them; new ones follow A–Z. */
const COUNTRY_ORDER = ['Eswatini', 'Botswana', 'Mozambique', 'Namibia', 'Zimbabwe'];

/** Transcribed from parts-mall.co.za on 2026-08-11; only used until the live figures load. */
const FALLBACK_NETWORK = {
  REGIONS: [
    { name: 'Gauteng', count: 16 },
    { name: 'Limpopo', count: 6 },
    { name: 'Mpumalanga', count: 4 },
    { name: 'North West', count: 4 },
    { name: 'Cape Region', count: 3 },
    { name: 'Free State', count: 3 },
    { name: 'KwaZulu-Natal', count: 3 },
    { name: 'Elsewhere in Africa', count: 5 },
  ],
  NEIGHBOURING: 'ESWATINI  ·  BOTSWANA  ·  MOZAMBIQUE  ·  NAMIBIA  ·  ZIMBABWE',
  NETWORK: { branches: 44, provinces: 9, countries: 5 },
};
type NetworkContent = typeof FALLBACK_NETWORK;

async function loadNetwork(): Promise<NetworkContent> {
  const response = await fetch(BRANCHES_URL, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Parts-Mall branches returned ${response.status}`);
  const { docs } = (await response.json()) as { docs: { province: string; country: string }[] };
  if (!Array.isArray(docs) || !docs.length) throw new Error('Parts-Mall returned no branches');

  const counts = new Map<string, number>();
  for (const branch of docs) {
    const region = REGION_OF[branch.province] ?? branch.province;
    counts.set(region, (counts.get(region) ?? 0) + 1);
  }
  const regions: Region[] = [
    ...REGION_ORDER.filter((name) => counts.has(name)),
    ...[...counts.keys()].filter((name) => !REGION_ORDER.includes(name)).sort(),
  ].map((name) => ({ name, count: counts.get(name)! }));

  const abroad = [...new Set(docs.filter((b) => b.country !== 'South Africa').map((b) => b.country))];
  abroad.sort((a, b) => {
    const ia = COUNTRY_ORDER.indexOf(a);
    const ib = COUNTRY_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  });
  const provinces = new Set(
    docs.filter((b) => b.country === 'South Africa').map((b) => b.province),
  ).size;

  return {
    REGIONS: regions,
    NEIGHBOURING: abroad.map((c) => c.toUpperCase()).join('  ·  '),
    NETWORK: { branches: docs.length, provinces, countries: abroad.length },
  };
}

// ------------------------------------------------------------------ CMS content

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);

/** CMS image fields hold `/api/media/<id>` (or a full URL to it); the site serves them itself. */
function imagePath(value: unknown) {
  const url = String(value ?? '');
  const match = /\/api\/media\/[0-9a-f-]+$/.exec(url);
  return match ? match[0] : url;
}

/** A displayed phone number as digits with the country code: 011 392 1141 -> 27113921141. */
function e164Digits(display: string) {
  const digits = display.replace(/\D/g, '');
  if (display.trim().startsWith('+')) return digits;
  return digits.startsWith('0') ? `27${digits.slice(1)}` : digits;
}

const cta = (label: string, href: string): Cta => ({
  label,
  href,
  external: /^https?:\/\//.test(href),
});

function toProduct(doc: Doc): Product {
  return {
    id: doc.slug,
    name: doc.name,
    family: doc.family,
    grade: doc.grade,
    packSizes: doc.packSizes ?? [],
    oilType: doc.oilType,
    technology: text(doc.technology),
    specification: doc.specification ?? [],
    shortSpec: text(doc.shortSpec),
    claims: (doc.claims ?? []).length ? doc.claims.map((c: Doc) => ({ verb: c.verb, value: c.value })) : undefined,
    whoItsFor: doc.whoItsFor,
    positioning: doc.positioning,
    benefits: (doc.benefits ?? []).map((b: Doc) => b.text),
    properties: (doc.properties ?? []).length
      ? Object.fromEntries(doc.properties.map((p: Doc) => [p.label, p.value]))
      : undefined,
    warning: text(doc.warning),
    image: imagePath(doc.image),
    imageWidth: Number(doc.imageWidth),
    imageHeight: Number(doc.imageHeight),
    imageNote: text(doc.imageNote),
  };
}

const byOrder = (a: Doc, b: Doc) => (Number(a.order) || 0) - (Number(b.order) || 0);

async function first(collection: string) {
  const { docs } = await cms.find({ collection, limit: 1, depth: 0 });
  if (!docs[0]) throw new Error(`CMS has no published ${collection}`);
  return docs[0] as Doc;
}

async function loadCms() {
  const [products, faqs, company, trust] = await Promise.all([
    cms.find({ collection: 'products', limit: 0, depth: 0 }),
    cms.find({ collection: 'faqs', limit: 0, depth: 0 }),
    first('company'),
    first('trust'),
  ]);
  const COMPANY: Company = {
    legalName: company.legalName,
    tradingName: company.tradingName,
    country: company.country,
    registrationNumber: company.registrationNumber,
    vatNumber: company.vatNumber,
    email: company.email,
    addressStreet: company.addressStreet,
    addressLocality: company.addressLocality,
    addressPostalCode: company.addressPostalCode,
    address: `${company.addressStreet}, ${company.addressLocality} ${company.addressPostalCode}`,
    phone: company.phone,
    phoneHref: `tel:+${e164Digits(company.phone)}`,
    whatsapp: company.whatsapp,
    whatsappHref: `https://wa.me/${e164Digits(company.whatsapp)}?text=${encodeURIComponent(company.whatsappMessage ?? '')}`,
  };
  return {
    PRODUCTS: (products.docs as Doc[]).sort(byOrder).map(toProduct),
    HOME_FAQS: (faqs.docs as Doc[]).sort(byOrder).map((f): Faq => ({ question: f.question, answer: f.answer })),
    COMPANY,
    PRIMARY_CTA: cta(company.primaryCtaLabel, company.primaryCtaHref),
    SECONDARY_CTA: cta(company.secondaryCtaLabel, company.secondaryCtaHref),
    BRANCH_FINDER: cta(company.branchFinderLabel, company.branchFinderHref),
    proofTemplates: (trust.proofCells ?? []).map((c: Doc) => ({ label: c.label, value: c.value })),
    YUBASE_CAPACITY: (trust.yubaseCapacity ?? []).map((c: Doc) => ({ amount: c.amount, site: c.site })),
    GOOGLE_RATING: {
      score: Number(trust.googleRatingScore),
      outOf: Number(trust.googleRatingOutOf),
      count: trust.googleRatingCount,
      source: trust.googleRatingSource,
      href: trust.googleRatingHref,
    },
    KBPI: {
      years: Number(trust.kbpiYears),
      index: trust.kbpiIndex,
      claim: trust.kbpiClaim,
      href: trust.kbpiHref,
    },
  };
}
type CmsContent = Awaited<ReturnType<typeof loadCms>>;

// ------------------------------------------------------------------ cache

function cached<T>(load: () => Promise<T>, label: string, fallback?: T) {
  let value: { at: number; data: T } | null = null;
  let pending: Promise<T> | null = null;
  return (): Promise<T> => {
    if (value && Date.now() - value.at < TTL_MS) return Promise.resolve(value.data);
    pending ??= load()
      .then((data) => {
        value = { at: Date.now(), data };
        return data;
      })
      .catch((error) => {
        console.error(`[cms] ${label} unavailable:`, error);
        if (value) return value.data;
        if (fallback) return fallback;
        throw error;
      })
      .finally(() => {
        pending = null;
      });
    return pending;
  };
}

const getCms = cached<CmsContent>(loadCms, 'CloudIA content');
const getNetwork = cached<NetworkContent>(loadNetwork, 'Parts-Mall branch network', FALLBACK_NETWORK);

export async function getSiteContent(): Promise<SiteContent> {
  const [{ proofTemplates, ...content }, network] = await Promise.all([getCms(), getNetwork()]);
  const fill = (value: string) =>
    value
      .replaceAll('{branches}', String(network.NETWORK.branches))
      .replaceAll('{provinces}', String(network.NETWORK.provinces))
      .replaceAll('{countries}', String(network.NETWORK.countries));
  return {
    ...content,
    PROOF_CELLS: proofTemplates.map((cell: { label: string; value: string }) => ({ ...cell, value: fill(cell.value) })),
    ...network,
  };
}
