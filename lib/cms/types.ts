/**
 * Shapes of the site content that lives in CloudIA CMS. Components read these through
 * getSiteContent() (server) or useSiteContent() (client); the names match the constants the
 * components used when the content lived in content/*.ts.
 */
export type ClaimVerb = 'approved' | 'meets-or-exceeds' | 'meets' | 'suitable-for-use';

export interface Claim {
  verb: ClaimVerb;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  family: 'petrol' | 'diesel' | 'transmission';
  grade: string;
  packSizes: string[];
  oilType: string;
  technology?: string;
  /** Headline specification, set in Roboto Mono. */
  specification: string[];
  /** Compact label for the five-across line-up, where columns are narrow. */
  shortSpec?: string;
  /** Additional OEM claims, rendered with claim chips. */
  claims?: Claim[];
  /** Plain language, Inter. Answers "is this me?" */
  whoItsFor: string;
  positioning: string;
  benefits: string[];
  properties?: Record<string, string>;
  /** Rendered as a bordered notice, never as body copy. */
  warning?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageNote?: string;
}

export interface Cta {
  label: string;
  href: string;
  external: boolean;
}

export interface Company {
  legalName: string;
  tradingName: string;
  country: string;
  registrationNumber: string;
  vatNumber: string;
  email: string;
  addressStreet: string;
  addressLocality: string;
  addressPostalCode: string;
  /** One line: street, area and postal code. */
  address: string;
  /** Display format. */
  phone: string;
  /** tel: link, E.164. Derived from `phone`. */
  phoneHref: string;
  /** Display format. */
  whatsapp: string;
  /** wa.me click-to-chat link with the opening message. Derived from `whatsapp`. */
  whatsappHref: string;
}

export interface ProofCell {
  label: string;
  value: string;
}

export interface CapacityCell {
  amount: string;
  site: string;
}

export interface GoogleRating {
  score: number;
  outOf: number;
  count: string;
  source: string;
  href: string;
}

export interface Kbpi {
  years: number;
  index: string;
  claim: string;
  href: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Region {
  name: string;
  count: number;
}

/** Live Parts-Mall Africa branch network figures. */
export interface Network {
  branches: number;
  provinces: number;
  countries: number;
}

export interface SiteContent {
  PRODUCTS: Product[];
  COMPANY: Company;
  PRIMARY_CTA: Cta;
  SECONDARY_CTA: Cta;
  BRANCH_FINDER: Cta;
  PROOF_CELLS: ProofCell[];
  YUBASE_CAPACITY: CapacityCell[];
  GOOGLE_RATING: GoogleRating;
  KBPI: Kbpi;
  HOME_FAQS: Faq[];
  REGIONS: Region[];
  NEIGHBOURING: string;
  NETWORK: Network;
}
