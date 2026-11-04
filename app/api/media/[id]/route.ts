import { CLOUDIA_URL } from '@/lib/cms/content';

/**
 * CMS images through the site itself.
 *
 * Browsers load /api/media/<id> straight from CloudIA (nginx sends /api there). next/image,
 * though, fetches local images from this Next server, so product renders reach the optimiser
 * through this route.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response('Not found', { status: 404 });
  const upstream = await fetch(`${CLOUDIA_URL}/api/media/${id}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (!upstream.ok || !upstream.body) {
    return new Response('Not found', { status: upstream.status === 404 ? 404 : 502 });
  }
  const headers = new Headers({ 'X-Content-Type-Options': 'nosniff' });
  for (const name of ['content-type', 'content-length', 'cache-control', 'etag', 'content-security-policy']) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(upstream.body, { status: 200, headers });
}
