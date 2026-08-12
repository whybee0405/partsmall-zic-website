import Image from 'next/image';
import { Stamp } from '@/components/ui';

/**
 * 05 — Ch.01. What is happening inside?
 *
 * BRAND-DNA's master visual question, answered with the Protection Layer: a
 * glowing oil film between two ground steel surfaces, full bleed. The Film Rail
 * swells to 8px here so the rail and the photograph are the same idea at two
 * scales.
 *
 * Design: docs/design-snapshots/sections/s05-ch01-inside.png
 */

const STATES = [
  {
    n: '01',
    title: 'Fluid film',
    readout: 'FILM: FULL · CONTACT: NONE',
    body: 'The surfaces are completely separated. Wear is close to zero. This is where an engine spends most of its life once warm.',
  },
  {
    n: '02',
    title: 'Boundary',
    readout: 'FILM: MINIMAL · CONTACT: ASPERITY',
    body: 'The film has thinned to almost nothing and the additive layer is all that is left. This is cold start, and it is where most engine wear happens.',
  },
  {
    n: '03',
    title: 'Extreme pressure',
    readout: 'FILM: LOAD-BEARING · CONTACT: CHEMICAL',
    body: 'Under very high load the EP additives bond chemically to the metal and carry what the fluid alone cannot.',
  },
];

export default function Inside() {
  return (
    <section
      id="inside"
      className="chamber-dark relative overflow-hidden py-24 lg:py-28"
      style={{ background: 'var(--color-carbon)' }}
    >
      {/* Full-bleed macro, the oil film landing on the horizontal centre line */}
      <Image
        src="/plates/oil-film-steel.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        data-plane="0"
        className="object-cover"
        style={{ opacity: 0.55 }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(9,11,14,0.94) 0%, rgba(9,11,14,0.66) 46%, rgba(9,11,14,0.95) 100%)',
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

        {/* Space for the film to read before the states */}
        <div aria-hidden className="h-[26vh] min-h-[140px]" />

        <div className="w-full" style={{ height: 1, background: 'var(--color-deep-steel)' }} />

        <ul className="mt-10 grid w-full grid-cols-1 gap-10 text-left md:grid-cols-3">
          {STATES.map((s, i) => {
            const active = i === 0;
            return (
              <li key={s.n}>
                {active && (
                  <div
                    aria-hidden
                    className="mb-6 -mt-10 w-[60%]"
                    style={{ height: 2, background: 'var(--color-zic-red)' }}
                  />
                )}
                <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>
                  {s.n}
                </p>
                <h3
                  className="t-display mt-2 text-[1.375rem] tracking-[-0.02em]"
                  style={{ color: active ? 'var(--color-eng-white)' : 'var(--color-steel-text)' }}
                >
                  {s.title}
                </h3>
                <p
                  className="t-mono mt-2 text-[0.6875rem] tracking-[0.08em]"
                  style={{ color: active ? 'var(--color-zic-red)' : 'var(--color-steel-text)' }}
                >
                  {s.readout}
                </p>
                <p
                  className="mt-3 text-[0.875rem] leading-[1.6]"
                  style={{ color: active ? 'var(--color-metal-grey)' : 'var(--color-steel-text)' }}
                >
                  {s.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
