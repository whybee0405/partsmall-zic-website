import type { Metadata } from 'next';
import Link from 'next/link';
import Enquire from '@/components/sections/Enquire';
import Footer from '@/components/sections/Footer';
import { SupportHeader, pageMetadata } from '@/components/SupportPage';
import { BRANCH_FINDER } from '@/content/cta';

export const metadata: Metadata = pageMetadata(
  'Contact',
  'Contact Parts-Mall Africa about SK ZIC products, specifications, stock, branches and reseller enquiries.',
  '/contact',
);

export default function ContactPage() {
  return (
    <>
      <SupportHeader />
      <main id="main" className="pt-[var(--nav-height)]">
        <section className="py-20 md:py-28">
          <div className="shell grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>CONTACT / SOUTHERN AFRICA</p>
              <h1 className="t-display mt-7 text-[clamp(2.75rem,7vw,6.25rem)] leading-[0.94]">Start with the specification.</h1>
              <p className="t-lead mt-8 max-w-[720px]" style={{ color: 'var(--color-deep-steel)' }}>
                Tell us the vehicle, manufacturer requirement or product. Parts-Mall Africa will direct the enquiry to the right branch or representative.
              </p>
            </div>
            <div className="border-y py-6" style={{ borderColor: 'var(--color-hairline)' }}>
              <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>Direct email</p>
              <a className="mt-2 block underline underline-offset-4" href="mailto:pma.sales2@parts-mall.com">pma.sales2@parts-mall.com</a>
              <p className="t-label mt-6" style={{ color: 'var(--color-steel-text)' }}>Head office</p>
              <p className="mt-2 text-[0.9375rem]">901 Herman Street, PZR Business Park, Meadowdale, Germiston 1401</p>
              <Link href={BRANCH_FINDER.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block underline underline-offset-4">
                Find a Parts-Mall branch
              </Link>
            </div>
          </div>
        </section>
        <Enquire />
      </main>
      <Footer />
    </>
  );
}

