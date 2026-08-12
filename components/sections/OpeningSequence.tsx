'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/scroll';
import { PRODUCTS } from '@/content/products';
import { PRIMARY_CTA, SECONDARY_CTA } from '@/content/cta';
import { Cta } from '@/components/ui';
import Hero from '@/components/sections/Hero';
import Splash from '@/components/sections/Splash';
import TheFive from '@/components/sections/TheFive';

/**
 * Sections 01-03 as one pinned, scrubbed sequence: one becomes five.
 *
 * The stage is pinned with CSS `position: sticky` rather than ScrollTrigger's
 * `pin: true`. Sticky needs no pin-spacer, causes no layout shift on refresh,
 * and does not fight Lenis. ScrollTrigger's only job here is to map scroll
 * progress onto the timeline.
 *
 * Scroll distance comes from the wrapper height, so mobile shortens the whole
 * sequence by shortening one class rather than by branching the timeline.
 *
 * Under prefers-reduced-motion this renders the three sections stacked and
 * resolved instead, which is the same content without the choreography.
 *
 * Spec: docs/LANDING-PAGE-SPEC.md §3 sections 01-03.
 */

/** Left to right. Height is a share of the stage, following real pack scale. */
const LINEUP = [
  { id: 'x5-10w30', vh: 19 },
  { id: 'x7-diesel-5w30', vh: 26 },
  { id: 'x7-5w30', vh: 30 },
  { id: 'x3000-15w40', vh: 26 },
  { id: 'atf-multi', vh: 20 },
] as const;

const CENTRE_INDEX = 2;
const CARBON = '#090b0e';
const ENG_WHITE = '#f7f7f5';

export default function OpeningSequence() {
  const [reduced, setReduced] = useState(false);

  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLSpanElement>(null);
  const heroType = useRef<HTMLDivElement>(null);
  const heroFoot = useRef<HTMLDivElement>(null);
  const statement = useRef<HTMLDivElement>(null);
  const rangeHead = useRef<HTMLDivElement>(null);
  const splash = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduced || prefersReducedMotion()) return;
    if (!wrap.current || !row.current) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-lineup-item]');
      const centre = items[CENTRE_INDEX];
      const siblings = items.filter((_, i) => i !== CENTRE_INDEX);
      const leaders = gsap.utils.toArray<HTMLElement>('[data-leader]');
      const callouts = gsap.utils.toArray<HTMLElement>('[data-callout]');

      /** Horizontal distance from an item's centre to the centre product's. */
      const collapseX = (el: HTMLElement) => {
        if (!centre) return 0;
        const c = centre.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return c.left + c.width / 2 - (r.left + r.width / 2);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });

      // --- Act 1: parallax drift, the type gives way to the product ---------
      tl.to(heroType.current, { opacity: 0, y: -90, duration: 0.2 }, 0)
        .to(heroFoot.current, { opacity: 0, y: -40, duration: 0.22 }, 0)
        .to(ghost.current, { opacity: 0, y: -60, duration: 0.3 }, 0)
        .to(bg.current, { backgroundColor: CARBON, duration: 0.12 }, 0.18);

      // --- Act 2: the splash ------------------------------------------------
      tl.fromTo(
        statement.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.1 },
        0.26
      )
        .fromTo(
          splash.current,
          { opacity: 0, scale: 0.72 },
          { opacity: 1, scale: 1.12, duration: 0.25 },
          0.3
        )
        .to(statement.current, { opacity: 0, y: -30, duration: 0.1 }, 0.52)
        .to(splash.current, { opacity: 0.22, scale: 1, duration: 0.15 }, 0.55);

      // --- Act 3: one becomes five -----------------------------------------
      tl.fromTo(
        rangeHead.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.12 },
        0.58
      )
        .to(row.current, { scale: 1, y: 0, duration: 0.2 }, 0.6)
        .fromTo(
          siblings,
          { x: (i, el) => collapseX(el as HTMLElement), opacity: 0 },
          { x: 0, opacity: 1, duration: 0.26, stagger: 0.035 },
          0.6
        )
        .fromTo(
          leaders,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.16, stagger: 0.03 },
          0.74
        )
        .fromTo(
          callouts,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.16, stagger: 0.03 },
          0.78
        );

      // The product group starts oversized and alone, then settles into the row.
      gsap.set(row.current, { scale: 1.28, y: '4%', transformOrigin: '50% 100%' });
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <>
        <Hero />
        <Splash />
        <TheFive />
      </>
    );
  }

  return (
    <div ref={wrap} className="relative h-[220vh] md:h-[300vh] lg:h-[360vh]">
      {/* Markers so the Film Rail can still resolve chamber boundaries. */}
      <span id="hero" className="absolute top-0" aria-hidden />
      <span id="splash" className="absolute top-[38%]" aria-hidden />
      <span id="range" className="absolute top-[62%]" aria-hidden />

      <div
        ref={stage}
        className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden"
      >
        <div
          ref={bg}
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: ENG_WHITE }}
        />

        {/* Ghost wordmark */}
        <span
          ref={ghost}
          aria-hidden
          className="t-display pointer-events-none absolute select-none"
          style={{
            fontSize: 'clamp(11rem, 34vw, 32rem)',
            color: CARBON,
            opacity: 0.05,
            lineHeight: 0.8,
          }}
        >
          ZIC
        </span>

        {/* Text zone. Three states cross-fade in the same place. */}
        <div className="shell absolute inset-x-0 top-[9%] z-20 flex flex-col items-center text-center">
          <div ref={heroType} className="flex flex-col items-center">
            <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
              SK ZIC · Distributed across Southern Africa by Parts-Mall Africa
            </p>
            <h1 className="t-display t-h1 mt-5">
              Performance
              <br />
              Starts Within.
            </h1>
            <p
              className="t-lead mt-6"
              style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-deep-steel)' }}
            >
              The world&rsquo;s number one Group III base oil, engineered into motor oil for South
              African conditions.
            </p>
          </div>

          <div ref={statement} className="absolute inset-x-0 top-0 flex flex-col items-center opacity-0">
            <p className="t-stamp" style={{ color: 'var(--color-steel-text)' }}>
              The transition
            </p>
            <h2 className="t-display t-h2 mt-5" style={{ color: ENG_WHITE }}>
              One engineering standard.
            </h2>
            <p
              className="t-lead mt-6"
              style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-metal-grey)' }}
            >
              The same base oil, the same additive discipline, the same laboratory. What changes is
              the job it is asked to do.
            </p>
          </div>

          <div ref={rangeHead} className="absolute inset-x-0 top-0 flex flex-col items-center opacity-0">
            <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
              The South African range · Five products · Seven pack sizes
            </p>
            <h2 className="t-display t-h2 mt-5" style={{ color: ENG_WHITE }}>
              Five jobs.
            </h2>
            <p
              className="t-lead mt-6"
              style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-metal-grey)' }}
            >
              Everything Parts-Mall Africa actually holds, and nothing it does not.
            </p>
          </div>
        </div>

        {/* Splash sits behind the products, anchored to the same baseline. */}
        <div
          ref={splash}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 opacity-0"
          style={{ bottom: '18%', width: 'min(90vw, 820px)' }}
        >
          <Image
            src="/plates/oil-crown-splash.png"
            alt=""
            width={1200}
            height={822}
            sizes="(max-width: 768px) 90vw, 820px"
            className="h-auto w-full"
          />
        </div>

        {/* The line-up. Renders in final layout; GSAP collapses it to centre. */}
        <ul
          ref={row}
          className="absolute inset-x-0 z-10 flex items-end justify-center gap-[3vw]"
          style={{ bottom: '30%' }}
        >
          {LINEUP.map((slot, i) => {
            const product = PRODUCTS.find((p) => p.id === slot.id);
            if (!product) return null;
            const isCentre = i === CENTRE_INDEX;

            return (
              <li key={product.id} className="flex flex-col items-center">
                <div data-lineup-item style={{ height: `${slot.vh}vh` }} className="flex items-end">
                  <Image
                    src={product.image}
                    alt={`${product.name} ${product.grade}`}
                    width={620}
                    height={860}
                    priority={isCentre}
                    sizes="(max-width: 768px) 22vw, 16vw"
                    style={{ height: `${slot.vh}vh`, width: 'auto' }}
                    className="w-auto object-contain"
                  />
                </div>

                <div
                  data-leader
                  aria-hidden
                  className="mt-3 origin-top"
                  style={{
                    width: 1,
                    height: isCentre ? 34 : 24,
                    background: isCentre ? 'var(--color-zic-red)' : 'var(--color-deep-steel)',
                  }}
                />

                <div data-callout className="mt-3 text-center opacity-0">
                  <p
                    className="t-display text-[0.9375rem] font-semibold tracking-[-0.02em] lg:text-[1.0625rem]"
                    style={{ color: ENG_WHITE }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.6875rem] font-semibold tracking-[0.06em]"
                    style={{ color: 'var(--color-zic-red)' }}
                  >
                    {product.grade}
                  </p>
                  <p
                    className="t-mono mt-1 hidden text-[0.625rem] leading-[1.5] lg:block"
                    style={{ color: 'var(--color-metal-grey)' }}
                  >
                    {product.specification.join(' · ') || product.oilType}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.625rem] tracking-[0.08em]"
                    style={{ color: 'var(--color-steel-text)' }}
                  >
                    {product.packSizes.join(' · ')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Hero footer: caption and CTAs, fading with the hero type. */}
        <div
          ref={heroFoot}
          className="absolute inset-x-0 bottom-[8%] z-20 flex flex-col items-center"
        >
          <p
            className="t-mono text-[0.6875rem] tracking-[0.1em]"
            style={{ color: 'var(--color-steel-text)' }}
          >
            ZIC X7 · 5W-30 · FULLY SYNTHETIC · 4 L
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Cta href={PRIMARY_CTA.href} external={PRIMARY_CTA.external}>
              {PRIMARY_CTA.label}
            </Cta>
            <Cta href={SECONDARY_CTA.href} variant="secondary">
              {SECONDARY_CTA.label}
            </Cta>
          </div>
        </div>
      </div>
    </div>
  );
}
