/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    // Product renders are transparent PNGs; AVIF first, WebP fallback.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
