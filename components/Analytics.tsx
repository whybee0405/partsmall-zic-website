'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { CONSENT_EVENT, getConsent } from '@/lib/consent';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google's Consent Mode v2: the gtag script loads on every page for every
 * visitor — unconditionally, exactly as Google's own installation
 * instructions and automated tag checker expect — but starts with
 * analytics_storage denied. Pre-consent, GA4 sends only anonymous,
 * cookieless modeling pings; full tracking (with cookies) starts only after
 * ConsentGate below calls `gtag('consent', 'update', ...)` on accept.
 *
 * This intentionally differs from the "don't load anything until consent"
 * approach docs/GA4-DEPLOYMENT-SETUP.md originally specified — switched to
 * this on request specifically so Google's tag checker detects the
 * installation. See that doc's changelog note for the reasoning.
 *
 * Still a no-op with no measurement ID configured, so safe to mount
 * unconditionally in the root layout regardless of GA4's setup state.
 *
 * The consent-default and init scripts live as static files under
 * public/scripts/ rather than inline here. An inline <script> needs a CSP
 * nonce to run under a real Content-Security-Policy, and a nonce has to be
 * minted per request — which forces every page in the app to render
 * dynamically instead of statically. Shipping these as ordinary same-origin
 * script files keeps them covered by a plain `script-src 'self'` and keeps
 * the rest of the site static. ga4-init.js gets the measurement ID from the
 * <meta name="ga-measurement-id"> tag layout.tsx renders, not from being
 * templated per-build — same reasoning, one static file instead of one
 * generated per GA ID.
 */
export default function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script src="/scripts/ga4-consent-default.js" strategy="beforeInteractive" />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script src="/scripts/ga4-init.js" strategy="afterInteractive" />
      <ConsentGate />
      <PageViewTracker />
    </>
  );
}

/** Pushes the visitor's real consent choice into gtag as soon as it's known, and on every change. */
function ConsentGate() {
  useEffect(() => {
    const sync = () => {
      const granted = getConsent()?.status === 'accepted';
      window.gtag?.('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  return null;
}

/** Fires a page_view on first mount and on every client-side route change. */
function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
