import { COMPANY } from '@/content/company';
import { PRODUCTS } from '@/content/products';

export const dynamic = 'force-static';

export function GET() {
  const products = PRODUCTS.map((product) => {
    const specifications = product.specification.length ? product.specification.join(', ') : 'Refer to the current technical data sheet';
    const claims = product.claims?.map((claim) => `${claim.verb}: ${claim.value}`).join('; ');
    return `## ${product.name} ${product.grade}

- Category: ${product.family}
- Oil type: ${product.oilType}
- Pack sizes: ${product.packSizes.join(', ')}
- Specifications: ${specifications}
${claims ? `- Additional claims: ${claims}\n` : ''}- Positioning: ${product.positioning}
- Application guidance: ${product.whoItsFor}
- Benefits: ${product.benefits.join('; ')}
${product.warning ? `- Warning: ${product.warning}\n` : ''}`;
  }).join('\n');

  const body = `# SK ZIC South Africa — full reference

SK ZIC motor oils and fluids are distributed across South Africa and Southern Africa by Parts-Mall Africa.

Distributor contact: ${COMPANY.email} · ${COMPANY.phone} · WhatsApp ${COMPANY.whatsapp}
Head office: 901 Herman Street, PZR Business Park, Meadowdale, Germiston 1401, South Africa

# Product range

${products}

# Selection guidance

Choose lubricant by the viscosity grade and performance specification required in the vehicle owner manual. “Approved by” indicates formal OEM certification; “meets” and “meets or exceeds” are manufacturer declarations. Multi-vehicle ATF is not universal. Always request the current Technical Data Sheet for a controlled technical decision.

# Technology

YUBASE is the Group III base oil used in SK ZIC lubricants. SK Enmove produces it using VHVI hydroprocessing technology. The resulting base oil supports viscosity stability, low volatility and engine cleanliness when combined with a product-specific additive system.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
