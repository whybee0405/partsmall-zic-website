// Google's Consent Mode v2 default. 'denied' is the only safe default for a
// first paint — server-rendered HTML can't read localStorage.
// components/Analytics.tsx's ConsentGate corrects this to 'granted' within
// one tick on the client if a prior visit already accepted, before any
// page_view fires.
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
});
