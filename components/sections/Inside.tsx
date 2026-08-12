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
 * The three lubrication states cross-fade in one place as you scroll, and the
 * oil film in the photograph thins with them. That coupling is the point: the
 * copy says the film thins at boundary lubrication, and the film thins.
 *
 * Design: docs/design-snapshots/sections/s05-ch01-inside.png
 */

const STATES = [
  {
    n: '01',
    title: 'Fluid film',
    readout: 'FILM: FULL · CONTACT: NONE',
    body: 'The surfaces are completely separated. Wear is close to zero. This is where an engine spends most of its life once warm.',
    /** Vertical squeeze applied to the film in the photograph. */
    film: 1,
  },
  {
    n: '02',
    title: 'Boundary',
    readout: 'FILM: MINIMAL · CONTACT: ASPERITY',
    body: 'The film has thinned to almost nothing and the additive layer is all that is left. This is cold start, and it is where most engine wear happens.',
    film: 0.42,
  },
  {
    n: '03',
    title: 'Extreme pressure',
    readout: 'FILM: LOAD-BEARING · CONTACT: CHEMICAL',
    body: 'Under very high load the EP additives bond chemically to the metal and carry what the fluid alone cannot.',
    film: 0.72,
  },
];

export default function Inside() {
  const [reduced, setReduced] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduced || prefersReducedMotion() || !wrap.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-state-panel]');
      const ticks = gsap.utils.toArray<HTMLElement>('[data-state-tick]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      });

      // Each state holds, then hands over. Three equal beats across the scrub.
      STATES.forEach((s, i) => {
        const at = i / STATES.length;
        const span = 1 / STATES.length;

        if (i > 0) {
          tl.to(panels[i - 1], { opacity: 0, y: -20, duration: span * 0.3 }, at)
            .to(ticks[i - 1], { backgroundColor: '#2a3037', duration: span * 0.3 }, at)
            .fromTo(
              panels[i],
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: span * 0.3 },
              at + span * 0.15
            )
            .to(ticks[i], { backgroundColor: '#e31e24', duration: span * 0.3 }, at + span * 0.15);
        }

        // The film in the photograph tracks the state being described.
        tl.to(plate.current, { scaleY: s.film, duration: span * 0.4 }, at + span * 0.1);
      });
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  const Panels = (
    <ul className="relative w-full">
      {STATES.map((s, i) => (
        <li
          key={s.n}
          data-state-panel
          className={reduced ? 'mb-10 last:mb-0' : 'absolute inset-x-0 top-0'}
          style={reduced ? undefined : { opacity: i === 0 ? 1 : 0 }}
        >
          <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>
            {s.n} / 03
          </p>
          <h3
            className="t-display mt-2 text-[1.5rem] tracking-[-0.02em] md:text-[1.75rem]"
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
  );

  const Stage = (
    <div className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden">
      {/* Full-bleed macro. The film sits on the horizontal centre line. */}
      <div ref={plate} aria-hidden className="absolute inset-0 origin-center">
        <Image
          src="/plates/oil-film-steel.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: 0.6 }}
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(9,11,14,0.95) 0%, rgba(9,11,14,0.6) 46%, rgba(9,11,14,0.96) 100%)',
        }}
      />

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
      </div>

      {/* State track */}
      <div className="shell absolute inset-x-0 bottom-[8%] flex flex-col items-center text-center">
        <div className="mb-8 flex gap-2" aria-hidden>
          {STATES.map((s, i) => (
            <span
              key={s.n}
              data-state-tick
              style={{
                width: 34,
                height: 2,
                backgroundColor: i === 0 ? '#e31e24' : '#2a3037',
              }}
            />
          ))}
        </div>
        <div className="relative min-h-[220px] w-full">{Panels}</div>
      </div>
    </div>
  );

  if (reduced) {
    return (
      <section
        id="inside"
        className="chamber-dark relative overflow-hidden py-24 lg:py-28"
        style={{ background: 'var(--color-carbon)' }}
      >
        <Image
          src="/plates/oil-film-steel.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: 0.5 }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'rgba(9,11,14,0.88)' }}
        />
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
    <section id="inside" ref={wrap} className="chamber-dark relative h-[240vh] md:h-[280vh]">
      <div className="sticky top-0">{Stage}</div>
    </section>
  );
}
