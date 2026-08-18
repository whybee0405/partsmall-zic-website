'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/scroll';
import { Stamp } from '@/components/ui';

/**
 * 05 — Ch.01. What is happening inside?
 *
 * BRAND-DNA's master visual question, answered with the Protection Layer: a
 * glowing oil film between two ground steel surfaces, full bleed.
 *
 * Three photographs, not one squeezed vertically — a single image distorted
 * via `scaleY` can only ever say "the picture got smaller," not "the film
 * changed." Each state gets its own frame (full separation, a near-touching
 * hairline, and a hotter bonded glow for the chemical EP layer) and the
 * frames cross-fade continuously as you scroll, so the transition reads as
 * one continuous take rather than a jump between three unrelated shots.
 *
 * Desktop shows all three states at once, side by side, with the active
 * one picked out by title colour and the tick above it. Below 768px that
 * collapses to a single cross-fading panel instead — three columns of body
 * copy doesn't fit a phone — but the pin and the frame cross-fade are the
 * same scaled-down experience, not a different, static one.
 *
 * Design: docs/design-snapshots/sections/s05-ch01-inside.png
 */

const STATES = [
  {
    n: '01',
    title: 'Fluid film',
    readout: 'FILM: FULL · CONTACT: NONE',
    body: 'The surfaces are completely separated. Wear is close to zero. This is where an engine spends most of its life once warm.',
    image: '/plates/oil-film-steel.jpg',
  },
  {
    n: '02',
    title: 'Boundary',
    readout: 'FILM: MINIMAL · CONTACT: ASPERITY',
    body: 'The film has thinned to almost nothing and the additive layer is all that is left. This is cold start, and it is where most engine wear happens.',
    image: '/plates/oil-film-boundary.jpg',
  },
  {
    n: '03',
    title: 'Extreme pressure',
    readout: 'FILM: LOAD-BEARING · CONTACT: CHEMICAL',
    body: 'Under very high load the EP additives bond chemically to the metal and carry what the fluid alone cannot.',
    image: '/plates/oil-film-bond.jpg',
  },
];

const TITLE_ACTIVE = '#f7f7f5'; // var(--color-eng-white)
const TITLE_DIM = '#a9adb2'; // var(--color-metal-grey)
const TICK_ACTIVE = '#e31e24'; // var(--color-zic-red)
const TICK_DIM = '#2a3037'; // var(--color-deep-steel)
// Metal-grey, not steel-text: this track sits on the carbon chamber, and
// steel-text fails the 4.5:1 contrast floor there (DESIGN.md).
const READOUT_DIM = '#a9adb2';
// The unselected states recede as a group, not just their title, so the
// active one reads as picked out rather than merely differently coloured.
const COL_DIM = 0.4;
const TICK_GLOW = '0 0 10px 2px rgba(227,30,36,0.55)';
const TICK_NO_GLOW = '0 0 0 rgba(227,30,36,0)';

export default function Inside() {
  const [reduced, setReduced] = useState(false);
  // Purely a layout choice (3 columns vs. one cross-fading panel) — the pin
  // and the frame cross-fade run either way.
  const [narrow, setNarrow] = useState(false);
  // Unlike `narrow`, this disables the animation entirely: a landscape phone
  // is wide enough to pass the narrow check but too short for the pinned
  // stage to fit even a single panel's body copy without clipping it.
  const [tooShort, setTooShort] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frameWrap = useRef<HTMLDivElement>(null);
  // GSAP's `pin` restructures the DOM (wraps the target in a spacer). On
  // mount, `tooShort`/`narrow` start false by default and only get corrected
  // once the media-query effect below runs — if the GSAP effect fired on
  // that first, stale render on an actually-static viewport, it would mount
  // the pin, then immediately have to tear it down as React reconciles into
  // the completely different static-layout branch. That race is what a
  // `removeChild` crash on landscape phones traced back to. `ready`
  // withholds the GSAP effect until the queries have resolved at least
  // once, so it never mounts on a value about to flip.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrowQuery = window.matchMedia('(max-width: 767px)');
    const shortQuery = window.matchMedia('(max-height: 560px)');
    const sync = () => {
      setReduced(motion.matches);
      setNarrow(narrowQuery.matches);
      setTooShort(shortQuery.matches);
      setReady(true);
    };
    sync();
    motion.addEventListener('change', sync);
    narrowQuery.addEventListener('change', sync);
    shortQuery.addEventListener('change', sync);
    return () => {
      motion.removeEventListener('change', sync);
      narrowQuery.removeEventListener('change', sync);
      shortQuery.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (
      !ready ||
      reduced ||
      tooShort ||
      prefersReducedMotion() ||
      !wrap.current ||
      !stage.current ||
      !frameWrap.current
    ) {
      return;
    }
    registerGsap();

    const ctx = gsap.context(() => {
      const ticks = gsap.utils.toArray<HTMLElement>('[data-state-tick]');
      const frames = gsap.utils.toArray<HTMLElement>('[data-film-frame]', frameWrap.current!);

      // Pinning via GSAP (not CSS `position: sticky` against a manual `vh`
      // height) so the scrub timeline's progress 0→1 maps exactly to the
      // pinned duration. Sticky against a fixed container height releases
      // as soon as (containerHeight − stageHeight) of scroll has passed —
      // for a 100dvh stage in a 280vh section that is ~64% of the way
      // through, so anything scheduled later in the timeline (the third
      // state's reveal, here) would already be scrolling away unpinned.
      //
      // Pin distance is 1.8×innerHeight, deliberately chosen so
      // pinDistance + stageHeight (100dvh) works out to 2.8×innerHeight —
      // exactly the static `h-[280vh]` fallback on `wrap` below. Before this
      // effect runs (slow hydration, throttled CPU), the section already has
      // its final height from CSS alone; GSAP's pin-spacer then reproduces
      // the same number instead of growing the page out from under it.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 1.8)}`,
          pin: stage.current,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });

      const setTick = (el: gsap.TweenTarget, active: boolean) =>
        gsap.set(el, {
          backgroundColor: active ? TICK_ACTIVE : TICK_DIM,
          scaleY: active ? 2.5 : 1,
          boxShadow: active ? TICK_GLOW : TICK_NO_GLOW,
        });
      setTick(ticks[0], true);
      setTick(ticks.slice(1), false);
      gsap.set(frames[0], { opacity: 1 });
      gsap.set(frames.slice(1), { opacity: 0 });

      // A short dwell at each end so the opening and closing states are
      // legible before the frame starts crossing over, but the two
      // transitions run continuously rather than holding flat per state
      // and dumping the whole change into the final beat.
      const HOLD = 1 / 6;
      const crossFadeTo = (i: number, at: number, duration: number) => {
        tl.to(frames[i - 1], { opacity: 0, duration }, at).to(frames[i], { opacity: 1, duration }, at);
      };
      crossFadeTo(1, HOLD, 1 / 3);
      crossFadeTo(2, HOLD + 1 / 3, 1 / 3);
      // Bare numbers as GSAP timeline positions are absolute seconds, not
      // a fraction of total duration — without this, the tweens above
      // only summed to 5/6 and every `.set()` position below (written as
      // a fraction) would resolve against that shorter duration instead
      // of against the scrub's true 0–1 progress range.
      tl.to({}, { duration: HOLD });

      // The two cross-fades above span [HOLD, HOLD+1/3] and
      // [HOLD+1/3, HOLD+2/3] — i.e. they *finish* at 1/2 and 5/6, not at
      // the 1/3 and 2/3 thirds boundary. Every discrete switch below (tick,
      // title, panel) fires at those same two completion points, not at
      // the thirds, so the label lands exactly when the frame it describes
      // has actually finished crossing over — switching to "Boundary"
      // while the previous frame is still half-visible reads as the page
      // being wrong about its own animation.
      const SWITCH_1 = HOLD + 1 / 3; // 1/2
      const SWITCH_2 = HOLD + 2 / 3; // 5/6

      if (narrow) {
        // One panel cross-fades to the next as its frame transition
        // completes, instead of three columns changing emphasis — the
        // layout difference is the only difference, the timing is
        // identical to the wide case below.
        const panels = gsap.utils.toArray<HTMLElement>('[data-state-panel]');
        gsap.set(panels[0], { opacity: 1, y: 0 });
        gsap.set(panels.slice(1), { opacity: 0, y: 16 });

        const FADE = 0.06;
        tl.to(panels[0], { opacity: 0, y: -16, duration: FADE }, SWITCH_1 - FADE / 2)
          .to(panels[1], { opacity: 1, y: 0, duration: FADE }, SWITCH_1 - FADE / 2)
          .to(panels[1], { opacity: 0, y: -16, duration: FADE }, SWITCH_2 - FADE / 2)
          .to(panels[2], { opacity: 1, y: 0, duration: FADE }, SWITCH_2 - FADE / 2);

        // Timeline setters are reversible, so the rail remains truthful
        // when the visitor scrubs back through a state.
        tl.set(ticks[0], { backgroundColor: TICK_DIM, scaleY: 1, boxShadow: TICK_NO_GLOW }, SWITCH_1)
          .set(ticks[1], { backgroundColor: TICK_ACTIVE, scaleY: 2.5, boxShadow: TICK_GLOW }, SWITCH_1)
          .set(ticks[1], { backgroundColor: TICK_DIM, scaleY: 1, boxShadow: TICK_NO_GLOW }, SWITCH_2)
          .set(ticks[2], { backgroundColor: TICK_ACTIVE, scaleY: 2.5, boxShadow: TICK_GLOW }, SWITCH_2);
      } else {
        const titles = gsap.utils.toArray<HTMLElement>('[data-state-title]');
        const nums = gsap.utils.toArray<HTMLElement>('[data-state-num]');
        const readouts = gsap.utils.toArray<HTMLElement>('[data-state-readout]');
        const cols = gsap.utils.toArray<HTMLElement>('[data-state-col]');

        const setTitle = (el: gsap.TweenTarget, active: boolean) =>
          gsap.set(el, {
            color: active ? TITLE_ACTIVE : TITLE_DIM,
            fontWeight: active ? 800 : 600,
            scale: active ? 1.06 : 1,
          });
        const setNum = (el: gsap.TweenTarget, active: boolean) =>
          gsap.set(el, { color: active ? TICK_ACTIVE : TITLE_DIM, fontWeight: active ? 600 : 500 });
        const setReadout = (el: gsap.TweenTarget, active: boolean) =>
          gsap.set(el, { color: active ? TICK_ACTIVE : READOUT_DIM });

        setTitle(titles[0], true);
        setTitle(titles.slice(1), false);
        setNum(nums[0], true);
        setNum(nums.slice(1), false);
        setReadout(readouts[0], true);
        setReadout(readouts.slice(1), false);
        gsap.set(cols[0], { opacity: 1 });
        gsap.set(cols.slice(1), { opacity: COL_DIM });

        // Which state reads as "active" flips as its frame transition
        // completes — a clean cut timed to the motion, not to an
        // arbitrary thirds boundary. These are timeline setters, rather
        // than callbacks, so ScrollTrigger restores the prior state when a
        // reader scrubs back through either boundary.
        const switchTo = (i: number, at: number) => {
          tl.set(ticks[i - 1], { backgroundColor: TICK_DIM, scaleY: 1, boxShadow: TICK_NO_GLOW }, at)
            .set(ticks[i], { backgroundColor: TICK_ACTIVE, scaleY: 2.5, boxShadow: TICK_GLOW }, at)
            .set(titles[i - 1], { color: TITLE_DIM, fontWeight: 600, scale: 1 }, at)
            .set(titles[i], { color: TITLE_ACTIVE, fontWeight: 800, scale: 1.06 }, at)
            .set(nums[i - 1], { color: TITLE_DIM, fontWeight: 500 }, at)
            .set(nums[i], { color: TICK_ACTIVE, fontWeight: 600 }, at)
            .set(readouts[i - 1], { color: READOUT_DIM }, at)
            .set(readouts[i], { color: TICK_ACTIVE }, at)
            .set(cols[i - 1], { opacity: COL_DIM }, at)
            .set(cols[i], { opacity: 1 }, at);
        };
        switchTo(1, SWITCH_1);
        switchTo(2, SWITCH_2);
      }
    }, wrap);

    return () => ctx.revert();
  }, [ready, reduced, tooShort, narrow]);

  const staticLayout = reduced || tooShort;

  const Panels = staticLayout ? (
    <ul className="w-full">
      {STATES.map((s) => (
        <li key={s.n} className="mb-14 last:mb-0">
          <div className="relative mx-auto mb-6 aspect-[21/9] w-full max-w-[420px] overflow-hidden rounded-[4px]">
            <Image src={s.image} alt="" aria-hidden fill sizes="420px" className="object-cover" />
          </div>
          <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>
            {s.n} / 03
          </p>
          <h3
            className="t-display mt-2 text-[1.25rem] tracking-[-0.02em] md:text-[1.5rem]"
            style={{ color: 'var(--color-eng-white)' }}
          >
            {s.title}
          </h3>
          <p
            className="t-mono mt-2 text-[0.75rem] tracking-[0.08em]"
            style={{ color: 'var(--color-zic-red)' }}
          >
            {s.readout}
          </p>
          <p
            className="mx-auto mt-4 text-[0.9375rem] leading-[1.65]"
            style={{ maxWidth: 560, color: 'var(--color-metal-grey)' }}
          >
            {s.body}
          </p>
        </li>
      ))}
    </ul>
  ) : narrow ? (
    <ul className="relative w-full">
      {STATES.map((s, i) => (
        <li
          key={s.n}
          data-state-panel
          className="absolute inset-x-0 top-0"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>
            {s.n} / 03
          </p>
          <h3
            className="t-display mt-2 text-[1.25rem] tracking-[-0.02em]"
            style={{ color: 'var(--color-eng-white)' }}
          >
            {s.title}
          </h3>
          <p
            className="t-mono mt-2 text-[0.75rem] tracking-[0.08em]"
            style={{ color: 'var(--color-zic-red)' }}
          >
            {s.readout}
          </p>
          <p
            className="mx-auto mt-4 text-[0.9375rem] leading-[1.65]"
            style={{ maxWidth: 560, color: 'var(--color-metal-grey)' }}
          >
            {s.body}
          </p>
        </li>
      ))}
    </ul>
  ) : (
    <ul className="grid w-full grid-cols-3 gap-6 md:gap-10">
      {STATES.map((s, i) => (
        <li
          key={s.n}
          data-state-col
          className="text-center"
          style={{ opacity: i === 0 ? 1 : COL_DIM }}
        >
          <p
            data-state-num
            className="t-label"
            style={{ color: i === 0 ? 'var(--color-zic-red)' : 'var(--color-metal-grey)', fontWeight: i === 0 ? 600 : 500 }}
          >
            {s.n} / 03
          </p>
          <h3
            data-state-title
            className="t-display mt-2 text-[1.25rem] tracking-[-0.02em] md:text-[1.5rem]"
            style={{
              color: i === 0 ? 'var(--color-eng-white)' : 'var(--color-metal-grey)',
              fontWeight: i === 0 ? 800 : 600,
              transform: i === 0 ? 'scale(1.06)' : 'scale(1)',
              transformOrigin: 'center',
            }}
          >
            {s.title}
          </h3>
          <p
            data-state-readout
            className="t-mono mt-2 text-[0.75rem] tracking-[0.08em]"
            style={{ color: i === 0 ? 'var(--color-zic-red)' : 'var(--color-metal-grey)' }}
          >
            {s.readout}
          </p>
          <p
            className="mx-auto mt-4 text-[0.9375rem] leading-[1.65]"
            style={{ color: 'var(--color-metal-grey)' }}
          >
            {s.body}
          </p>
        </li>
      ))}
    </ul>
  );

  const Stage = (
    <div
      ref={stage}
      className="relative flex h-[100dvh] flex-col items-center justify-between overflow-hidden pb-[6vh] pt-[calc(var(--nav-clearance)+6vh)]"
    >
      {/* Full-bleed macro, cross-fading between the three states. The film
          sits on the horizontal centre line. */}
      <div ref={frameWrap} aria-hidden className="absolute inset-0">
        {STATES.map((s, i) => (
          <div key={s.n} data-film-frame className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
            <Image src={s.image} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.6 }} />
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(9,11,14,0.95) 0%, rgba(9,11,14,0.6) 46%, rgba(9,11,14,0.96) 100%)',
        }}
      />

      <div className="shell stack-centre relative shrink-0">
        <Stamp dark>Ch.01 / 06 — Lubrication — The Protection Layer</Stamp>
        <h2 className="t-display t-h2 mt-6" style={{ color: 'var(--color-eng-white)' }}>
          What is happening inside?
        </h2>
        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-metal-grey)' }}
        >
          Every claim a motor oil makes comes down to one thing: whether a film of liquid can keep
          two pieces of moving steel from touching. Everything else is a consequence of that.
        </p>
      </div>

      {/* State track */}
      <div className="shell relative flex w-full flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2" aria-hidden>
          {STATES.map((s, i) => (
            <span
              key={s.n}
              data-state-tick
              style={{
                width: 34,
                height: 3,
                backgroundColor: i === 0 ? TICK_ACTIVE : TICK_DIM,
                transformOrigin: 'center',
                transform: i === 0 ? 'scaleY(2.5)' : 'scaleY(1)',
                boxShadow: i === 0 ? TICK_GLOW : TICK_NO_GLOW,
              }}
            />
          ))}
        </div>
        <div
          className="relative w-full"
          style={!staticLayout && narrow ? { minHeight: 230 } : undefined}
        >
          {Panels}
        </div>
      </div>
    </div>
  );

  if (staticLayout) {
    return (
      <section
        id="inside"
        className="chamber-dark relative overflow-hidden py-24 lg:py-28"
        style={{ background: 'var(--color-carbon)' }}
      >
        <div className="shell stack-centre relative">
          <Stamp dark>Ch.01 / 06 — Lubrication — The Protection Layer</Stamp>
          <h2 className="t-display t-h2 mt-6" style={{ color: 'var(--color-eng-white)' }}>
            What is happening inside?
          </h2>
          <p
            className="t-lead mt-6"
            style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-metal-grey)' }}
          >
            Every claim a motor oil makes comes down to one thing: whether a film of liquid can keep
            two pieces of moving steel from touching. Everything else is a consequence of that.
          </p>
          <div className="mt-14 w-full text-center">{Panels}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="inside" ref={wrap} className="chamber-dark relative h-[280vh]">
      {Stage}
    </section>
  );
}
