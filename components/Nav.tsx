'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
 * The wordmark is the actual SK ZIC logo lockup (public/brand): a light-ink
 * file for light chambers, a white-ink file for dark chambers. Only the
 * light-ink file carries a baked-in tagline, so the dark state renders the
 * mark alone.
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
      <nav className="shell flex h-[var(--nav-height)] items-center justify-between">
        <Link href="/" className="block leading-none" onClick={() => setOpen(false)}>
          <Image
            src={dark ? '/brand/zic-logo-on-dark.png' : '/brand/zic-logo-on-light.png'}
            alt="SK ZIC"
            width={800}
            height={220}
            priority
            className="h-9 w-auto lg:h-11"
          />
        </Link>

        <ul className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((l) => {
            const external = 'external' in l && l.external;
            const linkStyle = {
              color: dark ? 'var(--color-metal-grey)' : 'var(--color-deep-steel)',
              transition: 'color 320ms var(--ease-out)',
            };
            // The underline reads as a flow path filling in — a small echo of
            // the oil-flow motif, not just a generic hover state.
            const linkClassName =
              'group relative inline-block py-2 text-[0.875rem] font-medium';
            const underline = (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-x-100"
                style={{ background: 'var(--color-zic-red)' }}
              />
            );
            return (
              <li key={l.href}>
                {external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                    style={linkStyle}
                  >
                    {l.label}
                    {underline}
                  </a>
                ) : (
                  <Link href={l.href} className={linkClassName} style={linkStyle}>
                    {l.label}
                    {underline}
                  </Link>
                )}
              </li>
            );
          })}
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
          {NAV_LINKS.map((l) => {
            const external = 'external' in l && l.external;
            const itemStyle = { color: ink, borderTop: `1px solid ${line}` };
            const itemClassName = 't-display block py-4 text-[1.375rem] tracking-[-0.02em]';
            return (
              <li key={l.href}>
                {external ? (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className={itemClassName}
                    style={itemStyle}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={itemClassName}
                    style={itemStyle}
                  >
                    {l.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
