import type { Metadata, Viewport } from 'next';
import { Manrope, Inter, Roboto_Mono } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import StructuredData from '@/components/StructuredData';
import { DEFAULT_SOCIAL_IMAGE, ORGANIZATION_ID, SITE_NAME, SITE_URL, WEBSITE_ID } from '@/lib/seo';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SK ZIC South Africa | Motor Oil and Fluids | Parts-Mall Africa',
    template: '%s | SK ZIC South Africa',
  },
  description:
    "SK ZIC motor oils and fluids, distributed across South Africa and Southern Africa by Parts-Mall Africa. Built on YUBASE, the world's number one Group III base oil. Available at over 40 branches.",
  openGraph: {
    title: 'SK ZIC South Africa | Performance Starts Within',
    description:
      "The world's number one Group III base oil, engineered into motor oil for South African conditions. Distributed by Parts-Mall Africa.",
    type: 'website',
    locale: 'en_ZA',
    url: '/',
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1200, height: 630, alt: 'SK ZIC motor oil represented by an amber oil crown' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SK ZIC South Africa | Performance Starts Within',
    description: 'SK ZIC motor oils and fluids, distributed by Parts-Mall Africa.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  alternates: { canonical: '/', languages: { 'en-ZA': '/' } },
  icons: { icon: '/brand/zic-logo-on-light.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  applicationName: SITE_NAME,
  category: 'Automotive lubricants',
  creator: 'Parts-Mall Africa',
  publisher: 'Parts-Mall Africa',
  authors: [{ name: 'Parts-Mall Africa', url: 'https://www.parts-mall.co.za' }],
  keywords: [
    'SK ZIC South Africa',
    'ZIC motor oil',
    'engine oil South Africa',
    'diesel engine oil',
    'automatic transmission fluid',
    'YUBASE',
    'Parts-Mall Africa',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never disable zoom.
  maximumScale: 5,
  themeColor: '#090b0e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const entityGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: 'Parts-Mall Africa',
        url: 'https://www.parts-mall.co.za',
        email: 'pma.sales2@parts-mall.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '901 Herman Street, PZR Business Park',
          addressLocality: 'Meadowdale, Germiston',
          postalCode: '1401',
          addressCountry: 'ZA',
        },
        areaServed: ['South Africa', 'Southern Africa'],
        knowsAbout: 'SK ZIC motor oils and transmission fluids',
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        description: 'Official South African information for SK ZIC motor oils and fluids distributed by Parts-Mall Africa.',
        inLanguage: 'en-ZA',
        publisher: { '@id': ORGANIZATION_ID },
      },
    ],
  };

  return (
    <html lang="en-ZA" className={`${manrope.variable} ${inter.variable} ${robotoMono.variable}`}>
      <body>
        <StructuredData data={entityGraph} />
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
