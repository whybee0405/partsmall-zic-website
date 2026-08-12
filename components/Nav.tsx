'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS } from '@/content/sections';
import { PRIMARY_CTA } from '@/content/cta';

/**
 * Fixed nav. Transparent over the hero, resolving to Engineering White after
 * 80px. Opacity and backdrop only, never a height animation.
 *
 * The slogan is locked beneath the wordmark so "Dynamics in Flow" travels with
 * the mark and is never replaced by campaign copy (BRAND-DNA §1).
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: solid ? 'color-mix(in oklab, var(--color-eng-white) 92%, transparent)' : 'transparent',
        backdropFilter: solid ? 'blur(8px)' : 'none',
        borderBottom: solid ? '1px solid var(--color-hairline)' : '1px solid transparent',
        transition: 'background 260ms var(--ease-out), border-color 260ms var(--ease-out)',
      }}
    >
      <nav className="shell flex h-[72px] items-center justify-between">
        <Link href="#hero" className="leading-none">
          <span
            className="t-display block text-[1.375rem] tracking-[-0.04em] lg:text-[1.625rem]"
            style={{ color: 'var(--color-carbon)' }}
          >
            SK ZIC
          </span>
          <span
            className="t-mono mt-1 block text-[0.5625rem] tracking-[0.2em]"
            style={{ color: 'var(--color-steel-text)' }}
          >
            DYNAMICS IN FLOW
          </span>
        </Link>

        <ul className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[0.875rem] font-medium"
                style={{ color: 'var(--color-deep-steel)' }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={PRIMARY_CTA.href}
          className="btn btn-primary !min-h-[44px] !px-5 text-[0.9375rem]"
        >
          {PRIMARY_CTA.label}
        </Link>
      </nav>
    </header>
  );
}
