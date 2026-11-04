// Reads the measurement ID from the <meta name="ga-measurement-id"> tag
// app/layout.tsx renders (only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set),
// rather than being templated with the ID at build time — see
// components/Analytics.tsx for why this ships as a static file at all.
(function () {
  var meta = document.querySelector('meta[name="ga-measurement-id"]');
  var id = meta && meta.content;
  if (!id || typeof window.gtag !== 'function') return;

  gtag('js', new Date());
  // send_page_view: false — PageViewTracker in components/Analytics.tsx sends
  // every page_view explicitly, including the first. The App Router never
  // does a full page load on client-side navigation, so the implicit
  // page_view this config call would otherwise send only ever fires once, on
  // the very first page, and silently misses every route change after.
  gtag('config', id, { anonymize_ip: true, send_page_view: false });
})();
