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
 */
export default function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="ga4-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          // 'denied' is the only safe default for a first paint — server-
          // rendered HTML can't read localStorage. ConsentGate below
          // corrects this to 'granted' within one tick on the client if a
          // prior visit already accepted, before any page_view fires.
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied'
          });
        `}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          // send_page_view: false — PageViewTracker below sends every page_view
          // explicitly, including the first. The App Router never does a full
          // page load on client-side navigation, so the implicit page_view
          // this config call would otherwise send only ever fires once, on
          // the very first page, and silently misses every route change after.
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true, send_page_view: false });
        `}
      </Script>
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
