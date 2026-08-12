'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS, SECTIONS } from '@/content/sections';
import { PRIMARY_CTA } from '@/content/cta';

/**
 * Fixed nav.
 *
 * Transparent over the hero, then resolving to a solid bar. It inverts over the
 * dark chambers: a light bar sitting on Carbon Black is the single most visible
 * way to break the illusion that the page is one continuous surface.
 *
 * The slogan is locked beneath the wordmark so "Dynamics in Flow" travels with
 * the mark and is never replaced by campaign copy (BRAND-DNA §1).
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);

    const read = () => {
      const y = window.scrollY;
      setSolid(y > 80);

      // Which chamber is under the nav bar itself, not the viewport centre.
      let current = SECTIONS[0];
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 84) current = SECTIONS[i];
      }
      setDark(current.dark);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const surface = dark ? 'var(--color-carbon)' : 'var(--color-eng-white)';
  const ink = dark ? 'var(--color-eng-white)' : 'var(--color-carbon)';
  const inkMuted = dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)';
  const line = dark ? 'var(--color-deep-steel)' : 'var(--color-hairline)';

  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: solid ? `color-mix(in oklab, ${surface} 92%, transparent)` : 'transparent',
        backdropFilter: solid ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${solid ? line : 'transparent'}`,
        transition:
          'background 320ms var(--ease-out), border-color 320ms var(--ease-out), color 320ms var(--ease-out)',
      }}
    >
      <nav className="shell flex h-[72px] items-center justify-between">
        <Link href="#hero" className="leading-none">
          <span
            className="t-display block text-[1.375rem] tracking-[-0.04em] lg:text-[1.625rem]"
            style={{ color: ink, transition: 'color 320ms var(--ease-out)' }}
          >
            SK ZIC
          </span>
          <span
            className="t-mono mt-1 block text-[0.5625rem] tracking-[0.2em]"
            style={{ color: inkMuted, transition: 'color 320ms var(--ease-out)' }}
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
                style={{
                  color: dark ? 'var(--color-metal-grey)' : 'var(--color-deep-steel)',
                  transition: 'color 320ms var(--ease-out)',
                }}
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
