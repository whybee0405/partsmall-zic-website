'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from '@/lib/scroll';
import { PRODUCTS } from '@/content/products';
import { PRIMARY_CTA, SECONDARY_CTA } from '@/content/cta';
import { Cta } from '@/components/ui';
import Hero from '@/components/sections/Hero';
import TheFive from '@/components/sections/TheFive';
import SplashFrames, { type SplashApi } from '@/components/SplashFrames';

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

/**
 * The stage headline size, shared by the hero and the range title so the three
 * states cross-fade at one weight.
 *
 * The `min()` term is the point: sized on width alone, a 69px headline keeps
 * its full height on a 720px-tall laptop and leaves the product 191px to live
 * in. Height is the scarcer axis on a laptop, so it caps the type.
 */
const HEAD_SIZE = 'clamp(2rem, min(5.4vw, 7.6vh), 4.75rem)';

/**
 * The descent notes.
 *
 * Four things worth knowing, in plain language, passing the canister on its way
 * down. They alternate sides so the eye has somewhere new to go each time, and
 * they travel upward, which is what makes the canister read as falling: a
 * falling object against an empty background is indistinguishable from a still
 * one, so the scenery has to move.
 */
const FALL_NOTES = [
  {
    side: 'left',
    label: 'Where it starts',
    text: 'Every motor oil starts as base oil. The world uses more of ours than anyone else’s.',
  },
  {
    side: 'right',
    label: 'Cold mornings',
    text: 'Thin enough to reach the engine on a Highveld winter start.',
  },
  {
    side: 'left',
    label: 'Hot afternoons',
    text: 'Steady enough to hold its film when the load and the heat climb together.',
  },
  {
    side: 'right',
    label: 'Between services',
    text: 'Less of it burns off, so there is less to top up before the next one.',
  },
] as const;

/**
 * Frames in /public/splash: the rise, then the collapse, cut together as one
 * sequence. The rise footage holds its peak to the last frame and never falls,
 * so the second half is a continuation generated from that peak frame.
 */
const SPLASH_FRAMES = 48;

/**
 * Sequence position of the impact, used to land the canister's dip on it. The
 * lateral footage breaks on its first frame rather than dropping a bead first,
 * so contact is effectively the start of the clip.
 */
const SPLASH_IMPACT = 0.04;

/**
 * Height fraction of a splash frame at which the oil surface sits — here, the
 * point of the V the two sheets rise out of, which is near the bottom of the
 * frame. The frames are aligned to the canister's foot on this line, so the
 * product stands in the oil at every viewport instead of floating above it.
 */
const SPLASH_SURFACE = 0.9;

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
  const ctaRow = useRef<HTMLDivElement>(null);
  const statement = useRef<HTMLDivElement>(null);
  const rangeHead = useRef<HTMLDivElement>(null);
  const splash = useRef<HTMLDivElement>(null);
  const splashApi = useRef<SplashApi | null>(null);
  const row = useRef<HTMLUListElement>(null);

  // Layout effect, not a plain effect: it only flips `ready` from false to
  // true, but a plain effect fires after the browser's first paint, so that
  // first paint would show the pre-GSAP layout (unscaled product) before
  // snapping to the real one a frame later. Running synchronously pre-paint
  // — together with the measurement effect below, also a layout effect —
  // means both resolve before anything is shown, so there is nothing to pop.
  useLayoutEffect(() => {
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

  // Layout effect: `layout()` below calls `fitBand()` and `gsap.set`s the
  // product's real rest scale synchronously. A plain effect would let the
  // browser paint the unscaled product first, then jump to the computed
  // size — the "starts small, pops big" flash. Pairs with the layout effect
  // above so both resolve before the first real paint.
  useLayoutEffect(() => {
    if (!ready || reduced || prefersReducedMotion() || !wrap.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('[data-cell]');
      const packs = gsap.utils.toArray<HTMLElement>('[data-pack]');
      const centrePack = packs[CENTRE_INDEX];
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

      // The rainbow. Applied to the pack inside each cell so the leader lines
      // and callouts stay on one straight line beneath the curve.
      packs.forEach((el, i) => {
        gsap.set(el, {
          y: compact ? LINEUP[i].marc : LINEUP[i].arc,
          rotate: LINEUP[i].rot,
          transformOrigin: '50% 100%',
        });
      });

      // --- Resting state: the centre pack alone, oversized -------------------
      // The hero type is positioned from the top of the stage and the line-up
      // from the bottom, so a fixed hero scale only composes at one viewport
      // height: 1.42 cleared the paragraph at 1080px and drove the canister
      // 111px through it at 720px. The rest transform is therefore measured,
      // not authored. The canister fills the band between the paragraph and the
      // CTAs, up to a ceiling, and never enters either.
      // Clearances scale with height: 34px reads as air at 1080 and as waste at
      // 720, where every pixel belongs to the product.
      // Compact clearances trimmed from their original 22/18: the hero heading
      // now starts lower to clear the fixed nav (--nav-clearance), which ate
      // into gapAbove's headroom from the top. Trimming both here recovers
      // that band height for the product rather than letting it shrink.
      const gapAbove = () => (compact ? 14 : gsap.utils.clamp(16, 30, innerHeight * 0.028));
      const gapBelow = () => (compact ? 14 : gsap.utils.clamp(14, 24, innerHeight * 0.022));
      const MAX_SCALE = compact ? 2.2 : 1.9;

      /**
       * The descent.
       *
       * A centred hero canister has barely 15vh of headroom before its foot
       * leaves the stage, so translation alone cannot carry a fall. Most of the
       * read comes from recession: the pack shrinks as it drops, which is what
       * falling away from a camera looks like, and it leaves the row closer to
       * the size the line-up needs anyway.
       */
      const LAND_SHRINK = compact ? 0.82 : 0.84;
      const landFoot = () => window.innerHeight * (compact ? 0.84 : 0.87);
      let landScale = MAX_SCALE;
      let landY = 0;

      let restScale = MAX_SCALE;
      let restY = 0;

      /** Rect with the element's own transform neutralised. */
      const rawRect = (el: HTMLElement) => {
        const prev = el.style.transform;
        el.style.transform = 'none';
        const r = el.getBoundingClientRect();
        el.style.transform = prev;
        return r;
      };

      const fitBand = () => {
        const rowEl = row.current;
        const type = heroType.current;
        // The real floor constraint is the CTA row, not the whole hero
        // footer — heroFoot also holds the scroll cue now, and that
        // decorative chrome sitting below the buttons should never eat into
        // the product's band just because it shares the same wrapper.
        const foot = ctaRow.current;
        const centre = packs[CENTRE_INDEX]?.querySelector('img');
        if (!rowEl || !type || !foot || !centre) return;

        const rowTop = rowEl.getBoundingClientRect().top;
        const pack = centre.getBoundingClientRect();
        const top = rawRect(type).bottom + gapAbove();
        const bottom = rawRect(foot).top - gapBelow();

        // Fill the band, then sit on its centre line rather than its floor: the
        // hero is a portrait of one product, so it wants to be the optical
        // centre of the stage, not something standing on the CTAs.
        // Origin-independent: newY = O + s * (y - O) + ty.
        // The floor is 0.92 rather than 1 so that a viewport short enough to
        // beat the type concessions still yields air, never an intersection.
        restScale = gsap.utils.clamp(0.92, MAX_SCALE, (bottom - top) / pack.height);
        const bandMid = (top + bottom) / 2;
        const packMid = (pack.top + pack.bottom) / 2;
        restY = bandMid - rowTop - restScale * (packMid - rowTop);

        // Put the oil surface under the canister's foot. Anchoring the splash
        // to the stage floor instead leaves the product hovering above it on a
        // phone, where the band centre and the floor are far apart.
        const sp = splash.current;
        if (!sp) return;
        // Where the fall ends, solved from the foot line rather than from a
        // travel distance, so the landing sits at the same place on the stage
        // whatever the rest scale worked out to be.
        landScale = restScale * LAND_SHRINK;
        landY = landFoot() - rowTop - landScale * (pack.bottom - rowTop);

        // Measured at the landing, not at rest: the canister falls before it
        // hits, so the oil has to be where it ends up.
        const sr = rawRect(sp);
        gsap.set(sp, {
          y: landFoot() - (sr.top + SPLASH_SURFACE * sr.height),
          transformOrigin: `50% ${SPLASH_SURFACE * 100}%`,
        });
      };

      /**
       * Neutral first, then measure, then rest. Sibling offsets are applied in
       * the row's local space but read in viewport space, so they are only
       * correct when the row is unscaled at the moment of reading.
       */
      const layout = () => {
        gsap.set(row.current, { scale: 1, y: 0, transformOrigin: '50% 0%' });
        measure();
        fitBand();
        gsap.set(row.current, { scale: restScale, y: restY });
        gsap.set(siblings, {
          x: (i, el) => offsets.get(el as HTMLElement) ?? 0,
          opacity: 0,
          scale: 0.9,
        });
      };
      layout();
      ScrollTrigger.addEventListener('refreshInit', layout);

      gsap.set([statement.current, rangeHead.current], { opacity: 0, y: 26 });
      gsap.set(splash.current, { opacity: 0, scale: 0.72 });
      gsap.set(leaders, { scaleY: 0, transformOrigin: '50% 0%' });
      gsap.set(callouts, { opacity: 0, y: 12 });

      // Notes wait below the line they will cross, never at scale 0: nothing in
      // the world appears out of nothing.
      const notes = gsap.utils.toArray<HTMLElement>('[data-note]');
      // The notes are the scenery, and the scenery is what makes the fall
      // legible, so they sweep a long way rather than fading in place.
      const travel = () => window.innerHeight * (compact ? 0.14 : 0.26);
      notes.forEach((el) => {
        const from = el.dataset.side === 'left' ? -34 : 34;
        gsap.set(el, { opacity: 0, y: travel, x: compact ? from * 0.6 : from, scale: 0.98 });
      });
      gsap.set(centrePack, { transformOrigin: '50% 45%' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
          // The frames are wanted a beat before they are shown, and never by
          // someone who arrives and leaves without scrolling.
          onUpdate: (self) => {
            if (self.progress > 0.02) splashApi.current?.prime();
          },
        },
        defaults: { ease: 'none' },
      });

      // Beats. The acts overlap by design: a gap where nothing moves is what
      // made the old sequence read as a cut rather than a fall.
      const FALL_IN = 0.05; // the descent begins
      const PLUNGE = 0.6; // the last, accelerating stretch
      const LAND = 0.665; // contact
      const REVEAL = 0.8; // one becomes five

      // --- Act 1: the type gives way to the product -------------------------
      tl.to(heroType.current, { opacity: 0, y: -70, duration: 0.09 }, 0)
        .to(heroFoot.current, { opacity: 0, y: -30, duration: 0.09 }, 0)
        .to(ghost.current, { opacity: 0, y: -50, duration: 0.16 }, 0)
        // A white-to-carbon cross-fade parks on flat grey if you scrub slowly,
        // so the flip is short enough to pass through rather than sit in. It
        // now runs under the first of the fall, so the colour never changes on
        // a still frame.
        .to(bg.current, { backgroundColor: CARBON, duration: 0.07 }, 0.06);

      // --- Act 2: the fall --------------------------------------------------
      // Constant velocity for the long stretch, because under scrub the reader
      // sets the clock and any easing here reads as the page fighting them.
      // The last stretch accelerates, which is the one place ease-in is the
      // honest curve: it is gravity, not interface feedback.
      const at = (a: number, b: number, f: number) => a + (b - a) * f;
      tl.to(
        row.current,
        {
          y: () => at(restY, landY, 0.62),
          scale: () => at(restScale, landScale, 0.62),
          duration: PLUNGE - FALL_IN,
        },
        FALL_IN,
      )
        .to(
          row.current,
          {
            y: () => landY,
            scale: () => landScale,
            duration: LAND - PLUNGE,
            ease: 'power2.in',
          },
          PLUNGE,
        )
        // A slow tumble, so the fall is not one rigid block.
        .to(centrePack, { rotate: -3, duration: 0.3 }, FALL_IN)
        .to(centrePack, { rotate: 1.8, duration: 0.25 }, 0.35)
        .to(centrePack, { rotate: 0, duration: LAND - PLUNGE, ease: 'power2.in' }, PLUNGE)
        // Blur bridges the fast stretch so the eye reads one moving object
        // rather than a stack of positions, and clears on contact.
        .to(centrePack, { filter: 'blur(5px)', duration: (LAND - PLUNGE) * 0.7 }, PLUNGE)
        .to(centrePack, { filter: 'blur(0px)', duration: 0.05, ease: 'power2.out' }, LAND);

      // The notes pass upward through the fall, one at a time, entering on
      // alternating sides. Enter decelerating, leave accelerating: near things
      // pass faster than far ones, and that is what gives the shot its depth.
      const NOTE_SPAN = (PLUNGE - 0.12 - FALL_IN) / FALL_NOTES.length;
      notes.forEach((el, i) => {
        const at = FALL_IN + 0.04 + i * NOTE_SPAN;
        tl.to(
          el,
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: NOTE_SPAN * 0.42,
            ease: 'power3.out',
          },
          at,
        ).to(
          el,
          {
            opacity: 0,
            y: () => -travel(),
            scale: 0.98,
            duration: NOTE_SPAN * 0.34,
            ease: 'power2.in',
          },
          at + NOTE_SPAN * 0.6,
        );
      });

      // --- Act 3: contact ---------------------------------------------------
      // The frame index is scrubbed on a proxy rather than a DOM property, so
      // the canvas paints once per animation frame no matter how fast the
      // scroll is. The sequence is offset so that its own impact frame lands on
      // LAND, which is the whole point of the act.
      // The sequence runs all the way to the end of the stage, straight through
      // the reveal. Freezing it at the reveal left the oil standing in a held
      // pose behind the line-up, which is the one thing a splash must not do:
      // it has to be still falling while attention moves to the products.
      const shot = { t: 0 };
      const SHOT_SPAN = 0.99 - LAND;
      tl.to(splash.current, { opacity: 1, scale: 1.1, duration: 0.04 }, LAND - 0.025)
        .to(
          shot,
          { t: 1, duration: SHOT_SPAN, onUpdate: () => splashApi.current?.(shot.t) },
          LAND - SPLASH_IMPACT * SHOT_SPAN,
        )
        // Recoil. Fast and decelerating, the way a landing settles.
        .to(
          row.current,
          { y: () => landY - window.innerHeight * 0.014, duration: 0.035, ease: 'power2.out' },
          LAND,
        )
        .to(row.current, { y: () => landY, duration: 0.05, ease: 'power1.inOut' }, LAND + 0.035)
        .to(statement.current, { opacity: 1, y: 0, duration: 0.06 }, LAND + 0.01)
        .to(statement.current, { opacity: 0, y: -28, duration: 0.05 }, REVEAL - 0.07)
        // Two stages, not one cut. It gives up most of its presence as the
        // line-up arrives and then keeps subsiding underneath it, so the oil
        // is dying away rather than being switched off.
        .to(splash.current, { opacity: 0.38, duration: 0.09 }, REVEAL - 0.05)
        .to(splash.current, { opacity: 0.05, scale: 0.97, duration: 0.16 }, REVEAL + 0.08);

      // --- Act 4: one becomes five ------------------------------------------
      // Stagger extends a tween's end by stagger x (n - 1), so these are placed
      // to finish on 1.0 rather than past it. See the note below on why the
      // timeline's total duration has to be exactly 1.
      tl.to(rangeHead.current, { opacity: 1, y: 0, duration: 0.07 }, REVEAL - 0.02)
        .to(row.current, { scale: 1, y: 0, duration: 0.13 }, REVEAL)
        .to(siblings, { x: 0, opacity: 1, scale: 1, duration: 0.13, stagger: 0.02 }, REVEAL)
        .to(leaders, { scaleY: 1, duration: 0.06, stagger: 0.015 }, REVEAL + 0.08)
        .to(callouts, { opacity: 1, y: 0, duration: 0.04, stagger: 0.012 }, REVEAL + 0.11);

      // ScrollTrigger maps the scroll range onto the timeline's *duration*, not
      // onto 1. These beats are written as fractions, so a timeline that ends at
      // 1.05 compresses every one of them by five percent, and the error
      // compounds toward the end: the splash was firing a twentieth of the page
      // early while the hero beats still looked right. An empty set at 1 pins
      // the duration so a beat number means what it says.
      tl.set({}, {}, 1);

      return () => ScrollTrigger.removeEventListener('refreshInit', layout);
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
    <div ref={wrap} className={compact ? 'relative h-[500vh]' : 'relative h-[560vh] lg:h-[640vh]'}>
      {/* Chamber markers. The nav and the rail read these to know what surface
          they are sitting on, so `descent` has to land on the frame where the
          stage actually turns to Carbon, not where the fall reads as over. */}
      <span id="hero" className="absolute top-0" aria-hidden />
      <span id="descent" className="absolute top-[11%]" aria-hidden />
      <span id="splash" className="absolute top-[62%]" aria-hidden />
      <span id="range" className="absolute top-[80%]" aria-hidden />

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

        {/* Text zone. The three states cross-fade in one place, clear of the
            nav. The percentage offsets alone were a fraction of viewport
            height, so on a short phone viewport (or once the mobile progress
            bar sits under the nav too) the percentage could resolve to less
            than the nav's actual pixel height, sinking the stamp line behind
            it. max() keeps the percentage look on tall viewports while
            guaranteeing it never resolves below --nav-clearance. */}
        <div className="shell absolute inset-x-0 top-[max(13%,var(--nav-clearance))] z-30 flex flex-col items-center text-center md:top-[max(14%,var(--nav-clearance))] short:top-[max(11%,var(--nav-clearance))]">
          <div ref={heroType} className="flex flex-col items-center">
            <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
              SK ZIC · Distributed across Southern Africa by Parts-Mall Africa
            </p>
            <h1
              className="t-display mt-5 short:mt-3"
              style={{ fontSize: HEAD_SIZE, lineHeight: 0.94 }}
            >
              Performance
              <br />
              Starts Within.
            </h1>
            <p
              className="mt-5 text-[0.9375rem] leading-[1.6] md:text-[1.0625rem] short:mt-3"
              style={{ maxWidth: 540, color: 'var(--color-deep-steel)' }}
            >
              The world&rsquo;s number one Group III base oil, engineered into motor oil for South
              African conditions.
            </p>
          </div>

          <div
            ref={statement}
            className="absolute inset-x-0 top-0 flex flex-col items-center"
            style={{ opacity: 0, transform: 'translateY(26px)' }}
          >
            <p className="t-stamp" style={{ color: 'var(--color-steel-text)' }}>
              The transition
            </p>
            <h2
              className="t-display mt-5 short:mt-3"
              style={{
                fontSize: 'clamp(1.75rem, min(5vw, 7vh), 4.25rem)',
                lineHeight: 0.98,
                color: ENG_WHITE,
              }}
            >
              One engineering standard.
            </h2>
            <p
              className="mt-5 text-[0.9375rem] leading-[1.6] md:text-[1.0625rem] short:mt-3"
              style={{ maxWidth: 560, color: 'var(--color-metal-grey)' }}
            >
              The same base oil, the same additive discipline, the same laboratory. What changes is
              the job it is asked to do.
            </p>
          </div>

          <div
            ref={rangeHead}
            className="absolute inset-x-0 top-0 flex flex-col items-center"
            style={{ opacity: 0, transform: 'translateY(26px)' }}
          >
            <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
              Five products · Seven pack sizes
            </p>
            <h2
              className="t-display mt-5 short:mt-3"
              style={{ fontSize: HEAD_SIZE, lineHeight: 0.98, color: ENG_WHITE }}
            >
              The South African range.
            </h2>
            <p
              className="mt-5 text-[0.9375rem] leading-[1.6] md:text-[1.0625rem] short:mt-3"
              style={{ maxWidth: 720, color: 'var(--color-metal-grey)' }}
            >
              The SK ZIC line-up Parts-Mall Africa imports today, matched to the specifications
              this market runs.
            </p>
          </div>
        </div>

        {/* The descent notes. One vertical line for all four, so the eye holds
            its position and the copy comes to it. */}
        {/* Above the canister on a phone, beside it on a desktop: there is no
            room for a side column at 393px, and copy over the product is
            worse than copy near it. */}
        <div className="pointer-events-none absolute inset-x-0 top-[27%] z-20 md:top-[44%]">
          {FALL_NOTES.map((note) => (
            <div
              key={note.label}
              data-note
              data-side={note.side}
              // Not `.shell`: it is unlayered CSS, so its width:100% beats a
              // Tailwind width utility and the note runs across the product.
              className={
                note.side === 'left'
                  ? 'absolute inset-x-0 px-5 text-center md:right-auto md:left-[6vw] md:w-[min(25vw,300px)] md:px-0 md:text-left lg:left-[11vw]'
                  : 'absolute inset-x-0 px-5 text-center md:left-auto md:right-[6vw] md:w-[min(25vw,300px)] md:px-0 md:text-right lg:right-[11vw]'
              }
              // Hidden by default so all four notes don't render superimposed,
              // full opacity, before the mount effect below runs `gsap.set`
              // with their real (viewport-dependent) offsets.
              style={{ opacity: 0 }}
            >
              <p className="t-label" style={{ color: 'var(--color-zic-red)' }}>
                {note.label}
              </p>
              <p
                className="mt-2 text-[0.9375rem] leading-[1.55] md:mt-3 md:text-[1.125rem] md:leading-[1.5]"
                style={{ color: 'var(--color-eng-white)' }}
              >
                {note.text}
              </p>
            </div>
          ))}
        </div>

        {/* Splash, behind the packs, on the same baseline. `screen` drops the
            footage's black ground so the oil sits on the carbon backdrop. */}
        <div
          ref={splash}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
          style={{
            // Hidden until the mount effect's `gsap.set` runs — otherwise the
            // splash frame's poster image renders at full opacity, behind
            // the hero text, on first paint.
            opacity: 0,
            // The wings run past the edges of their own frame in the last third
            // of the clip, so the box is wider than the viewport: the cut then
            // happens off screen, where the viewport edge is doing the cropping
            // rather than a visible seam in the middle of the stage.
            bottom: '-9%',
            // Sized so the sheets rise to about the canister's shoulder rather
            // than out of the top of the stage. A phone needs proportionally
            // more of its width to reach the same height, since the frame is
            // 16:9 whatever it is shown on.
            width: compact ? '104vw' : 'min(62vw, 980px)',
            mixBlendMode: 'screen',
            // The sheets climb out through the top of their own frame, so the
            // mask reaches full transparency before the box top: they dissolve
            // as they rise, the way spray does, instead of ending on a
            // horizontal cut. The solid core is wide, though. A tight one put
            // most of the oil inside the falloff, which read as a vignette laid
            // over the splash rather than as an edge being hidden.
            maskImage: 'radial-gradient(78% 70% at 50% 76%, #000 58%, transparent 99%)',
            WebkitMaskImage: 'radial-gradient(78% 70% at 50% 76%, #000 58%, transparent 99%)',
          }}
        >
          <SplashFrames
            api={splashApi}
            count={SPLASH_FRAMES}
            dir="/splash"
            poster="/splash/f-16.webp"
            width={860}
            height={484}
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
                style={{
                  zIndex: slot.z,
                  // The resting state is the centre pack alone; the other four
                  // stay hidden until the reveal. Without this default they
                  // render in their final side-by-side layout, opacity 1, on
                  // first paint, before `gsap.set` (which also applies their
                  // measured x-offset) has run.
                  ...(isCentre ? null : { opacity: 0 }),
                }}
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
                    // Collapsed until `gsap.set` runs, matching its `scaleY: 0`
                    // initial state — otherwise every leader line renders at
                    // full height on first paint.
                    transform: 'scaleY(0)',
                    transformOrigin: '50% 0%',
                  }}
                />

                <div
                  data-callout
                  className="mt-2 w-full px-0.5 text-center md:mt-3 md:px-1"
                  style={{ opacity: 0, transform: 'translateY(12px)' }}
                >
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
          className="absolute inset-x-0 bottom-[5%] z-30 flex flex-col items-center short:bottom-[4%]"
        >
          {/* sm:w-auto matters: dropping the max-width without it leaves a
              full-bleed row that packs both buttons against the left edge. */}
          <div
            ref={ctaRow}
            className="flex w-full max-w-[320px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4"
          >
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
