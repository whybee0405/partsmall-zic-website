/**
 * The single CTA constant. Every button on the page consumes this.
 *
 * When the Parts-Mall ecommerce store ships, change it here and nowhere else:
 *
 *   export const PRIMARY_CTA = {
 *     label: 'Shop ZIC',
 *     href: 'https://store.parts-mall.co.za/zic',
 *     external: true,
 *   } as const;
 */
export const PRIMARY_CTA = {
  label: 'Enquire Now',
  href: '#enquire',
  external: false,
} as const;

export const SECONDARY_CTA = {
  label: 'Find your specification',
  href: '#products',
  external: false,
} as const;

export const BRANCH_FINDER = {
  label: 'Find your nearest branch',
  href: 'https://www.parts-mall.co.za/partsmall-branches.asp',
  external: true,
} as const;
