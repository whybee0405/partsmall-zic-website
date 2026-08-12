/**
 * Section register. Drives the Film Rail and the chapter anchors.
 *
 * `film` is the rail's red column width in px, and it is not decoration: it is
 * the oil film in cross-section, so its thickness tracks what the chapter is
 * about. Thin at boundary lubrication, thick at fluid film.
 *
 * Spec: DESIGN.md "Signature device — The Film Rail".
 */

export interface SectionMeta {
  id: string;
  label: string;
  /** Rail column width in px. 0 means no rail (footer). */
  film: number;
  /** Dark chamber, so the rail hairlines switch to Deep Steel. */
  dark: boolean;
  /** Chapter tick number shown on the rail, if this section is a chapter. */
  tick?: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'hero', label: 'Hero', film: 2, dark: false },
  { id: 'splash', label: 'The Splash', film: 6, dark: true },
  { id: 'range', label: 'The Five', film: 8, dark: true },
  { id: 'proof', label: 'Proof', film: 2, dark: true },
  { id: 'inside', label: 'What is happening inside?', film: 8, dark: true, tick: '01' },
  { id: 'yubase', label: 'Performance begins with the base', film: 6, dark: false, tick: '02' },
  { id: 'vhvi', label: 'Stable under change', film: 3, dark: true, tick: '03' },
  { id: 'products', label: 'Find your ZIC', film: 4, dark: false, tick: '04' },
  { id: 'transmission', label: '“Multi” does not mean any', film: 4, dark: true, tick: '05' },
  { id: 'distribution', label: 'Where to get it', film: 4, dark: true, tick: '06' },
  { id: 'enquire', label: 'Enquire', film: 4, dark: true },
  { id: 'footer', label: 'Footer', film: 0, dark: true },
];

/** Nav anchors, desktop only. */
export const NAV_LINKS = [
  { href: '#inside', label: 'Technology' },
  { href: '#products', label: 'Products' },
  { href: '#distribution', label: 'Availability' },
] as const;
