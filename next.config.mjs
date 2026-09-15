// HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy and
// Permissions-Policy are already set at the nginx vhost in front of this
// app (skzic.co.za) — adding them again here would just duplicate the
// header. CSP isn't set there yet, so it's added here instead: a static,
// per-build value (not per-request), which is what lets it apply without
// forcing every route to render dynamically. Next.js App Router emits inline
// hydration and Flight-data scripts, so script-src must permit inline scripts
// unless the app is converted to a per-request nonce CSP.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    // Product renders are transparent PNGs; AVIF first, WebP fallback.
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Everything under /public (favicons, product renders, brand marks)
        // otherwise ships with no caching at all — unlike /_next/static's
        // content-hashed, already-immutable assets. Not content-hashed, so
        // not immutable: a day of full freshness, then stale-while-revalidate
        // for a week so a redeploy's new file still shows up promptly.
        source: '/:all*(ico|png|jpg|jpeg|webp|avif|gif|svg|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: CONTENT_SECURITY_POLICY }],
      },
    ];
  },
};

export default nextConfig;
