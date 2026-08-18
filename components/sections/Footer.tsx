import Image from 'next/image';
import Link from 'next/link';
import { BRANCH_FINDER } from '@/content/cta';

/**
 * 12 — Footer.
 *
 * The legal band is not boilerplate. BRAND-DNA's claim taxonomy is a real
 * distinction with real consequences, so the page states it plainly rather than
 * letting a visitor assume every approval means the same thing.
 *
 * Design: docs/design-snapshots/sections/s12-footer.png
 */

const RESOURCES = [
  { label: 'Download TDS', href: '#' },
  { label: 'Download MSDS', href: '#' },
  { label: 'Find a branch', href: BRANCH_FINDER.href, external: true },
  { label: 'Become an agent', href: 'https://www.parts-mall.co.za/parts-mall-agent.asp', external: true },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="chamber-dark py-16"
      style={{ background: 'var(--color-graphite)' }}
    >
      <div className="shell stack-centre">
        <div className="w-full" style={{ height: 1, background: 'var(--color-deep-steel)' }} />

        <Image
          src="/brand/zic-logo-on-dark.png"
          alt="SK ZIC"
          width={800}
          height={220}
          className="mt-12 h-9 w-auto"
        />

        <ul className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3">
          {RESOURCES.map((r) => (
            <li key={r.label}>
              {r.external ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.9375rem]"
                  style={{ color: 'var(--color-eng-white)' }}
                >
                  {r.label}
                </a>
              ) : (
                <Link href={r.href} className="text-[0.9375rem]" style={{ color: 'var(--color-eng-white)' }}>
                  {r.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-10 w-[min(480px,100%)]" style={{ height: 1, background: 'var(--color-deep-steel)' }} />

        <p className="t-label mt-8" style={{ color: 'var(--color-steel-text)' }}>
          Distributed in Southern Africa by
        </p>
        <p
          className="t-display mt-2 text-[1.25rem] font-semibold tracking-[-0.02em]"
          style={{ color: 'var(--color-pure-white)' }}
        >
          PARTS-MALL AFRICA
        </p>
        <p className="mt-3 text-[0.8125rem]" style={{ color: 'var(--color-metal-grey)' }}>
          901 Herman Street, PZR Business Park, Meadowdale, Germiston 1401
          <span className="mx-2">·</span>
          <a href="mailto:pma.sales2@parts-mall.com" className="underline underline-offset-2">
            pma.sales2@parts-mall.com
          </a>
        </p>

        <div className="mt-12 w-full" style={{ height: 1, background: 'var(--color-deep-steel)' }} />

        <p
          className="t-mono mt-8 text-[0.5625rem] leading-[1.8]"
          style={{ maxWidth: 920, color: 'var(--color-steel-text)' }}
        >
          Product specifications and OEM approvals are product-specific and are stated as published
          by SK Enmove. &ldquo;Approved by&rdquo; indicates formal OEM certification; &ldquo;meets or
          exceeds&rdquo; is a manufacturer declaration. Always follow the specification and service
          interval in your vehicle&rsquo;s owner&rsquo;s manual. SK ZIC is a registered trademark of
          SK Enmove Co., Ltd.
        </p>

        <p className="t-label mt-6" style={{ color: 'var(--color-steel-text)' }}>
          © 2026 Parts-Mall Africa
        </p>
      </div>
    </footer>
  );
}
