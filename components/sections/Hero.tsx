import Image from 'next/image';
import { PRIMARY_CTA, SECONDARY_CTA } from '@/content/cta';
import { Cta } from '@/components/ui';

/**
 * 01 — Hero. One product, centred.
 *
 * Nothing is off-axis. Depth comes from the three parallax planes, not from
 * layout offset: the ghost wordmark barely moves, the type lags, and the
 * product overtakes the scroll so it reads as nearest.
 *
 * Design: docs/design-snapshots/sections/s01-hero.png
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden py-32 lg:py-40"
      style={{ background: 'var(--color-eng-white)' }}
    >
      {/* Plane 0 — ghost wordmark, barely moves */}
      <span
        aria-hidden
        data-plane="0"
        className="t-display pointer-events-none absolute select-none"
        style={{
          fontSize: 'clamp(11rem, 34vw, 32rem)',
          color: 'var(--color-carbon)',
          opacity: 0.05,
          lineHeight: 0.8,
        }}
      >
        ZIC
      </span>

      <div className="shell relative stack-centre">
        {/* Plane 1 — type, lags the scroll */}
        <div data-plane="1" className="stack-centre">
          <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
            SK ZIC · Distributed across Southern Africa by Parts-Mall Africa
          </p>

          <h1 className="t-display t-h1 mt-6">
            Performance
            <br />
            Starts Within.
          </h1>

          <p
            className="t-lead mt-8"
            style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-deep-steel)' }}
          >
            The world&rsquo;s number one Group III base oil, engineered into motor oil for South
            African conditions.
          </p>
        </div>

        {/* Plane 2 — the product, overtakes the scroll */}
        <div data-plane="2" className="relative mt-12 lg:mt-16">
          <Image
            src="/products/ZIC X7 5W30 4L.png"
            alt="ZIC X7 5W-30 fully synthetic motor oil, four litre pack"
            width={502}
            height={699}
            priority
            sizes="(max-width: 768px) 190px, 320px"
            className="h-auto w-[190px] md:w-[260px] lg:w-[316px]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 -bottom-2 mx-auto h-6 w-4/5 rounded-[50%] blur-lg"
            style={{ background: 'var(--color-carbon)', opacity: 0.14 }}
          />
        </div>

        <p className="t-mono mt-8 text-[0.6875rem] tracking-[0.1em]" style={{ color: 'var(--color-steel-text)' }}>
          ZIC X7 · 5W-30 · FULLY SYNTHETIC · 4 L
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Cta href={PRIMARY_CTA.href} external={PRIMARY_CTA.external}>
            {PRIMARY_CTA.label}
          </Cta>
          <Cta href={SECONDARY_CTA.href} variant="secondary">
            {SECONDARY_CTA.label}
          </Cta>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-10 left-1/2 h-6 w-px -translate-x-1/2"
        style={{ background: 'var(--color-zic-red)' }}
      />
    </section>
  );
}
