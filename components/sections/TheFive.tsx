'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { PRODUCTS } from '@/content/products';

/**
 * 03 — The Five. The payoff.
 *
 * The four other products emerge from behind the centre canister and translate
 * outward to their positions, 70ms stagger, outermost last. Leader lines draw
 * downward, then callouts fade up behind them.
 *
 * Display heights follow real relative pack scale, so the line-up reads as a
 * family photo rather than a scaled grid. That is also why they share a common
 * baseline on the ground rule.
 *
 * Mobile: five across does not fit at 375px, so it becomes a 2-up grid.
 *
 * Design: docs/design-snapshots/sections/s03-the-five.png
 */

/** Display order left to right, and the height each render sits at. */
const LINEUP = [
  { id: 'x5-10w30', height: 196, offset: -1 },
  { id: 'x7-diesel-5w30', height: 262, offset: -1 },
  { id: 'x7-5w30', height: 292, offset: 0 },
  { id: 'x3000-15w40', height: 258, offset: 1 },
  { id: 'atf-multi', height: 206, offset: 1 },
] as const;

export default function TheFive() {
  const reduced = useReducedMotion();

  return (
    <section
      id="range"
      className="chamber-dark relative overflow-hidden py-24 lg:py-28"
      style={{ background: 'var(--color-carbon)' }}
    >
      <div className="shell stack-centre">
        <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
          The South African range · Five products · Seven pack sizes
        </p>

        <h2 className="t-display t-h2 mt-6" style={{ color: 'var(--color-eng-white)' }}>
          Five jobs.
        </h2>

        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-metal-grey)' }}
        >
          Everything Parts-Mall Africa actually holds, and nothing it does not.
        </p>

        {/* Line-up */}
        <ul className="mt-16 grid w-full grid-cols-2 gap-x-4 gap-y-12 md:mt-20 md:grid-cols-5 md:items-end md:gap-x-6">
          {LINEUP.map((slot, i) => {
            const product = PRODUCTS.find((p) => p.id === slot.id);
            if (!product) return null;
            const isCentre = slot.offset === 0;

            return (
              <motion.li
                key={product.id}
                className="flex flex-col items-center"
                initial={reduced ? false : { opacity: 0, x: slot.offset * 40, y: 16 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  duration: 0.5,
                  delay: reduced ? 0 : i * 0.07,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                {/* Render, bottom-aligned so the baseline is shared */}
                <div className="flex items-end" style={{ height: slot.height }}>
                  <Image
                    src={product.image}
                    alt={`${product.name} ${product.grade}`}
                    width={620}
                    height={860}
                    sizes="(max-width: 768px) 130px, 200px"
                    style={{ height: slot.height, width: 'auto', opacity: isCentre ? 1 : 0.97 }}
                    className="max-h-full w-auto object-contain"
                  />
                </div>

                {/* Leader line */}
                <div
                  aria-hidden
                  className="mt-4"
                  style={{
                    width: 1,
                    height: isCentre ? 44 : 32,
                    background: isCentre
                      ? 'var(--color-zic-red)'
                      : 'var(--color-deep-steel)',
                  }}
                />
                <div
                  aria-hidden
                  className="rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background: isCentre ? 'var(--color-zic-red)' : 'var(--color-steel-text)',
                  }}
                />

                {/* Callout */}
                <div className="mt-4 text-center">
                  <p
                    className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold tracking-[-0.02em] md:text-[1.1875rem]"
                    style={{ color: 'var(--color-eng-white)' }}
                  >
                    {product.name}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.75rem] font-semibold tracking-[0.06em]"
                    style={{ color: 'var(--color-zic-red)' }}
                  >
                    {product.grade}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.6875rem] leading-[1.5]"
                    style={{ color: 'var(--color-metal-grey)' }}
                  >
                    {product.specification.join(' · ') || product.oilType}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.6875rem] tracking-[0.08em]"
                    style={{ color: 'var(--color-steel-text)' }}
                  >
                    {product.packSizes.join(' · ')}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <p
          className="t-lead mt-16"
          style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-steel-text)', fontSize: '0.9375rem' }}
        >
          Start with the specification your vehicle manufacturer requires. Then match the ZIC
          product.
        </p>
      </div>
    </section>
  );
}
