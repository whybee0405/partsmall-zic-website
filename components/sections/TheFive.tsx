'use client';

import Image from 'next/image';
import { useSiteContent } from '@/components/ContentProvider';
import { HERO_ID, cols, lineup, rangeCounts } from '@/lib/lineup';

/**
 * 03 — The range, static.
 *
 * This is the reduced-motion fallback for the opening sequence. The animated
 * version lives in OpeningSequence.tsx; this renders the same content already
 * resolved, with no reveal, which is exactly what someone who asked for reduced
 * motion should get.
 *
 * Heights follow real relative pack scale so the line-up reads as a family
 * photo rather than a scaled grid.
 *
 * Design: docs/design-snapshots/sections/s03-the-five.png
 */

/** Display height per pack (px), so 1 L, 4 L and 6 L packs keep their relative size. */
const HEIGHT: Record<string, number> = {
  'x5-10w30': 196,
  'x7-diesel-5w30': 262,
  'x7-5w30': 292,
  'x5-diesel-15w40': 258,
  'x3000-15w40': 258,
  'atf-multi': 206,
};
const DEFAULT_HEIGHT = 240;

export default function TheFive({ backdrop = false }: { backdrop?: boolean }) {
  const { PRODUCTS } = useSiteContent();
  const counts = rangeCounts(PRODUCTS);
  const packs = lineup(PRODUCTS);
  return (
    <section
      id="range"
      className="chamber-dark relative overflow-hidden py-24 lg:py-28"
      style={{ background: 'var(--color-carbon)' }}
    >
      {backdrop && (
        <Image
          src="/plates/oil-crown-splash.webp"
          alt=""
          aria-hidden
          width={1200}
          height={822}
          sizes="100vw"
          className="pointer-events-none absolute left-1/2 top-[22%] w-[min(96vw,760px)] -translate-x-1/2"
          style={{ opacity: 0.16 }}
        />
      )}

      <div className="shell stack-centre relative">
        <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
          {counts.products} products · {counts.packs} pack sizes
        </p>

        <h2 className="t-display t-h2 mt-6" style={{ color: 'var(--color-eng-white)' }}>
          The South African range.
        </h2>

        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-metal-grey)' }}
        >
          The SK ZIC line-up Parts-Mall Africa imports today, matched to the specifications this
          market runs.
        </p>

        <ul className={`mt-16 grid w-full grid-cols-2 gap-x-4 gap-y-12 md:mt-20 ${cols(packs.length).md} md:items-end md:gap-x-6`}>
          {packs.map((product) => {
            const isCentre = product.id === HERO_ID;
            const slot = { height: HEIGHT[product.id] ?? DEFAULT_HEIGHT };

            return (
              <li key={product.id} className="flex flex-col items-center">
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

                <div
                  aria-hidden
                  className="mt-4"
                  style={{
                    width: 1,
                    height: isCentre ? 44 : 32,
                    background: isCentre ? 'var(--color-zic-red)' : 'var(--color-deep-steel)',
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

                <div className="mt-4 text-center">
                  <p
                    className="t-display text-[1.0625rem] font-semibold tracking-[-0.02em] md:text-[1.1875rem]"
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
                    {product.shortSpec ?? (product.specification.join(' · ') || product.oilType)}
                  </p>
                  <p
                    className="t-mono mt-1 text-[0.6875rem] tracking-[0.08em]"
                    style={{ color: 'var(--color-steel-text)' }}
                  >
                    {product.packSizes.join(' · ')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <p
          className="t-lead mt-16"
          style={{
            maxWidth: 'var(--measure-lead)',
            color: 'var(--color-steel-text)',
            fontSize: '0.9375rem',
          }}
        >
          Start with the specification your vehicle manufacturer requires. Then match the ZIC
          product.
        </p>
      </div>
    </section>
  );
}
