import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getSiteContent } from '@/lib/cms/content';

// Product pages come from CloudIA CMS, so the sitemap is built per request.
export const dynamic = 'force-dynamic';

const baseUrl = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { PRODUCTS } = await getSiteContent();
  const updated = new Date('2026-09-07T00:00:00+02:00');
  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'monthly' as const },
    { path: '/resources', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/paia', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/cookies', priority: 0.2, changeFrequency: 'yearly' as const },
    { path: '/accessibility', priority: 0.2, changeFrequency: 'yearly' as const },
  ];

  return [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: updated,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: { languages: { 'en-ZA': `${baseUrl}${page.path}` } },
      ...(page.path === '' ? { images: [`${baseUrl}/plates/oil-crown-splash-og.jpg`] } : {}),
    })),
    ...PRODUCTS.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: { languages: { 'en-ZA': `${baseUrl}/products/${product.id}` } },
      images: [`${baseUrl}${encodeURI(product.image)}`],
    })),
  ];
}
