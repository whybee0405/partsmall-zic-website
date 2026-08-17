'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/scroll';
import { Stamp } from '@/components/ui';

/**
 * 07 — Ch.03. Stable under change.
 *
 * The centrepiece, and the section that makes this a South African page rather
 * than a translated global one.
 *
 * Scroll drives a readout head across a temperature axis from a Highveld winter
 * morning to a loaded climb up Van Reenen's. Both curves draw as it travels;
 * the ZIC line stays close to flat while a conventional base oil diverges hard
 * at both ends. That divergence is the entire argument for viscosity index, so
 * it is drawn rather than asserted.
 *
 * The chart is a genuine data visualisation, which is why it is allowed to be
 * an SVG on a page that otherwise bans drawn graphics. The stops grid is
 * already responsive (2 columns below `md`, 4 above), so unlike Ch.01 this
 * section needs no separate mobile layout — the same pin and the same scrub
 * timeline run at every width down to the height floor below.
 *
 * Design: docs/design-snapshots/sections/s07-ch03-vhvi.png
 */

const STOPS = [
  { at: 0, temp: '−3 °C', scene: 'Highveld winter, 05:40', readout: 'Cold start · boundary lubrication' },
  { at: 0.28, temp: '22 °C', scene: 'Johannesburg stop-start', readout: 'Heat cycling · never steady' },
  { at: 0.74, temp: '90 °C', scene: 'N3 to Durban, loaded', readout: 'Steady state · fluid film' },
  { at: 1, temp: '105 °C', scene: 'Van Reenen’s Pass', readout: 'Peak load · film strength' },
];

const W = 1280;
const H = 240;
const ZIC_PATH = 'M 0 62 C 320 108 640 138 1280 176';
const CONV_PATH = 'M 0 8 C 320 90 640 168 1280 232';

export default function Vhvi() {
  const [reduced, setReduced] = useState(false);
  // Disables the animation entirely: a landscape phone is too short for the
  // pinned stage to fit the chart and the stops without clipping. Unlike
  // Ch.01, there is no separate narrow-width layout — the stops grid is
  // already responsive CSS, so width alone never forces the static fallback.
  const [tooShort, setTooShort] = useState(false);
  // See Inside.tsx for why the GSAP effect is withheld until this is true:
  // GSAP's `pin` restructures the DOM, and mounting it on a stale first
  // render that's about to flip to the static branch crashes on teardown.
  const [ready, setReady] = useState(false);
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const zicPath = useRef<SVGPathElement>(null);
  const convPath = useRef<SVGPathElement>(null);
  const head = useRef<SVGLineElement>(null);
  const photo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortQuery = window.matchMedia('(max-height: 560px)');
    const sync = () => {
      setReduced(motion.matches);
      setTooShort(shortQuery.matches);
      setReady(true);
    };
    sync();
    motion.addEventListener('change', sync);
    shortQuery.addEventListener('change', sync);
    return () => {
      motion.removeEventListener('change', sync);
      shortQuery.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!ready || reduced || tooShort || prefersReducedMotion() || !wrap.current || !stage.current) {
      return;
    }
    registerGsap();

    const ctx = gsap.context(() => {
      const stops = gsap.utils.toArray<HTMLElement>('[data-stop]');

      // Pinning via GSAP (not CSS `position: sticky`), matching Ch.01: sticky
      // against a fixed container height releases as soon as
      // (containerHeight − stageHeight) of scroll has passed — for a 100dvh
      // stage in a 300vh section that is 67% of the way through, so the
      // last stop below was already firing while the section scrolled away
      // unpinned. Distance matches the static `h-[260vh] md:h-[300vh]`
      // fallback below, so there is no jump if this effect is slow to mount.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (window.innerWidth >= 768 ? 2 : 1.6))}`,
          pin: stage.current,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });

      // Curves draw ahead of the head so it always travels over drawn line.
      // Plain stroke-dashoffset, not GSAP's DrawSVG: that plugin is paid, and
      // measuring the path ourselves costs one getTotalLength() call.
      for (const path of [convPath.current, zicPath.current]) {
        if (!path) continue;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(path, { strokeDashoffset: 0, duration: 0.85 }, 0);
      }

      // Readout head travels the full axis.
      tl.fromTo(head.current, { attr: { x1: 1, x2: 1 } }, { attr: { x1: W, x2: W }, duration: 1 }, 0);

      // The Highveld photograph belongs to the cold end and leaves with it.
      tl.to(photo.current, { opacity: 0.12, duration: 0.4 }, 0.15);

      // Scenario stops light up as the head passes them.
      stops.forEach((el, i) => {
        const at = STOPS[i].at;
        tl.to(el, { opacity: 1, duration: 0.06 }, Math.max(0, at - 0.04));
        if (i < STOPS.length - 1) {
          tl.to(el, { opacity: 0.4, duration: 0.06 }, STOPS[i + 1].at - 0.04);
        }
      });

      // The stop positions above are authored as fractions of 1, but the
      // tweens' natural total (curve draws end at 0.85, the last stop's
      // fade-in tween ends at ~1.02) doesn't land on exactly 1. Rescaling to
      // an explicit duration of 1 timeScales every child proportionally, so
      // scroll-progress 0–1 lines up with the fractions as authored instead
      // of drifting a couple of percent by the end.
      tl.duration(1);
    }, wrap);

    return () => ctx.revert();
  }, [ready, reduced, tooShort]);

  const staticLayout = reduced || tooShort;

  const Chart = (
    <figure className="mt-12 w-full">
      <figcaption className="t-label mb-3 text-left" style={{ color: 'var(--color-steel-text)' }}>
        Viscosity →
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Viscosity against temperature from minus three to one hundred and five degrees Celsius. The ZIC VHVI curve stays close to flat across the whole range. A conventional base oil starts far thicker when cold and thins far further when hot."
      >
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1="0"
            x2={W}
            y1={H * p}
            y2={H * p}
            stroke="var(--color-deep-steel)"
            strokeWidth="1"
            opacity="0.6"
          />
        ))}

        <path
          ref={convPath}
          d={CONV_PATH}
          fill="none"
          stroke="var(--color-steel-text)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path ref={zicPath} d={ZIC_PATH} fill="none" stroke="var(--color-zic-red)" strokeWidth="3" />

        <line x1="0" x2={W} y1={H} y2={H} stroke="var(--color-metal-grey)" strokeWidth="1" />
        <line
          ref={head}
          x1="1"
          x2="1"
          y1="-10"
          y2={H + 12}
          stroke="var(--color-zic-red)"
          strokeWidth="2"
        />
      </svg>

      <div className="mt-3 flex justify-end gap-6">
        <span className="t-mono text-[0.6875rem]" style={{ color: 'var(--color-zic-red)' }}>
          —— ZIC VHVI
        </span>
        <span className="t-mono text-[0.6875rem]" style={{ color: 'var(--color-steel-text)' }}>
          - - Conventional
        </span>
      </div>
    </figure>
  );

  const Stops = (
    <ul className="mt-10 grid w-full grid-cols-2 gap-6 text-left md:grid-cols-4">
      {STOPS.map((s, i) => (
        <li key={s.temp} data-stop style={{ opacity: staticLayout ? 1 : i === 0 ? 1 : 0.4 }}>
          <p
            className="t-mono text-[0.9375rem] font-semibold"
            style={{ color: i === 0 ? 'var(--color-zic-red)' : 'var(--color-eng-white)' }}
          >
            {s.temp}
          </p>
          <p className="t-label mt-2" style={{ color: 'var(--color-metal-grey)' }}>
            {s.scene}
          </p>
          <p className="t-label mt-1" style={{ color: 'var(--color-steel-text)' }}>
            {s.readout}
          </p>
        </li>
      ))}
    </ul>
  );

  const Body = (
    <div className="shell stack-centre relative">
      <Stamp dark>Ch.03 / 06 — VHVI Technology — Viscosity index</Stamp>
      <h2 className="t-display t-h2 mt-6" style={{ color: 'var(--color-eng-white)' }}>
        Stable under change.
      </h2>
      <p
        className="t-lead mt-6"
        style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-metal-grey)' }}
      >
        A South African engine can see minus three degrees on a Highveld winter morning and a
        hundred and five degree sump on the N3 to Durban in the same week. Viscosity index is the
        measure of how little the oil cares.
      </p>
      {Chart}
      {Stops}
      <div
        aria-hidden
        className="mt-12"
        style={{ width: 48, height: 2, background: 'var(--color-zic-red)' }}
      />
      <p
        className="t-lead mt-5"
        style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-eng-white)' }}
      >
        A high viscosity index does not make the oil thicker or thinner. It makes it change less.
        That is the whole argument.
      </p>
    </div>
  );

  const Backdrop = (
    <>
      <div ref={photo} aria-hidden className="absolute inset-0">
        <Image
          src="/plates/highveld-dawn.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: 0.5 }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(9,11,14,0.76) 0%, rgba(9,11,14,0.92) 55%, rgba(9,11,14,0.99) 100%)',
        }}
      />
    </>
  );

  if (staticLayout) {
    return (
      <section
        id="vhvi"
        className="chamber-dark relative overflow-hidden py-24 lg:py-28"
        style={{ background: 'var(--color-carbon)' }}
      >
        {Backdrop}
        {Body}
      </section>
    );
  }

  return (
    <section id="vhvi" ref={wrap} className="chamber-dark relative h-[260vh] md:h-[300vh]">
      <div
        ref={stage}
        className="relative flex h-[100dvh] items-center overflow-hidden pt-[72px]"
        style={{ background: 'var(--color-carbon)' }}
      >
        {Backdrop}
        {Body}
      </div>
    </section>
  );
}
