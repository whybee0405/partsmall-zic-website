declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 event. Safe to call unconditionally, from anywhere — a no-op
 * whenever GA4 hasn't loaded (no measurement ID configured yet, see
 * components/Analytics.tsx, or the visitor hasn't accepted analytics
 * cookies). Callers never need to check either condition themselves.
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
