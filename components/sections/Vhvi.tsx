'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { Stamp } from '@/components/ui';

/**
 * 07 — Ch.03. Stable under change.
 *
 * The centrepiece, and the section that makes this a South African page rather
 * than a translated global one. A real viscosity-vs-temperature chart: the ZIC
 * curve stays close to flat while a conventional base oil diverges at both ends.
 *
 * The chart is a genuine data visualisation, not decoration, which is why it is
 * allowed to be an SVG when the rest of the page uses photography.
 *
 * Design: docs/design-snapshots/sections/s07-ch03-vhvi.png
 */

const STOPS = [
  { at: 0, temp: '−3 °C', scene: 'Highveld winter, 05:40', readout: 'Cold start · boundary lubrication' },
  { at: 0.28, temp: '22 °C', scene: 'Johannesburg stop-start', readout: 'Heat cycling · never steady' },
  { at: 0.74, temp: '90 °C', scene: 'N3 to Durban, loaded', readout: 'Steady state · fluid film' },
  { at: 1, temp: '105 °C', scene: 'Van Reenen’s Pass', readout: 'Peak load · film strength' },
];

export default function Vhvi() {
  const reduced = useReducedMotion();
  const draw = {
    hidden: { pathLength: reduced ? 1 : 0 },
    visible: { pathLength: 1 },
  };

  return (
    <section
      id="vhvi"
      className="chamber-dark relative overflow-hidden py-24 lg:py-28"
      style={{ background: 'var(--color-carbon)' }}
    >
      <Image
        src="/plates/highveld-dawn.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        data-plane="0"
        className="object-cover"
        style={{ opacity: 0.5 }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(9,11,14,0.74) 0%, rgba(9,11,14,0.9) 55%, rgba(9,11,14,0.98) 100%)',
        }}
      />

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

        {/* Chart */}
        <figure className="mt-16 w-full">
          <figcaption className="t-label mb-3 text-left" style={{ color: 'var(--color-steel-text)' }}>
            Viscosity →
          </figcaption>

          <svg
            viewBox="0 0 1280 240"
            className="w-full"
            role="img"
            aria-label="Viscosity against temperature. The ZIC VHVI curve stays close to flat from minus three to one hundred and five degrees, while a conventional base oil starts much thicker when cold and thins much further when hot."
          >
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <line
                key={p}
                x1="0"
                x2="1280"
                y1={240 * p}
                y2={240 * p}
                stroke="var(--color-deep-steel)"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}

            <motion.path
              d="M 0 8 C 320 90 640 168 1280 232"
              fill="none"
              stroke="var(--color-steel-text)"
              strokeWidth="2"
              strokeDasharray="6 6"
              variants={draw}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
            />
            <motion.path
              d="M 0 62 C 320 108 640 138 1280 176"
              fill="none"
              stroke="var(--color-zic-red)"
              strokeWidth="3"
              variants={draw}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.4, delay: 0.15, ease: [0.77, 0, 0.175, 1] }}
            />

            <line x1="0" x2="1280" y1="240" y2="240" stroke="var(--color-metal-grey)" strokeWidth="1" />
            <line x1="1" x2="1" y1="-8" y2="248" stroke="var(--color-zic-red)" strokeWidth="2" />
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

        {/* Scenario stops */}
        <ul className="mt-10 grid w-full grid-cols-2 gap-6 text-left md:grid-cols-4">
          {STOPS.map((s, i) => (
            <li key={s.temp}>
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

        <div
          aria-hidden
          className="mt-16"
          style={{ width: 48, height: 2, background: 'var(--color-zic-red)' }}
        />
        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-eng-white)' }}
        >
          A high viscosity index does not make the oil thicker or thinner. It makes it change less.
          That is the whole argument.
        </p>
      </div>
    </section>
  );
}
