/**
 * SK ZIC South Africa — confirmed local assortment.
 *
 * Source of truth: `ZIC_South_Africa_Product_Master.md` v1.0 (Parts-Mall Africa, August 2026).
 * Parts-Mall Africa's confirmed local assortment overrides the global ZIC catalogue.
 * Nothing outside this file may be presented as locally available.
 *
 * Technical claim verbs follow BRAND-DNA §7 exactly and must not be upgraded for punchier copy.
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
  imageNote?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'x7-5w30',
    name: 'ZIC X7',
    family: 'petrol',
    grade: '5W-30',
    packSizes: ['1 L', '4 L'],
    oilType: 'Fully synthetic',
    technology: 'VHVI Technology',
    specification: ['API SP', 'ILSAC GF-6'],
    whoItsFor:
      'The default modern petrol car. If your manufacturer calls for a 5W-30 and the engine is turbocharged and direct injection, the LSPI protection is the reason to be here rather than a cheaper oil.',
    positioning: 'Everyday protection. Engineered to flow.',
    benefits: [
      'Engine wear protection',
      'Sludge and deposit control',
      'Oxidation stability',
      'Low volatility',
      'Friction control',
      'LSPI protection for compatible modern turbocharged petrol engines',
    ],
    properties: {
      Density: '0.857 g/cm³',
      'Kinematic viscosity @40°C': '65.4 cSt',
      'Kinematic viscosity @100°C': '10.96 cSt',
      'Viscosity Index': '160',
      TBN: '7.4 mgKOH/g',
      'Flash Point': '226 °C',
      'Pour Point': '−42 °C',
      'HTHS @150°C': '3.3 cP',
    },
    image: '/products/zic-x7-5w30-4l.png',
    imageNote:
      'Official SK ZIC 4 L render. The printed label on this pack run reads API SN PLUS / ILSAC GF-5; the current published specification is API SP / ILSAC GF-6. Copy follows the specification, not the pack art. Confirm with Parts-Mall which pack run is landing in SA.',
  },
  {
    id: 'x5-10w30',
    name: 'ZIC X5',
    family: 'petrol',
    grade: '10W-30',
    packSizes: ['1 L', '4 L'],
    oilType: 'Synthetic',
    technology: 'VHVI Technology',
    specification: ['API SN Plus'],
    whoItsFor:
      'The sensible middle. Cars past warranty on normal mileage, where a full synthetic is more oil than the engine needs but a mineral oil is not enough.',
    positioning: 'Dependable synthetic protection for everyday driving.',
    benefits: [
      'Engine cleanliness',
      'Oxidation stability',
      'Low volatility',
      'Wear protection',
      'Dependable everyday operation',
    ],
    properties: {
      Density: '0.863 g/cm³',
      'Kinematic viscosity @40°C': '66.5 cSt',
      'Kinematic viscosity @100°C': '10.57 cSt',
      'Viscosity Index': '148',
      TBN: '7.4 mgKOH/g',
      'Flash Point': '230 °C',
      'Pour Point': '−42 °C',
    },
    image: '/products/zic-x5-10w30-1l.png',
    imageNote: 'Official SK ZIC 1 L render, upscaled. A 4 L render was not available from an official source.',
  },
  {
    id: 'x7-diesel-5w30',
    name: 'ZIC X7 Diesel',
    family: 'diesel',
    grade: '5W-30',
    packSizes: ['6 L'],
    oilType: 'Fully synthetic',
    specification: ['ACEA A3/B4'],
    claims: [
      { verb: 'meets-or-exceeds', value: 'MB 229.3' },
      { verb: 'meets-or-exceeds', value: 'VW 502.00 / 505.00' },
      { verb: 'meets-or-exceeds', value: 'Renault RN 0700 / 0710' },
    ],
    whoItsFor:
      'Modern CRDI bakkies, SUVs and vans without a particulate filter. Fully synthetic, so it is the right answer for a loaded bakkie doing long distance.',
    positioning: 'Fully synthetic protection for hard-working diesel engines.',
    benefits: [
      'Soot control',
      'Sludge and deposit control',
      'Wear protection',
      'Oxidation stability',
      'Low volatility',
      'Diesel engine cleanliness',
    ],
    warning:
      'Formulated for compatible diesel engines without DPF, CPF or SCR requirements. Do not recommend it for a modern diesel that requires a Low SAPS oil.',
    image: '/products/zic-x7-diesel-5w30-6l.png',
  },
  {
    id: 'x3000-15w40',
    name: 'ZIC X3000',
    family: 'diesel',
    grade: '15W-40',
    packSizes: ['6 L'],
    oilType: 'Diesel engine oil',
    specification: ['API CG-4'],
    whoItsFor:
      'Work vehicles. Diesel SUVs, light trucks, medium and heavy trucks, vans, buses and older diesels, where value per litre drives the decision and the engine predates modern emissions gear.',
    positioning: 'Dependable diesel protection. Built for work.',
    benefits: ['Practical everyday diesel protection', 'Wear protection', 'Deposit control'],
    properties: {
      Density: '0.869 g/cm³',
      'Kinematic viscosity @40°C': '113.6 cSt',
      'Kinematic viscosity @100°C': '14.88 cSt',
      'Viscosity Index': '135',
      TBN: '6.3 mgKOH/g',
      'Flash Point': '234 °C',
      'Pour Point': '−36 °C',
      'CCS @ −20°C': '5,800 cP',
      'HTHS @150°C': '4.2 cP',
    },
    warning:
      'API CG-4 is an older diesel category. Do not recommend it for a DPF or SCR equipped diesel unless the manufacturer specification explicitly permits it.',
    image: '/products/zic-x3000-15w40-20l.png',
    imageNote:
      'UNRESOLVED. The only official X3000 renders are 20 L and 1 L; no 6 L render exists on any SK ZIC channel. Do not ship a 20 L drum image against a 6 L SKU. Parts-Mall must supply a 6 L pack shot.',
  },
  {
    id: 'atf-multi',
    name: 'ZIC ATF MULTI',
    family: 'transmission',
    grade: 'Multi-vehicle ATF',
    packSizes: ['1 L'],
    oilType: 'Fully synthetic multi-vehicle ATF',
    specification: [],
    whoItsFor:
      'Automatic transmissions across a mixed workshop. Broad multi-vehicle coverage in a genuinely synthetic fluid.',
    positioning: 'Precision fluid control for smooth, consistent shifting.',
    benefits: [
      'Controlled friction characteristics',
      'Smooth shifting',
      'Anti-shudder performance',
      'Oxidation stability',
      'Transmission wear protection',
      'Fluid durability',
      'Broad multi-vehicle application',
    ],
    warning:
      '“Multi” does not mean suitable for every automatic transmission. Always check the ATF specification your transmission actually requires before filling.',
    image: '/products/zic-atf-multi-1l.png',
    imageNote: 'Official SK ZIC 1 L render. Korean domestic label artwork; confirm the SA label variant.',
  },
];

/** Filter chips for Chapter 04. Only families that exist locally. */
export const FAMILIES = [
  { id: 'petrol', label: 'Petrol' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'transmission', label: 'Transmission' },
] as const;

/** The hero line-up: three real SA SKUs at true relative pack scale. */
export const HERO_LINEUP = ['x7-diesel-5w30', 'x7-5w30', 'x5-10w30'] as const;

/** The bottle the convergence resolves onto. */
export const HERO_FOCUS = 'x7-5w30';
