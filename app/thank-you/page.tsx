import Link from 'next/link';
import Footer from '@/components/sections/Footer';
import { SupportHeader } from '@/components/SupportPage';

export const metadata = {
  title: 'Thanks for your enquiry',
  // Not a page anyone should land on from a search result or a shared link —
  // it only means something as the destination of a real form submission.
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <>
      <SupportHeader />
      <main id="main" className="flex min-h-[80dvh] items-center pt-[var(--nav-height)]">
        <div className="shell py-20">
          <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>ENQUIRY / RECEIVED</p>
          <h1 className="t-display t-h2 mt-5 max-w-[900px]">Thanks — that&rsquo;s with us now.</h1>
          <p className="t-lead mt-7 max-w-[650px]" style={{ color: 'var(--color-deep-steel)' }}>
            We reply within one business day. In the meantime, feel free to keep browsing the range
            or check availability near you.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">Return home</Link>
            <Link href="/#products" className="btn btn-secondary">Browse the range</Link>
            <Link href="/#distribution" className="btn btn-secondary">Find a branch</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
