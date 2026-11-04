import { createCloudiaTracker, type CloudiaTracker } from '@cloudia-cms/client/tracker';

/**
 * First-party, cookieless analytics through the site's CloudIA CMS (replaces GA4, 2026-11).
 *
 * Events go to /api/analytics-events, which nginx sends to the CMS. The tracker keeps only a
 * tab-lifetime session id in sessionStorage — no cookies, nothing across visits — and honours
 * Do Not Track and Global Privacy Control. Besides page views, exits and time on page it records
 * campaign (UTM) parameters, scroll depth, Core Web Vitals, outbound links, downloads, 404s and
 * WhatsApp/phone/email link clicks (`contact_click`).
 */
let tracker: CloudiaTracker | null = null;

export function getTracker() {
  if (typeof window === 'undefined') return null;
  tracker ??= createCloudiaTracker({
    endpoint: '/api/analytics-events',
    autoStart: false,
    // app/not-found.tsx marks its page, so 404s show under Analytics → Pages.
    notFound: () => Boolean(document.querySelector('[data-page-not-found]')),
  });
  return tracker;
}

/**
 * Records a custom event, such as `generate_lead`. Safe to call from anywhere: a no-op on the
 * server and while the tracker is not running (Do Not Track, excluded browser).
 */
export function trackEvent(name: string, params?: Record<string, string | number | boolean | null>) {
  getTracker()?.track(name, params);
}

/** Headers that tie an enquiry to this visit's source and campaign in CloudIA's reports. */
export function enquiryHeaders(): Record<string, string> {
  return getTracker()?.enquiryHeaders() ?? {};
}
