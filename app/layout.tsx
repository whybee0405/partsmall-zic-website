import type { Metadata, Viewport } from 'next';
import { Manrope, Inter, Roboto_Mono } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
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
  metadataBase: new URL('https://zic.parts-mall.co.za'),
  title: 'SK ZIC South Africa | Motor Oil and Fluids | Parts-Mall Africa',
  description:
    "SK ZIC motor oils and fluids, distributed across South Africa and Southern Africa by Parts-Mall Africa. Built on YUBASE, the world's number one Group III base oil. Available at over 40 branches.",
  openGraph: {
    title: 'SK ZIC South Africa | Performance Starts Within',
    description:
      "The world's number one Group III base oil, engineered into motor oil for South African conditions. Distributed by Parts-Mall Africa.",
    type: 'website',
    locale: 'en_ZA',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Never disable zoom.
  maximumScale: 5,
  themeColor: '#090b0e',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${manrope.variable} ${inter.variable} ${robotoMono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to main content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
