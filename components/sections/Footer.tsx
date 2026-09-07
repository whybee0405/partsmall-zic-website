import Image from 'next/image';
import Link from 'next/link';
import CookiePreferencesLink from '@/components/CookiePreferencesLink';
import { COMPANY } from '@/content/company';
import { PRODUCTS } from '@/content/products';
import { BRANCH_FINDER } from '@/content/cta';

const FOOTER_GROUPS = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Technology', href: '/#inside' },
      { label: 'Products', href: '/#products' },
      { label: 'Availability', href: '/#distribution' },
      { label: 'Enquire', href: '/#enquire' },
    ],
  },
  {
    title: 'Products',
    links: PRODUCTS.map((product) => ({ label: `${product.name} ${product.grade}`, href: `/products/${product.id}` })),
  },
  {
    title: 'Resources',
    links: [
      { label: 'Technical documents', href: '/resources' },
      { label: 'Find a branch', href: BRANCH_FINDER.href, external: true },
      { label: 'Contact Parts-Mall', href: '/contact' },
      { label: 'Become an agent', href: 'https://www.parts-mall.co.za/parts-mall-agent.asp', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Notice', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'PAIA Manual', href: '/paia' },
      { label: 'Cookie Notice', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
  },
] as const;

/** Same "flow path filling in" hover underline as the top nav (components/Nav.tsx) — one motion language. */
function HoverLine() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-x-100"
      style={{ background: 'var(--color-zic-red)' }}
    />
  );
}

export default function Footer() {
  return (
    <footer id="footer" className="chamber-dark py-16" style={{ background: 'var(--color-graphite)' }}>
      <div className="shell">
        <div className="grid gap-12 border-b pb-14 lg:grid-cols-[1.1fr_2.2fr] lg:gap-20" style={{ borderColor: 'var(--color-deep-steel)' }}>
          <div>
            <Image src="/brand/zic-logo-on-dark.png" alt="SK ZIC" width={800} height={220} className="h-10 w-auto" />
            <p className="mt-7 max-w-[360px] text-base" style={{ color: 'var(--color-metal-grey)' }}>
              SK ZIC motor oils and fluids, distributed across South Africa and Southern Africa by Parts-Mall Africa.
            </p>
            <p className="t-label mt-8" style={{ color: 'var(--color-steel-text)' }}>Head office</p>
            <p className="mt-2 max-w-[360px] text-base" style={{ color: 'var(--color-metal-grey)' }}>
              901 Herman Street, PZR Business Park, Meadowdale, Germiston 1401
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              className="group relative mt-3 flex min-h-[44px] w-fit items-center text-base"
              style={{ color: 'var(--color-eng-white)' }}
            >
              {COMPANY.email}
              <HoverLine />
            </a>
            <a
              href={COMPANY.phoneHref}
              className="group relative flex min-h-[44px] w-fit items-center text-base"
              style={{ color: 'var(--color-eng-white)' }}
            >
              {COMPANY.phone}
              <HoverLine />
            </a>
            <a
              href={COMPANY.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex min-h-[44px] w-fit items-center text-base"
              style={{ color: 'var(--color-eng-white)' }}
            >
              WhatsApp {COMPANY.whatsapp}
              <HoverLine />
            </a>
          </div>

          <nav aria-label="Footer sitemap" className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="t-label" style={{ color: 'var(--color-steel-text)' }}>{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((item) => (
                    <li key={item.href}>
                      {'external' in item && item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex min-h-[44px] w-fit items-center text-base leading-snug"
                          style={{ color: 'var(--color-eng-white)' }}
                        >
                          {item.label}
                          <HoverLine />
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="group relative flex min-h-[44px] w-fit items-center text-base leading-snug"
                          style={{ color: 'var(--color-eng-white)' }}
                        >
                          {item.label}
                          <HoverLine />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="t-mono mt-10 max-w-[920px] text-[0.5625rem] leading-[1.8]" style={{ color: 'var(--color-steel-text)' }}>
          Product specifications and OEM approvals are product-specific and are stated as published by SK Enmove. &ldquo;Approved by&rdquo; indicates formal OEM certification; &ldquo;meets or exceeds&rdquo; is a manufacturer declaration. Always follow the specification and service interval in your vehicle&apos;s owner manual. SK ZIC is a registered trademark of SK Enmove Co., Ltd.
        </p>

        <div className="mt-10 flex flex-col gap-3 border-t pt-7 text-[0.6875rem] sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: 'var(--color-deep-steel)', color: 'var(--color-steel-text)' }}>
          <p className="t-mono">© 2026 Parts-Mall Africa</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CookiePreferencesLink />
            <p>
              Developed by{' '}
              <a
                href="https://cloudia.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-block"
                style={{ color: 'var(--color-eng-white)' }}
              >
                CloudIA - Your Digital Growth Partner
                <HoverLine />
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
