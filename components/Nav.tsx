'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NAV_LINKS, SECTIONS } from '@/content/sections';
import { PRIMARY_CTA } from '@/content/cta';
import { PRODUCTS } from '@/content/products';

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
  const [productShelfOpen, setProductShelfOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

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

  // Close either navigation layer on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setProductShelfOpen(false);
        setMobileProductsOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Don't leave the page scrollable behind the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
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

        <ul className="hidden items-center gap-6 lg:flex xl:gap-10">
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

            if (l.label === 'Products') {
              return (
                <li
                  key={l.href}
                  className="nav-products group/products"
                  onMouseEnter={() => setProductShelfOpen(true)}
                  onMouseLeave={() => setProductShelfOpen(false)}
                  onFocusCapture={() => setProductShelfOpen(true)}
                  onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setProductShelfOpen(false);
                    }
                  }}
                >
                  <Link
                    href={l.href}
                    className={`${linkClassName} inline-flex items-center gap-1.5`}
                    style={linkStyle}
                    aria-haspopup="true"
                    aria-expanded={productShelfOpen}
                  >
                    {l.label}
                    <span
                      aria-hidden
                      className="t-mono text-[0.625rem]"
                      style={{
                        transform: productShelfOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 180ms var(--ease-out)',
                      }}
                    >
                      ↓
                    </span>
                    {underline}
                  </Link>

                  <div
                    className="product-shelf fixed inset-x-0 top-[var(--nav-height)] border-y"
                    data-open={productShelfOpen}
                    data-product-shelf
                    style={{
                      background: `color-mix(in oklab, ${surface} 98%, transparent)`,
                      borderColor: line,
                    }}
                  >
                    <div className="shell py-5">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="t-label" style={{ color: dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)' }}>
                          South African range / 05 products
                        </p>
                        <Link
                          href="#products"
                          onClick={() => setProductShelfOpen(false)}
                          className="text-[0.75rem] underline underline-offset-4"
                          style={{ color: ink }}
                        >
                          Compare the range
                        </Link>
                      </div>
                      <ul className="grid grid-cols-5" style={{ borderBlock: `1px solid ${line}` }}>
                        {PRODUCTS.map((product, index) => (
                          <li key={product.id} style={{ borderLeft: index === 0 ? undefined : `1px solid ${line}` }}>
                            <Link
                              href={`/products/${product.id}`}
                              onClick={() => setProductShelfOpen(false)}
                              className="group/product flex min-h-[116px] items-center gap-3 px-3 py-4 xl:px-5"
                            >
                              <span
                                className="relative h-[82px] w-[52px] shrink-0 overflow-hidden rounded-[4px]"
                                style={{ background: 'var(--color-fluid-grey)' }}
                              >
                                <Image
                                  src={product.image}
                                  alt=""
                                  fill
                                  sizes="52px"
                                  className="object-contain p-1"
                                />
                              </span>
                              <span>
                                <span className="t-label block" style={{ color: 'var(--color-zic-red)' }}>
                                  {product.family}
                                </span>
                                <span className="t-display mt-1 block text-[0.9375rem] font-semibold leading-tight tracking-[-0.02em]" style={{ color: ink }}>
                                  {product.name}
                                </span>
                                <span className="t-mono mt-1 block text-[0.6875rem]" style={{ color: dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)' }}>
                                  {product.grade}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            }

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
            onClick={() => {
              setOpen((value) => {
                if (value) setMobileProductsOpen(false);
                return !value;
              });
            }}
            className="relative h-11 w-11 shrink-0 lg:hidden"
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 block h-[2px] w-6"
              style={{
                background: ink,
                transition: 'transform 220ms var(--ease-out), opacity 220ms var(--ease-out)',
                transform: open
                  ? 'translate(-50%, -50%) rotate(45deg)'
                  : 'translate(-50%, calc(-50% - 7px))',
              }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 block h-[2px] w-6"
              style={{
                background: ink,
                transition: 'transform 220ms var(--ease-out), opacity 220ms var(--ease-out)',
                transform: 'translate(-50%, -50%)',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 block h-[2px] w-6"
              style={{
                background: ink,
                transition: 'transform 220ms var(--ease-out), opacity 220ms var(--ease-out)',
                transform: open
                  ? 'translate(-50%, -50%) rotate(-45deg)'
                  : 'translate(-50%, calc(-50% + 7px))',
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
        className="lg:hidden"
        style={{
          background: `color-mix(in oklab, ${surface} 97%, transparent)`,
          backdropFilter: 'blur(10px)',
          borderBottom: open ? `1px solid ${line}` : 'none',
          maxHeight: open ? 'calc(100dvh - var(--nav-height))' : 0,
          overflowY: open ? 'auto' : 'hidden',
          transition: 'max-height 280ms var(--ease-out), border-color 280ms var(--ease-out)',
        }}
      >
        <ul className="shell flex flex-col py-2">
          {NAV_LINKS.map((l) => {
            const external = 'external' in l && l.external;
            const itemStyle = { color: ink, borderTop: `1px solid ${line}` };
            const itemClassName = 't-display block py-4 text-[1.375rem] tracking-[-0.02em]';

            if (l.label === 'Products') {
              return (
                <li key={l.href} style={{ borderTop: `1px solid ${line}` }}>
                  <button
                    type="button"
                    aria-expanded={mobileProductsOpen}
                    onClick={() => setMobileProductsOpen((value) => !value)}
                    className="t-display flex w-full items-center justify-between py-4 text-left text-[1.375rem] tracking-[-0.02em]"
                    style={{ color: ink }}
                  >
                    Products
                    <span
                      aria-hidden
                      className="t-mono text-[1rem]"
                      style={{
                        transform: mobileProductsOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 180ms var(--ease-out)',
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: mobileProductsOpen ? '1fr' : '0fr',
                      opacity: mobileProductsOpen ? 1 : 0,
                      transition: 'grid-template-rows 240ms var(--ease-out), opacity 180ms ease',
                    }}
                  >
                    <div className="overflow-hidden">
                      <ul className="pb-4">
                        <li>
                          <Link
                            href="#products"
                            onClick={() => {
                              setOpen(false);
                              setMobileProductsOpen(false);
                            }}
                            className="t-mono block py-2 text-[0.75rem]"
                            style={{ color: 'var(--color-zic-red)' }}
                          >
                            Compare the range
                          </Link>
                        </li>
                        {PRODUCTS.map((product) => (
                          <li key={product.id}>
                            <Link
                              href={`/products/${product.id}`}
                              onClick={() => {
                                setOpen(false);
                                setMobileProductsOpen(false);
                              }}
                              className="flex items-baseline justify-between gap-4 py-2 text-[0.9375rem]"
                              style={{ color: ink }}
                            >
                              <span>{product.name}</span>
                              <span className="t-mono text-[0.6875rem]" style={{ color: dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)' }}>
                                {product.grade}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            }

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
