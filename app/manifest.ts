import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SK ZIC South Africa',
    short_name: 'SK ZIC SA',
    description: 'SK ZIC motor oils and fluids, distributed by Parts-Mall Africa.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f7f5',
    theme_color: '#090b0e',
    icons: [{ src: '/brand/zic-logo-on-light.png', sizes: '800x220', type: 'image/png' }],
  };
}

