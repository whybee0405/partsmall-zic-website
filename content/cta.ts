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
  // Absolute path (not a bare `#enquire` hash) — the nav mounts this
  // globally, including on pages that don't render the Enquire section
  // themselves, so it has to work from anywhere, not just from "/".
  href: '/#enquire',
  external: false,
} as const;

export const SECONDARY_CTA = {
  label: 'Find your specification',
  href: '#products',
  external: false,
} as const;

export const BRANCH_FINDER = {
  label: 'Find your nearest branch',
  href: 'https://www.parts-mall.co.za/branches',
  external: true,
} as const;
