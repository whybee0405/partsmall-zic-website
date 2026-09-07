import Link from 'next/link';
import { ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';
import { COMPANY } from '@/content/company';
import { PRODUCTS } from '@/content/products';

export const metadata = pageMetadata(
  'Technical Resources',
  'Technical data, safety documents and product reference information for the SK ZIC range available from Parts-Mall Africa.',
  '/resources',
);

function requestHref(product: string, document: string) {
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(`${product} ${document} request`)}&body=${encodeURIComponent(`Please send me the current ${document} for ${product}.`)}`;
}

export default function ResourcesPage() {
  return (
    <SupportPage
      stamp="REFERENCE / CONTROLLED DOCUMENTS"
      title="Technical Resources"
      intro="Product specifications belong in controlled documents. Use the current TDS and SDS for the exact product, market and pack you intend to use."
      updated="19 AUGUST 2026"
    >
      <ContentSection number="01 / DOCUMENT STATUS" title="Request the current publication">
        <p>
          Public PDF files have not yet been supplied for this website. To prevent an outdated or mismatched document being presented as current, each request below goes directly to Parts-Mall Africa. Downloads will replace these request actions when verified South African documents are published.
        </p>
      </ContentSection>

      <section className="py-16 md:py-20" style={{ background: 'var(--color-fluid-grey)' }}>
        <div className="shell">
          <div className="grid gap-px overflow-hidden rounded-[8px]" style={{ background: 'var(--color-hairline)', border: '1px solid var(--color-hairline)' }}>
            {PRODUCTS.map((product, index) => (
              <article
                key={product.id}
                className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8"
                style={{ background: index % 2 === 0 ? 'var(--color-pure-white)' : 'var(--color-eng-white)' }}
              >
                <div>
                  <p className="t-mono text-[0.6875rem]" style={{ color: 'var(--color-zic-red)' }}>
                    {product.grade} / {product.packSizes.join(' · ')}
                  </p>
                  <h2 className="t-display mt-2 text-[1.5rem] leading-tight">{product.name}</h2>
                  <p className="mt-2 text-base" style={{ color: 'var(--color-steel-text)' }}>
                    {product.specification.length ? product.specification.join(' · ') : product.oilType}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={requestHref(`${product.name} ${product.grade}`, 'TDS')} className="btn btn-secondary !min-h-[44px] !px-4">
                    Request TDS
                  </a>
                  <a href={requestHref(`${product.name} ${product.grade}`, 'SDS')} className="btn btn-secondary !min-h-[44px] !px-4">
                    Request SDS
                  </a>
                  <Link href={`/products/${product.id}`} className="btn btn-primary !min-h-[44px] !px-4">
                    Product details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContentSection number="02 / READING THE FILES" title="TDS and SDS are different" dark>
        <p>
          A Technical Data Sheet summarises product performance, specifications and typical properties. A Safety Data Sheet covers hazards, handling, storage, first aid, transport and disposal. Neither document replaces the vehicle manufacturer&apos;s required lubricant specification.
        </p>
      </ContentSection>
    </SupportPage>
  );
}

