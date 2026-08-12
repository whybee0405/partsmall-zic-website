import Image from 'next/image';
import { PRIMARY_CTA } from '@/content/cta';
import { Stamp, Cta } from '@/components/ui';

/**
 * 09 — Ch.05. "Multi" does not mean any.
 *
 * An earlier draft argued the Hyundai/Kia SP-III / SP-IV differentiator. South
 * Africa stocks ATF MULTI only, so that would have been selling a product
 * Parts-Mall cannot supply. The honest version is stronger anyway: a brand that
 * puts a warning label on its own multi-vehicle fluid is a brand you can
 * believe about everything else.
 *
 * Design: docs/design-snapshots/sections/s09-ch05-atf-multi.png
 */

const BENEFITS = [
  'Controlled friction',
  'Smooth shifting',
  'Anti-shudder',
  'Oxidation stability',
  'Wear protection',
  'Fluid durability',
];

export default function Transmission() {
  return (
    <section
      id="transmission"
      className="chamber-dark py-24 lg:py-28"
      style={{ background: 'var(--color-graphite)' }}
    >
      <div className="shell stack-centre">
        <Stamp dark>Ch.05 / 06 — Transmission — ZIC ATF MULTI</Stamp>

        <h2 className="t-display t-h2 mt-6" style={{ color: 'var(--color-eng-white)' }}>
          &ldquo;Multi&rdquo; does not mean any.
        </h2>

        <div
          className="mt-8 space-y-6"
          style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-metal-grey)' }}
        >
          <p className="t-lead">
            ZIC ATF MULTI is a fully synthetic multi-vehicle automatic transmission fluid. It covers
            a lot of gearboxes, and that is exactly why it needs a warning label rather than a bigger
            claim.
          </p>
          <p className="t-lead">
            Before you fill, check the ATF specification the transmission actually requires. Put the
            wrong fluid in an automatic and you will be quoting the customer for a gearbox, not an
            oil change.
          </p>
        </div>

        {/* Product panel */}
        <div
          className="mt-14 flex w-full max-w-[720px] flex-col items-center gap-8 rounded-[12px] p-8 text-left md:flex-row md:items-start md:gap-10"
          style={{
            background: 'color-mix(in oklab, var(--color-carbon) 55%, transparent)',
            border: '1px solid var(--color-deep-steel)',
          }}
        >
          <Image
            src="/products/zic-atf-multi-1l.png"
            alt="ZIC ATF MULTI fully synthetic automatic transmission fluid, one litre"
            width={337}
            height={708}
            sizes="152px"
            className="h-auto w-[130px] shrink-0 md:w-[152px]"
          />

          <div className="w-full">
            <h3
              className="t-display text-[1.5rem] font-semibold tracking-[-0.02em]"
              style={{ color: 'var(--color-eng-white)' }}
            >
              ZIC ATF MULTI
            </h3>
            <p className="t-label mt-2" style={{ color: 'var(--color-metal-grey)' }}>
              Fully synthetic multi-vehicle automatic transmission fluid
            </p>

            <div className="my-5" style={{ height: 1, background: 'var(--color-deep-steel)' }} />

            <p className="t-label" style={{ color: 'var(--color-steel-text)' }}>
              Pack size
            </p>
            <p
              className="t-mono mt-1 text-[1.375rem] font-semibold tracking-[0.04em]"
              style={{ color: 'var(--color-eng-white)' }}
            >
              1 L
            </p>

            <div className="my-5" style={{ height: 1, background: 'var(--color-deep-steel)' }} />

            <p className="t-label" style={{ color: 'var(--color-zic-red)' }}>
              Before you fill
            </p>
            <p
              className="mt-2 text-[0.875rem] leading-[1.6]"
              style={{ color: 'var(--color-metal-grey)' }}
            >
              Check the ATF specification your transmission requires. Do not substitute ATF MULTI for
              another ZIC ATF unless the required specification matches.
            </p>
          </div>
        </div>

        <Cta href={PRIMARY_CTA.href} variant="secondary" className="mt-10 !text-[var(--color-eng-white)]">
          Enquire about this fluid →
        </Cta>

        <div className="mt-16 w-full" style={{ height: 1, background: 'var(--color-deep-steel)' }} />

        <p className="t-label mt-6" style={{ color: 'var(--color-zic-red)' }}>
          [ What it does ]
        </p>
        <ul className="mt-4 grid w-full grid-cols-2 gap-4 md:grid-cols-6">
          {BENEFITS.map((b) => (
            <li
              key={b}
              className="text-center text-[0.9375rem]"
              style={{ color: 'var(--color-eng-white)' }}
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
