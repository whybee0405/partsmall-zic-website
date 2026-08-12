'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from '@/lib/scroll';
import { PRODUCTS } from '@/content/products';
import { PRIMARY_CTA, SECONDARY_CTA } from '@/content/cta';
import { Cta } from '@/components/ui';
import Hero from '@/components/sections/Hero';
import TheFive from '@/components/sections/TheFive';

/**
 * Sections 01-03: one becomes five.
 *
 * The stage is pinned with CSS `position: sticky` rather than ScrollTrigger's
 * `pin: true`. Sticky needs no pin-spacer, causes no layout shift on refresh,
 * and does not fight Lenis. ScrollTrigger only maps scroll onto the timeline.
 *
 * All three acts run at every width. Phones get their own pack metrics rather
 * than a different sequence: five packs at desktop scale would be 99px wide
 * each on a 393px viewport, so `mh` and `marc` size the line-up to the space
 * actually available. Only `prefers-reduced-motion` gets a different structure.
 *
 * Two GSAP traps worth knowing:
 *
 * 1. Initial states are set with `gsap.set()` before the timeline is built, not
 *    with `fromTo` inside it. A `fromTo` positioned at 0.6 of a scrubbed
 *    timeline does not hold its "from" values at progress 0, so every product
 *    rendered in its final position on load.
 * 2. Travel distances are viewport-relative pixels through function values, not
 *    percentages. GSAP resolves a percentage `y` against the element's own
 *    height, and the row is only as tall as the pack, so `y: '7%'` moved the
 *    canister nine pixels and it read as a static image.
 *
 * Spec: docs/LANDING-PAGE-SPEC.md §3 sections 01-03.
 */

/**
 * Left to right.
 *
 * `h` / `arc` are the wide-viewport metrics, `mh` / `marc` the phone ones.
 * Heights are a share of the stage; `arc` lifts the line-up into a shallow
 * rainbow and `rot` fans each pack away from centre.
 *
 * Phone heights are constrained by width, not height: at 393px each cell gets
 * about 70px, and a jerrycan is 0.72 as wide as it is tall.
 */
const LINEUP = [
  { id: 'x5-10w30', h: 17, arc: 34, rot: -5, z: 3, mh: 9, marc: 20 },
  { id: 'x7-diesel-5w30', h: 23, arc: 12, rot: -2.5, z: 4, mh: 12, marc: 7 },
  { id: 'x7-5w30', h: 26, arc: 0, rot: 0, z: 6, mh: 13.5, marc: 0 },
  { id: 'x3000-15w40', h: 23, arc: 12, rot: 2.5, z: 4, mh: 12, marc: 7 },
  { id: 'atf-multi', h: 18, arc: 34, rot: 5, z: 3, mh: 10, marc: 20 },
] as const;

const CENTRE_INDEX = 2;
const MAX_H = 26; // vh, the centre pack, wide
const MAX_H_COMPACT = 13.5; // vh, the centre pack, phone
const CARBON = '#090b0e';
const ENG_WHITE = '#f7f7f5';

export default function OpeningSequence() {
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [ready, setReady] = useState(false);

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
    const narrow = window.matchMedia('(max-width: 767px)');
    const sync = () => {
      setReduced(motion.matches);
      setCompact(narrow.matches);
      setReady(true);
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
    if (!ready || reduced || prefersReducedMotion() || !wrap.current) return;
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
      // and callouts stay on one straight line beneath the curve.
      packs.forEach((el, i) => {
        gsap.set(el, {
          y: compact ? LINEUP[i].marc : LINEUP[i].arc,
          rotate: LINEUP[i].rot,
          transformOrigin: '50% 100%',
        });
      });

      // Travel is viewport-relative pixels, resolved at refresh.
      const vh = () => window.innerHeight;
      const restY = () => (compact ? vh() * 0.1 : vh() * 0.05);
      const heroScale = compact ? 1.55 : 1.42;

      // --- Resting state: the centre pack alone, oversized -------------------
      gsap.set(row.current, { scale: heroScale, y: restY, transformOrigin: '50% 78%' });
      gsap.set(siblings, {
        x: (i, el) => offsets.get(el as HTMLElement) ?? 0,
        opacity: 0,
        scale: 0.9,
      });
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
        // A white-to-carbon cross-fade parks on flat grey if you scrub slowly,
        // so the flip is short enough to pass through rather than sit in.
        .to(bg.current, { backgroundColor: CARBON, duration: 0.08 }, 0.17);

      // --- Act 2: the splash ------------------------------------------------
      tl.to(statement.current, { opacity: 1, y: 0, duration: 0.1 }, 0.24)
        .to(splash.current, { opacity: 1, scale: 1.12, duration: 0.24 }, 0.28)
        .to(statement.current, { opacity: 0, y: -28, duration: 0.09 }, 0.5)
        .to(splash.current, { opacity: 0.14, scale: 0.96, duration: 0.14 }, 0.54);

      // --- Act 3: one becomes five ------------------------------------------
      tl.to(rangeHead.current, { opacity: 1, y: 0, duration: 0.11 }, 0.56)
        .to(row.current, { scale: 1, y: 0, duration: 0.22 }, 0.58)
        .to(siblings, { x: 0, opacity: 1, scale: 1, duration: 0.26, stagger: 0.035 }, 0.58)
        .to(leaders, { scaleY: 1, duration: 0.14, stagger: 0.03 }, 0.76)
        .to(callouts, { opacity: 1, y: 0, duration: 0.15, stagger: 0.03 }, 0.8);

      return () => ScrollTrigger.removeEventListener('refreshInit', measure);
    }, wrap);

    return () => ctx.revert();
  }, [ready, reduced, compact]);

  // Reduced motion: the canister once, then the range. No standalone splash
  // section, because the same pack twice running reads as a mistake.
  if (ready && reduced) {
    return (
      <>
        <Hero />
        <TheFive backdrop />
      </>
    );
  }

  const maxH = compact ? MAX_H_COMPACT : MAX_H;

  return (
    <div ref={wrap} className={compact ? 'relative h-[280vh]' : 'relative h-[320vh] lg:h-[380vh]'}>
      <span id="hero" className="absolute top-0" aria-hidden />
      <span id="splash" className="absolute top-[22%]" aria-hidden />
      <span id="range" className="absolute top-[58%]" aria-hidden />

      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div
          ref={bg}
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: ENG_WHITE }}
        />

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

        {/* Text zone. The three states cross-fade in one place, clear of the nav. */}
        <div className="shell absolute inset-x-0 top-[13%] z-30 flex flex-col items-center text-center md:top-[14%]">
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
              style={{ fontSize: 'clamp(2rem, 5vw, 4.25rem)', lineHeight: 0.98, color: ENG_WHITE }}
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

        {/* Splash, behind the packs, on the same baseline. */}
        <div
          ref={splash}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
          style={{ bottom: '17%', width: 'min(96vw, 760px)' }}
        >
          <Image
            src="/plates/oil-crown-splash.png"
            alt=""
            width={1200}
            height={822}
            sizes="(max-width: 768px) 96vw, 760px"
            className="h-auto w-full"
          />
        </div>

        {/* The line-up. Renders in final layout; GSAP collapses it to centre. */}
        <ul
          ref={row}
          className="absolute inset-x-0 z-10 flex items-end justify-center gap-[1vw] md:gap-[2vw]"
          style={{ bottom: compact ? '16%' : '9%' }}
        >
          {LINEUP.map((slot, i) => {
            const product = PRODUCTS.find((p) => p.id === slot.id);
            if (!product) return null;
            const isCentre = i === CENTRE_INDEX;

            return (
              <li
                key={product.id}
                data-cell
                className="flex min-w-0 flex-1 flex-col items-center md:w-[15%] md:min-w-[118px] md:flex-none"
                style={{ zIndex: slot.z }}
              >
                {/* Fixed slot so the arc never shifts the callout line. */}
                <div
                  className="flex w-full items-end justify-center"
                  style={{ height: `${maxH}vh`, paddingBottom: compact ? 24 : 40 }}
                >
                  <div data-pack className="flex items-end">
                    <Image
                      src={product.image}
                      alt={`${product.name} ${product.grade}`}
                      width={620}
                      height={860}
                      priority={isCentre}
                      sizes="(max-width: 768px) 20vw, 15vw"
                      style={{ height: `${compact ? slot.mh : slot.h}vh`, width: 'auto' }}
                      className="w-auto object-contain"
                    />
                  </div>
                </div>

                <div
                  data-leader
                  aria-hidden
                  style={{
                    width: 1,
                    height: isCentre ? (compact ? 18 : 30) : compact ? 13 : 22,
                    background: isCentre ? 'var(--color-zic-red)' : 'var(--color-deep-steel)',
                  }}
                />

                <div data-callout className="mt-2 w-full px-0.5 text-center md:mt-3 md:px-1">
                  <p
                    className="t-display text-[0.625rem] font-semibold leading-tight tracking-[-0.02em] md:text-[0.8125rem] lg:text-[0.9375rem]"
                    style={{ color: ENG_WHITE }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.5rem] font-semibold tracking-[0.04em] md:text-[0.625rem] lg:text-[0.6875rem]"
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
        <div
          ref={heroFoot}
          className="absolute inset-x-0 bottom-[5%] z-30 flex flex-col items-center"
        >
          <p
            className="t-mono hidden text-[0.6875rem] tracking-[0.1em] md:block"
            style={{ color: 'var(--color-steel-text)' }}
          >
            ZIC X7 · 5W-30 · FULLY SYNTHETIC · 4 L
          </p>
          <div className="flex w-full max-w-[320px] flex-col gap-3 sm:max-w-none sm:flex-row sm:gap-4 md:mt-5">
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
