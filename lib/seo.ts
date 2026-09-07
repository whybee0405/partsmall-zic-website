export const SITE_URL = 'https://skzic.co.za';
export const SITE_NAME = 'SK ZIC South Africa';
// Dedicated OG/Twitter asset: opaque JPEG at the standard 1200x630 share
// ratio (flattened onto Carbon black — the on-page version is transparent
// WebP, which social crawlers shouldn't be shown directly).
export const DEFAULT_SOCIAL_IMAGE = '/plates/oil-crown-splash-og.jpg';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const HOME_FAQS = [
  {
    question: 'What is SK ZIC?',
    answer:
      'SK ZIC is a range of engine oils and transmission fluids made by SK Enmove. The South African range includes petrol engine oil, diesel engine oil and automatic transmission fluid.',
  },
  {
    question: 'Who distributes SK ZIC in South Africa?',
    answer:
      'Parts-Mall Africa distributes SK ZIC products in South Africa and across Southern Africa.',
  },
  {
    question: 'Where can I buy SK ZIC in South Africa?',
    answer:
      'SK ZIC is available through the Parts-Mall Africa branch network. Contact Parts-Mall Africa or use the branch finder to confirm the nearest branch and current stock.',
  },
  {
    question: 'How do I choose the correct motor oil?',
    answer:
      'Start with the viscosity grade and performance specification required in the vehicle owner manual. Match both requirements to the product specification, and ask Parts-Mall Africa if you are uncertain.',
  },
  {
    question: 'What is YUBASE?',
    answer:
      'YUBASE is the Group III base oil used in SK ZIC lubricants. It is produced by SK Enmove using VHVI hydroprocessing technology to support viscosity stability, low volatility and engine cleanliness.',
  },
  {
    question: 'Does multi-vehicle ATF work in every automatic transmission?',
    answer:
      'No. Multi-vehicle does not mean universal. Always confirm the exact automatic transmission fluid specification required by the vehicle manufacturer before filling.',
  },
] as const;

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
