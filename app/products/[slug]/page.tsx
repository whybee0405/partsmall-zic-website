import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Footer from '@/components/sections/Footer';
import { SupportHeader } from '@/components/SupportPage';
import { ClaimChip } from '@/components/ui';
import { PRODUCTS } from '@/content/products';
import StructuredData from '@/components/StructuredData';
import { ORGANIZATION_ID, SITE_URL, WEBSITE_ID, absoluteUrl } from '@/lib/seo';

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.id === slug);
  if (!product) return {};
  const description = `${product.name} ${product.grade}: ${product.positioning} Specifications, pack sizes and application guidance for South Africa.`;
  return {
    title: `${product.name} ${product.grade}`,
    description,
    alternates: { canonical: `/products/${product.id}`, languages: { 'en-ZA': `/products/${product.id}` } },
    openGraph: {
      title: `${product.name} ${product.grade} | SK ZIC South Africa`,
      description,
      url: `/products/${product.id}`,
      type: 'website',
      locale: 'en_ZA',
      images: [{ url: product.image, alt: `${product.name} ${product.grade} product pack` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} ${product.grade} | SK ZIC South Africa`,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.id === slug);
  if (!product) notFound();

  const productUrl = absoluteUrl(`/products/${product.id}`);
  const productGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: `${product.name} ${product.grade}`,
        description: product.positioning,
        url: productUrl,
        image: absoluteUrl(product.image),
        sku: product.id,
        brand: { '@type': 'Brand', name: 'SK ZIC' },
        manufacturer: { '@type': 'Organization', name: 'SK Enmove' },
        category: `${product.family} lubricant`,
        audience: { '@type': 'Audience', geographicArea: { '@type': 'Country', name: 'South Africa' } },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Viscosity grade', value: product.grade },
          { '@type': 'PropertyValue', name: 'Oil type', value: product.oilType },
          { '@type': 'PropertyValue', name: 'Pack sizes', value: product.packSizes.join(', ') },
          ...product.specification.map((value) => ({ '@type': 'PropertyValue', name: 'Specification', value })),
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${productUrl}#webpage`,
        url: productUrl,
        name: `${product.name} ${product.grade} | SK ZIC South Africa`,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': `${productUrl}#product` },
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'en-ZA',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/#products` },
          { '@type': 'ListItem', position: 3, name: `${product.name} ${product.grade}`, item: productUrl },
        ],
      },
    ],
  };

  return (
    <>
      <StructuredData data={productGraph} />
      <SupportHeader />
      <main id="main" className="pt-[var(--nav-height)]">
        <section className="min-h-[calc(100dvh-var(--nav-height))] py-16 md:py-24">
          <div className="shell grid min-h-[70dvh] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative mx-auto h-[420px] w-full max-w-[460px] md:h-[560px]" style={{ background: 'var(--color-fluid-grey)' }}>
              <Image src={product.image} alt={`${product.name} ${product.grade} pack`} fill priority sizes="(min-width: 1024px) 42vw, 80vw" className="object-contain p-10" />
            </div>
            <div>
              <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>{product.family} / South African range</p>
              <h1 className="t-display mt-6 text-[clamp(3rem,7vw,6.5rem)] leading-[0.92]">{product.name}</h1>
              <p className="t-mono mt-5 text-[clamp(1.2rem,2.5vw,2rem)] font-semibold" style={{ color: 'var(--color-deep-steel)' }}>{product.grade}</p>
              <p className="t-lead mt-7 max-w-[650px]">{product.positioning}</p>
              <dl className="mt-10 grid grid-cols-2 gap-px" style={{ background: 'var(--color-hairline)', border: '1px solid var(--color-hairline)' }}>
                <div className="p-4" style={{ background: 'var(--color-pure-white)' }}><dt className="t-label" style={{ color: 'var(--color-steel-text)' }}>Oil type</dt><dd className="mt-2 text-[0.9375rem]">{product.oilType}</dd></div>
                <div className="p-4" style={{ background: 'var(--color-pure-white)' }}><dt className="t-label" style={{ color: 'var(--color-steel-text)' }}>Pack sizes</dt><dd className="t-mono mt-2 text-[0.875rem]">{product.packSizes.join(' · ')}</dd></div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#enquire" className="btn btn-primary">Enquire about this product</Link>
                <Link href="/resources" className="btn btn-secondary">Technical documents</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="chamber-dark py-20" style={{ background: 'var(--color-carbon)', color: 'var(--color-eng-white)' }}>
          <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="t-stamp" style={{ color: 'var(--color-metal-grey)' }}>SPECIFICATION / APPLICATION</p>
              <h2 className="t-display t-h2 mt-6">Check the requirement first.</h2>
              <p className="t-lead mt-7" style={{ color: 'var(--color-metal-grey)' }}>{product.whoItsFor}</p>
              {product.warning && <p className="mt-8 rounded-[8px] border p-5 text-[0.9375rem]" style={{ borderColor: 'var(--color-zic-red)', color: 'var(--color-eng-white)' }}>{product.warning}</p>}
            </div>
            <div>
              <p className="t-label" style={{ color: 'var(--color-metal-grey)' }}>Published specification</p>
              <p className="t-mono mt-4 text-[1.25rem] leading-relaxed">{product.specification.length ? product.specification.join(' · ') : product.oilType}</p>
              {product.claims && <ul className="mt-8 space-y-3">{product.claims.map((claim) => <li key={claim.value} className="flex flex-wrap items-center gap-3"><ClaimChip verb={claim.verb} /><span className="t-mono text-[0.8125rem]">{claim.value}</span></li>)}</ul>}
              <p className="t-label mt-12" style={{ color: 'var(--color-metal-grey)' }}>Benefits</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">{product.benefits.map((benefit) => <li key={benefit} className="border-t pt-3 text-[0.9375rem]" style={{ borderColor: 'var(--color-deep-steel)', color: 'var(--color-metal-grey)' }}>{benefit}</li>)}</ul>
            </div>
          </div>
        </section>

        {product.properties && (
          <section className="py-20">
            <div className="shell">
              <p className="t-stamp" style={{ color: 'var(--color-steel-text)' }}>TYPICAL PROPERTIES / REFERENCE</p>
              <h2 className="t-display t-h2 mt-6">Measured, not implied.</h2>
              <dl className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: 'var(--color-hairline)', border: '1px solid var(--color-hairline)' }}>
                {Object.entries(product.properties).map(([key, value]) => <div key={key} className="p-5" style={{ background: 'var(--color-pure-white)' }}><dt className="t-label" style={{ color: 'var(--color-steel-text)' }}>{key}</dt><dd className="t-mono mt-3 text-[0.875rem]">{value}</dd></div>)}
              </dl>
              <p className="mt-6 max-w-[760px] text-[0.8125rem]" style={{ color: 'var(--color-steel-text)' }}>Typical properties are not sales specifications and may vary within normal manufacturing tolerances. Request the current Technical Data Sheet before making a controlled technical decision.</p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
