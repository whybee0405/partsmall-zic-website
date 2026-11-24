import type { Product } from '@/lib/cms/types';
import { numberWords } from '@/lib/words';

/**
 * The range as a line-up, left to right, for the opening sequence, its reduced-motion fallback
 * and the nav shelf. The X7 5W-30 is the hero pack the sequence opens on.
 *
 * Products are published in the CMS, so this list only fixes the order: a slug missing from the
 * CMS is skipped, and a published product not listed here joins on the right rather than being
 * silently left out.
 */
const ORDER = [
  'x5-10w30',
  'x7-diesel-5w30',
  'x7-5w30',
  'x5-diesel-15w40',
  'x3000-15w40',
  'atf-multi',
];

export const HERO_ID = 'x7-5w30';

export function lineup(products: Product[]): Product[] {
  const rank = (p: Product) => {
    const i = ORDER.indexOf(p.id);
    return i < 0 ? ORDER.length : i;
  };
  return [...products].sort((a, b) => rank(a) - rank(b));
}

/** "Five" products and "Seven" pack sizes, counted from what is published. */
export function rangeCounts(products: Product[]) {
  return {
    products: numberWords(products.length),
    packs: numberWords(products.reduce((sum, p) => sum + p.packSizes.length, 0)),
  };
}

/** Tailwind needs literal class names, so column counts go through this map. */
export const COLS: Record<number, { base: string; md: string }> = {
  4: { base: 'grid-cols-4', md: 'md:grid-cols-4' },
  5: { base: 'grid-cols-5', md: 'md:grid-cols-5' },
  6: { base: 'grid-cols-6', md: 'md:grid-cols-6' },
  7: { base: 'grid-cols-7', md: 'md:grid-cols-7' },
};
export const cols = (n: number) => COLS[n] ?? COLS[Math.min(7, Math.max(4, n))];
