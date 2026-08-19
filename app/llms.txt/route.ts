import { PRODUCTS } from '@/content/products';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export function GET() {
  const products = PRODUCTS.map(
    (product) => `- [${product.name} ${product.grade}](${SITE_URL}/products/${product.id}): ${product.positioning}`,
  ).join('\n');

  const body = `# SK ZIC South Africa

> Official South African product and technical information for SK ZIC motor oils and transmission fluids distributed by Parts-Mall Africa.

## Primary pages

- [Home](${SITE_URL}/): Brand, technology, product range and availability.
- [Technical resources](${SITE_URL}/resources): TDS and SDS request information.
- [Contact](${SITE_URL}/contact): Product, stock, branch and reseller enquiries.

## Products

${products}

## Important guidance

- The local range on this website is the confirmed South African assortment.
- Always match the viscosity grade and performance specification required by the vehicle manufacturer.
- Product specifications and OEM claims are product-specific.
- Request the current Technical Data Sheet before making a controlled technical decision.

## Detailed reference

- [Full site reference](${SITE_URL}/llms-full.txt)
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
