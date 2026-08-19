import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/sections/Footer';
import { SupportHeader } from '@/components/SupportPage';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SupportHeader />
      <main id="main" className="flex min-h-[80dvh] items-center pt-[var(--nav-height)]">
        <div className="shell py-20">
          <p className="t-mono text-[clamp(4rem,16vw,12rem)] font-semibold leading-none" style={{ color: 'var(--color-hairline)' }}>404</p>
          <p className="t-stamp mt-6" style={{ color: 'var(--color-zic-red)' }}>ROUTE / NOT FOUND</p>
          <h1 className="t-display t-h2 mt-5 max-w-[900px]">This path does not match the specification.</h1>
          <p className="t-lead mt-7 max-w-[650px]" style={{ color: 'var(--color-deep-steel)' }}>
            The address may have changed, or the page may no longer be available. Choose a known route below.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary">Return home</Link>
            <Link href="/#products" className="btn btn-secondary">Find your ZIC</Link>
            <Link href="/contact" className="btn btn-secondary">Contact us</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
