import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: ['Googlebot', 'Bingbot'], allow: '/', disallow: '/api/' },
      {
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'CCBot',
        ],
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://zic.parts-mall.co.za/sitemap.xml',
    host: 'https://zic.parts-mall.co.za',
  };
}
