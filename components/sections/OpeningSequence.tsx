'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from '@/lib/scroll';
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
 * and does not fight Lenis. ScrollTrigger only maps scroll onto the timeline.
 *
 * Two things that are easy to get wrong here:
 *
 * 1. Initial states are set with `gsap.set()` before the timeline is built, not
 *    with `fromTo` inside it. A `fromTo` positioned at 0.6 of a scrubbed
 *    timeline does not hold its "from" values at progress 0, so every product
 *    rendered in its final position on load.
 * 2. The collapse distance is measured in a `refreshInit` handler with the row
 *    reset to neutral. Measuring once at build time bakes in whatever transform
 *    happened to be applied, and the products drift on resize.
 *
 * Spec: docs/LANDING-PAGE-SPEC.md §3 sections 01-03.
 */

/**
 * Left to right. `h` is image height as a share of the stage; `arc` lifts the
 * line-up into a shallow rainbow, and `rot` fans each pack away from centre.
 */
const LINEUP = [
  { id: 'x5-10w30', h: 17, arc: 34, rot: -5, z: 3 },
  { id: 'x7-diesel-5w30', h: 23, arc: 12, rot: -2.5, z: 4 },
  { id: 'x7-5w30', h: 26, arc: 0, rot: 0, z: 6 },
  { id: 'x3000-15w40', h: 23, arc: 12, rot: 2.5, z: 4 },
  { id: 'atf-multi', h: 18, arc: 34, rot: 5, z: 3 },
] as const;

const CENTRE_INDEX = 2;
const MAX_H = 26; // vh, the centre pack
const CARBON = '#090b0e';
const ENG_WHITE = '#f7f7f5';

export default function OpeningSequence() {
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);

  const wrap = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLSpanElement>(null);
  const heroType = useRef<HTMLDivElement>(null);
  const heroFoot = useRef<HTMLDivElement>(null);
  const statement = useRef<HTMLDivElement>(null);
  const rangeHead = useRef<HTMLDivElement>(null);
  const splash = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Five packs across a 375px viewport leaves each one 60px wide with a
    // three-line caption. Below 768px the sequence becomes the stacked grid.
    const narrow = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      setReduced(motion.matches);
      setCompact(narrow.matches);
    };
    sync();
    motion.addEventListener('change', sync);
    narrow.addEventListener('change', sync);
    return () => {
      motion.removeEventListener('change', sync);
      narrow.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (reduced || compact || prefersReducedMotion() || !wrap.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('[data-cell]');
      const packs = gsap.utils.toArray<HTMLElement>('[data-pack]');
      const siblings = cells.filter((_, i) => i !== CENTRE_INDEX);
      const leaders = gsap.utils.toArray<HTMLElement>('[data-leader]');
      const callouts = gsap.utils.toArray<HTMLElement>('[data-callout]');

      /** Offset from each cell's centre to the centre pack's, measured neutral. */
      const offsets = new Map<HTMLElement, number>();
      const measure = () => {
        gsap.set(cells, { x: 0 });
        const centre = cells[CENTRE_INDEX];
        if (!centre) return;
        const c = centre.getBoundingClientRect();
        const cx = c.left + c.width / 2;
        for (const el of cells) {
          const r = el.getBoundingClientRect();
          offsets.set(el, cx - (r.left + r.width / 2));
        }
      };
      measure();
      ScrollTrigger.addEventListener('refreshInit', measure);

      // The rainbow. Applied to the pack inside each cell so the leader lines
      // and callouts stay on one straight line beneath the arc.
      packs.forEach((el, i) => {
        gsap.set(el, { y: LINEUP[i].arc, rotate: LINEUP[i].rot, transformOrigin: '50% 100%' });
      });

      // --- Resting state: only the centre pack exists, oversized and alone ---
      gsap.set(row.current, { scale: 1.42, y: '6%', transformOrigin: '50% 78%' });
      gsap.set(siblings, { x: (i, el) => offsets.get(el as HTMLElement) ?? 0, opacity: 0, scale: 0.9 });
      gsap.set([statement.current, rangeHead.current], { opacity: 0, y: 26 });
      gsap.set(splash.current, { opacity: 0, scale: 0.72 });
      gsap.set(leaders, { scaleY: 0, transformOrigin: '50% 0%' });
      gsap.set(callouts, { opacity: 0, y: 12 });

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

      // --- Act 1: the type gives way to the product -------------------------
      tl.to(heroType.current, { opacity: 0, y: -70, duration: 0.18 }, 0)
        .to(heroFoot.current, { opacity: 0, y: -30, duration: 0.18 }, 0)
        .to(ghost.current, { opacity: 0, y: -50, duration: 0.28 }, 0)
        .to(bg.current, { backgroundColor: CARBON, duration: 0.12 }, 0.16);

      // --- Act 2: the splash ------------------------------------------------
      tl.to(statement.current, { opacity: 1, y: 0, duration: 0.1 }, 0.24)
        .to(splash.current, { opacity: 1, scale: 1.12, duration: 0.24 }, 0.28)
        .to(statement.current, { opacity: 0, y: -28, duration: 0.09 }, 0.5)
        .to(splash.current, { opacity: 0.14, scale: 0.96, duration: 0.14 }, 0.54);

      // --- Act 3: one becomes five ------------------------------------------
      tl.to(rangeHead.current, { opacity: 1, y: 0, duration: 0.11 }, 0.56)
        .to(row.current, { scale: 1, y: '0%', duration: 0.22 }, 0.58)
        .to(
          siblings,
          { x: 0, opacity: 1, scale: 1, duration: 0.26, stagger: 0.035 },
          0.58
        )
        .to(leaders, { scaleY: 1, duration: 0.14, stagger: 0.03 }, 0.76)
        .to(callouts, { opacity: 1, y: 0, duration: 0.15, stagger: 0.03 }, 0.8);

      return () => ScrollTrigger.removeEventListener('refreshInit', measure);
    }, wrap);

    return () => ctx.revert();
  }, [reduced, compact]);

  if (reduced || compact) {
    return (
      <>
        <Hero />
        <Splash />
        <TheFive />
      </>
    );
  }

  return (
    <div ref={wrap} className="relative h-[320vh] lg:h-[380vh]">
      {/* Markers so the Film Rail and nav can resolve chamber boundaries. */}
      <span id="hero" className="absolute top-0" aria-hidden />
      <span id="splash" className="absolute top-[22%]" aria-hidden />
      <span id="range" className="absolute top-[58%]" aria-hidden />

      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div ref={bg} aria-hidden className="absolute inset-0" style={{ backgroundColor: ENG_WHITE }} />

        <span
          ref={ghost}
          aria-hidden
          className="t-display pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            fontSize: 'clamp(9rem, 30vw, 26rem)',
            color: CARBON,
            opacity: 0.05,
            lineHeight: 0.8,
          }}
        >
          ZIC
        </span>

        {/* Text zone. Three states cross-fade in one place, clear of the nav. */}
        <div className="shell absolute inset-x-0 top-[14%] z-30 flex flex-col items-center text-center">
          <div ref={heroType} className="flex flex-col items-center">
            <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
              SK ZIC · Distributed across Southern Africa by Parts-Mall Africa
            </p>
            <h1
              className="t-display mt-5"
              style={{ fontSize: 'clamp(2.25rem, 5.4vw, 4.75rem)', lineHeight: 0.94 }}
            >
              Performance
              <br />
              Starts Within.
            </h1>
            <p
              className="mt-5 text-[0.9375rem] leading-[1.6] md:text-[1.0625rem]"
              style={{ maxWidth: 540, color: 'var(--color-deep-steel)' }}
            >
              The world&rsquo;s number one Group III base oil, engineered into motor oil for South
              African conditions.
            </p>
          </div>

          <div ref={statement} className="absolute inset-x-0 top-0 flex flex-col items-center">
            <p className="t-stamp" style={{ color: 'var(--color-steel-text)' }}>
              The transition
            </p>
            <h2
              className="t-display mt-5"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4.25rem)',
                lineHeight: 0.98,
                color: ENG_WHITE,
              }}
            >
              One engineering standard.
            </h2>
            <p
              className="mt-5 text-[0.9375rem] leading-[1.6] md:text-[1.0625rem]"
              style={{ maxWidth: 560, color: 'var(--color-metal-grey)' }}
            >
              The same base oil, the same additive discipline, the same laboratory. What changes is
              the job it is asked to do.
            </p>
          </div>

          <div ref={rangeHead} className="absolute inset-x-0 top-0 flex flex-col items-center">
            <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
              The South African range · Five products · Seven pack sizes
            </p>
            <h2
              className="t-display mt-5"
              style={{
                fontSize: 'clamp(2.25rem, 5.4vw, 4.75rem)',
                lineHeight: 0.98,
                color: ENG_WHITE,
              }}
            >
              Five jobs.
            </h2>
            <p
              className="mt-5 text-[0.9375rem] leading-[1.6] md:text-[1.0625rem]"
              style={{ maxWidth: 720, color: 'var(--color-metal-grey)' }}
            >
              Everything Parts-Mall Africa actually holds, and nothing it does not.
            </p>
          </div>
        </div>

        {/* Splash, behind the packs, anchored to the same baseline. */}
        <div
          ref={splash}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
          style={{ bottom: '17%', width: 'min(88vw, 760px)' }}
        >
          <Image
            src="/plates/oil-crown-splash.png"
            alt=""
            width={1200}
            height={822}
            sizes="(max-width: 768px) 88vw, 760px"
            className="h-auto w-full"
          />
        </div>

        {/* The line-up. Renders in final layout; GSAP collapses it to centre. */}
        <ul
          ref={row}
          className="absolute inset-x-0 z-10 flex items-end justify-center gap-[1.5vw] md:gap-[2vw]"
          style={{ bottom: '9%' }}
        >
          {LINEUP.map((slot, i) => {
            const product = PRODUCTS.find((p) => p.id === slot.id);
            if (!product) return null;
            const isCentre = i === CENTRE_INDEX;

            return (
              <li
                key={product.id}
                data-cell
                className="flex w-[18.5%] min-w-0 flex-col items-center md:w-[15%] md:min-w-[118px]"
                style={{ zIndex: slot.z }}
              >
                {/* Fixed slot so the arc never shifts the callout line. */}
                <div
                  className="flex w-full items-end justify-center"
                  style={{ height: `${MAX_H}vh`, paddingBottom: 40 }}
                >
                  <div data-pack className="flex items-end">
                    <Image
                      src={product.image}
                      alt={`${product.name} ${product.grade}`}
                      width={620}
                      height={860}
                      priority={isCentre}
                      sizes="(max-width: 768px) 20vw, 15vw"
                      style={{ height: `${slot.h}vh`, width: 'auto' }}
                      className="w-auto object-contain"
                    />
                  </div>
                </div>

                <div
                  data-leader
                  aria-hidden
                  style={{
                    width: 1,
                    height: isCentre ? 30 : 22,
                    background: isCentre ? 'var(--color-zic-red)' : 'var(--color-deep-steel)',
                  }}
                />

                <div data-callout className="mt-3 w-full px-1 text-center">
                  <p
                    className="t-display text-[0.8125rem] font-semibold leading-tight tracking-[-0.02em] lg:text-[0.9375rem]"
                    style={{ color: ENG_WHITE }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.625rem] font-semibold tracking-[0.06em] lg:text-[0.6875rem]"
                    style={{ color: 'var(--color-zic-red)' }}
                  >
                    {product.grade}
                  </p>
                  <p
                    className="t-mono mt-1 hidden text-[0.5625rem] leading-[1.5] lg:block"
                    style={{ color: 'var(--color-metal-grey)' }}
                  >
                    {product.shortSpec ?? (product.specification.join(' · ') || product.oilType)}
                  </p>
                  <p
                    className="t-mono mt-1 hidden text-[0.5625rem] tracking-[0.08em] md:block lg:text-[0.625rem]"
                    style={{ color: 'var(--color-steel-text)' }}
                  >
                    {product.packSizes.join(' · ')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Hero footer: caption and CTAs, leaving with the hero type. */}
        <div ref={heroFoot} className="absolute inset-x-0 bottom-[5%] z-30 flex flex-col items-center">
          <p
            className="t-mono text-[0.6875rem] tracking-[0.1em]"
            style={{ color: 'var(--color-steel-text)' }}
          >
            ZIC X7 · 5W-30 · FULLY SYNTHETIC · 4 L
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
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
