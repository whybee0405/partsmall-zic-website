import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import FilmRail from '@/components/FilmRail';
import BackToTop from '@/components/BackToTop';
import TrustBar from '@/components/TrustBar';
import OpeningSequence from '@/components/sections/OpeningSequence';
import Proof from '@/components/sections/Proof';
import WhyZic from '@/components/sections/WhyZic';
import Inside from '@/components/sections/Inside';
import Yubase from '@/components/sections/Yubase';
import Vhvi from '@/components/sections/Vhvi';
import Products from '@/components/sections/Products';
import Transmission from '@/components/sections/Transmission';
import Distribution from '@/components/sections/Distribution';
import Enquire from '@/components/sections/Enquire';
import Footer from '@/components/sections/Footer';
import Faq from '@/components/sections/Faq';
import StructuredData from '@/components/StructuredData';
import { PRODUCTS } from '@/content/products';
import { HOME_FAQS, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, absoluteUrl } from '@/lib/seo';

export default function Page() {
  const homeGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: 'SK ZIC South Africa | Motor Oil and Fluids',
        description: 'Explore the SK ZIC motor oil and transmission fluid range distributed in South Africa by Parts-Mall Africa.',
        isPartOf: { '@id': WEBSITE_ID },
        about: [{ '@type': 'Brand', name: 'SK ZIC', sameAs: 'https://www.skzic.com/eng/index.do' }, { '@id': ORGANIZATION_ID }],
        inLanguage: 'en-ZA',
      },
      {
        '@type': 'ItemList',
        name: 'SK ZIC South African product range',
        numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${product.name} ${product.grade}`,
          url: absoluteUrl(`/products/${product.id}`),
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: HOME_FAQS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <StructuredData data={homeGraph} />
      <Cursor />
      <Nav />
      <TrustBar />
      <FilmRail />
      <BackToTop />
      <main id="main">
        {/* Opening sequence: one becomes five, pinned and scrubbed */}
        <OpeningSequence />
        <Proof />
        <WhyZic />

        {/* Chapters 01-06 */}
        <Inside />
        <Yubase />
        <Vhvi />
        <Products />
        <Transmission />
        <Distribution />

        <Faq />

        <Enquire />
      </main>
      <Footer />
    </>
  );
}
