import type { Metadata, Viewport } from 'next';
import { Manrope, Inter, Roboto_Mono } from 'next/font/google';
import Analytics from '@/components/Analytics';
import CookieBanner from '@/components/CookieBanner';
import SmoothScroll from '@/components/SmoothScroll';
import StickyCta from '@/components/StickyCta';
import StructuredData from '@/components/StructuredData';
import { COMPANY } from '@/content/company';
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
    default: 'SK ZIC South Africa | Motor Oil & Fluids',
    template: '%s | SK ZIC South Africa',
  },
  description:
    "SK ZIC motor oils and fluids for South Africa, distributed by Parts-Mall Africa. Built on YUBASE, the world's No. 1 Group III base oil.",
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
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
  // Set NEXT_PUBLIC_GSC_VERIFICATION once Search Console issues a code — the
  // meta tag only renders when it's present, so this is safe to leave unset.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
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
        name: COMPANY.tradingName,
        legalName: COMPANY.legalName,
        vatID: COMPANY.vatNumber,
        identifier: {
          '@type': 'PropertyValue',
          name: 'CIPC company registration number',
          value: COMPANY.registrationNumber,
        },
        url: 'https://www.parts-mall.co.za',
        email: COMPANY.email,
        telephone: COMPANY.phoneHref.replace('tel:', ''),
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
        <StickyCta />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
