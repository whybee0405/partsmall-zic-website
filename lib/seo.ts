export const SITE_URL = 'https://skzic.co.za';
export const SITE_NAME = 'SK ZIC South Africa';
// Dedicated OG/Twitter asset: opaque JPEG at the standard 1200x630 share
// ratio (flattened onto Carbon black — the on-page version is transparent
// WebP, which social crawlers shouldn't be shown directly).
export const DEFAULT_SOCIAL_IMAGE = '/plates/oil-crown-splash-og.jpg';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

// The homepage FAQs live in CloudIA CMS (FAQs) and are read through getSiteContent().

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
