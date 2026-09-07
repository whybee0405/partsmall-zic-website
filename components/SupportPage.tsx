import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import Footer from '@/components/sections/Footer';
import { COMPANY } from '@/content/company';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/seo';

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = path === '/' ? '/' : path;
  return {
    title,
    description,
    alternates: { canonical, languages: { 'en-ZA': canonical } },
    openGraph: {
      title: `${title} | SK ZIC South Africa`,
      description,
      url: canonical,
      type: 'website',
      locale: 'en_ZA',
      images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1200, height: 630, alt: 'SK ZIC South Africa' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SK ZIC South Africa`,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}

export function SupportHeader() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b"
      style={{
        background: 'color-mix(in oklab, var(--color-eng-white) 94%, transparent)',
        borderColor: 'var(--color-hairline)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <nav className="shell flex h-[var(--nav-height)] items-center justify-between" aria-label="Supporting pages">
        <Link href="/" className="flex items-center py-2" aria-label="SK ZIC South Africa home">
          <Image
            src="/brand/zic-logo-on-light.png"
            alt="SK ZIC"
            width={800}
            height={220}
            priority
            className="h-9 w-auto lg:h-11"
          />
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/#products"
            className="hidden text-base font-medium sm:inline"
            style={{ color: 'var(--color-deep-steel)' }}
          >
            Products
          </Link>
          <Link href="/#enquire" className="btn btn-primary !min-h-[44px] !px-4 sm:!px-5">
            Enquire Now
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SupportPage({
  stamp,
  title,
  intro,
  updated,
  children,
}: {
  stamp: string;
  title: string;
  intro: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SupportHeader />
      <main id="main" className="support-page pt-[var(--nav-height)]">
        <header className="shell py-20 md:py-28">
          <div className="max-w-[980px]">
            <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
              {stamp}
            </p>
            <h1 className="t-display mt-7 text-[clamp(2.75rem,7vw,6.25rem)] leading-[0.94]">{title}</h1>
            <p
              className="t-lead mt-8 max-w-[760px]"
              style={{ color: 'var(--color-deep-steel)' }}
            >
              {intro}
            </p>
            {updated && (
              <p className="t-mono mt-8 text-[0.6875rem]" style={{ color: 'var(--color-steel-text)' }}>
                LAST UPDATED / {updated}
              </p>
            )}
          </div>
        </header>
        <div style={{ borderTop: '1px solid var(--color-hairline)' }}>{children}</div>
      </main>
      <Footer />
    </>
  );
}

export function ContentSection({
  number,
  title,
  children,
  dark = false,
}: {
  number: string;
  title: string;
  children: ReactNode;
  dark?: boolean;
}) {
  const text = dark ? 'var(--color-eng-white)' : 'var(--color-carbon)';
  const muted = dark ? 'var(--color-metal-grey)' : 'var(--color-deep-steel)';
  return (
    <section
      className={dark ? 'chamber-dark py-16 md:py-20' : 'py-16 md:py-20'}
      style={{ background: dark ? 'var(--color-carbon)' : 'var(--color-eng-white)', color: text }}
    >
      <div className="shell grid gap-8 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-16">
        <p className="t-stamp" style={{ color: dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)' }}>
          {number}
        </p>
        <div className="support-copy" style={{ color: muted }}>
          <h2 className="t-display t-h3 mb-6" style={{ color: text }}>
            {title}
          </h2>
          {children}
        </div>
      </div>
    </section>
  );
}

export function ContactBlock({ title = 'Contact Parts-Mall Africa' }: { title?: string }) {
  return (
    <div className="mt-8 grid gap-6 border-y py-6 sm:grid-cols-3" style={{ borderColor: 'var(--color-hairline)' }}>
      <div>
        <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>Email</p>
        <a
          className="mt-2 inline-flex min-h-[44px] items-center underline underline-offset-4"
          href={`mailto:${COMPANY.email}`}
        >
          {COMPANY.email}
        </a>
      </div>
      <div>
        <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>Call or WhatsApp</p>
        <a className="mt-2 flex min-h-[44px] items-center underline underline-offset-4" href={COMPANY.phoneHref}>
          {COMPANY.phone}
        </a>
        <a
          className="flex min-h-[44px] items-center underline underline-offset-4"
          href={COMPANY.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp {COMPANY.whatsapp}
        </a>
      </div>
      <div>
        <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>{title}</p>
        <p className="mt-2">901 Herman Street, PZR Business Park, Meadowdale, Germiston 1401</p>
      </div>
    </div>
  );
}
