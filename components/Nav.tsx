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
 *
 * Below `lg` the link list collapses into a hamburger-triggered sheet: the
 * product table is 9.8 screens down on a phone and the nav is otherwise the
 * only way to jump straight to it.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

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

  // Close on Escape, and don't leave the page scrollable-behind-the-sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  const surface = dark ? 'var(--color-carbon)' : 'var(--color-eng-white)';
  const ink = dark ? 'var(--color-eng-white)' : 'var(--color-carbon)';
  const inkMuted = dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)';
  const line = dark ? 'var(--color-deep-steel)' : 'var(--color-hairline)';

  return (
    <header
      className="fixed inset-x-0 top-0 z-40"
      style={{
        background: solid || open ? `color-mix(in oklab, ${surface} 92%, transparent)` : 'transparent',
        backdropFilter: solid || open ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${solid || open ? line : 'transparent'}`,
        transition:
          'background 320ms var(--ease-out), border-color 320ms var(--ease-out), color 320ms var(--ease-out)',
      }}
    >
      <nav className="shell flex h-[72px] items-center justify-between">
        <Link href="#hero" className="leading-none" onClick={() => setOpen(false)}>
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

        <div className="flex items-center gap-3">
          <Link
            href={PRIMARY_CTA.href}
            className="btn btn-primary !min-h-[44px] !px-5 text-[0.9375rem]"
            onClick={() => setOpen(false)}
          >
            {PRIMARY_CTA.label}
          </Link>

          {/* Hamburger trigger, lg and below only. */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav-sheet"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              aria-hidden
              className="block h-[2px] w-6"
              style={{
                background: ink,
                transition: 'transform 220ms var(--ease-out), opacity 220ms var(--ease-out)',
                transform: open ? 'translateY(3.5px) rotate(45deg)' : 'none',
              }}
            />
            <span
              aria-hidden
              className="block h-[2px] w-6"
              style={{
                background: ink,
                transition: 'transform 220ms var(--ease-out), opacity 220ms var(--ease-out)',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              aria-hidden
              className="block h-[2px] w-6"
              style={{
                background: ink,
                transition: 'transform 220ms var(--ease-out), opacity 220ms var(--ease-out)',
                transform: open ? 'translateY(-3.5px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile sheet. Below `lg` only — the same breakpoint the inline list
          disappears at, so there is never a moment with neither. */}
      <div
        id="mobile-nav-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        inert={!open}
        className="overflow-hidden lg:hidden"
        style={{
          background: `color-mix(in oklab, ${surface} 97%, transparent)`,
          backdropFilter: 'blur(10px)',
          borderBottom: open ? `1px solid ${line}` : 'none',
          maxHeight: open ? 400 : 0,
          transition: 'max-height 280ms var(--ease-out), border-color 280ms var(--ease-out)',
        }}
      >
        <ul className="shell flex flex-col py-2">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="t-display block py-4 text-[1.375rem] tracking-[-0.02em]"
                style={{ color: ink, borderTop: `1px solid ${line}` }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
