/**
 * The product range lives in CloudIA CMS (Products) since 2026-11; components read it through
 * getSiteContent() / useSiteContent(). What stays here is layout code, not content.
 */
export type { Claim, ClaimVerb, Product } from '@/lib/cms/types';

/** Filter chips for Chapter 04. Only families that exist locally. */
export const FAMILIES = [
  { id: 'petrol', label: 'Petrol' },
  { id: 'diesel', label: 'Diesel' },
  { id: 'transmission', label: 'Transmission' },
] as const;
