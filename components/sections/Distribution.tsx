'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { REGIONS, NEIGHBOURING } from '@/content/branches';
import { PRIMARY_CTA, BRANCH_FINDER } from '@/content/cta';
import { Stamp, Cta } from '@/components/ui';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from '@/lib/scroll';

/**
 * 10 — Ch.06. Where to get it.
 *
 * The close. Availability is the reason a workshop owner picks ZIC over an
 * import they wait three weeks for.
 *
 * This is the one chamber in Parts-Mall Africa's own navy: BRAND-DNA is explicit
 * that Parts-Mall is the distribution and access layer, not the visual parent
 * brand, so it steps forward here and nowhere else.
 *
 * The branch counts count up from zero as the row scrolls into view, same
 * device as the YUBASE capacity cells in Ch.02 — a count is the argument
 * here too, not decoration.
 *
 * Design: docs/design-snapshots/sections/s10-ch06-distribution.png
 */
export default function Distribution() {
  const regions = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !regions.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('[data-region-count]');
      cells.forEach((el, i) => {
        const target = Number(el.dataset.target);
        const proxy = { value: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(proxy, {
              value: target,
              duration: 1.4,
              delay: i * 0.06,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = String(Math.round(proxy.value));
              },
            });
          },
        });
      });
    }, regions);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="distribution"
      className="chamber-dark relative overflow-hidden py-24 lg:py-28"
      style={{ background: 'var(--color-pma-navy)' }}
    >
      <Image
        src="/plates/trade-counter.jpg"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        data-plane="0"
        className="object-cover"
        style={{ opacity: 0.26 }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'color-mix(in oklab, var(--color-pma-navy) 84%, transparent)' }}
      />

      <div className="shell stack-centre relative">
        <Stamp dark>Ch.06 / 06 — Distribution — Parts-Mall Africa</Stamp>

        <h2 className="t-display t-h2 mt-6" style={{ color: 'var(--color-pure-white)' }}>
          Forty branches.
          <br />
          Nine provinces. Five countries.
        </h2>

        <p
          className="t-lead mt-8"
          style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-hairline)' }}
        >
          SK ZIC reaches Southern Africa through Parts-Mall Africa, an RMI Approved importer and
          distributor carrying over 17,000 product lines for Korean and Japanese vehicles. The oil is
          engineered in Korea. The stock is on a shelf near you.
        </p>

        <p className="t-label mt-16" style={{ color: 'var(--color-zic-red)' }}>
          [ Branch distribution by region ]
        </p>

        <ul ref={regions} className="mt-8 grid w-full grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {REGIONS.map((r) => (
            <li key={r.name}>
              <div style={{ height: 1, background: 'var(--color-deep-steel)' }} />
              <p
                data-region-count
                data-target={r.count}
                className="t-display mt-4 text-[2.25rem] tracking-[-0.04em] md:text-[2.5rem]"
                style={{ color: 'var(--color-pure-white)' }}
              >
                {r.count}
              </p>
              <p className="t-label mt-1" style={{ color: 'var(--color-metal-grey)' }}>
                {r.name}
              </p>
            </li>
          ))}
        </ul>

        <p className="t-label mt-10" style={{ color: 'var(--color-metal-grey)' }}>
          {NEIGHBOURING}
        </p>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Cta href={PRIMARY_CTA.href} external={PRIMARY_CTA.external}>
            {PRIMARY_CTA.label}
          </Cta>
          <Cta
            href={BRANCH_FINDER.href}
            external
            variant="secondary"
            className="!text-[var(--color-pure-white)]"
          >
            {BRANCH_FINDER.label} →
          </Cta>
        </div>

        <div
          className="mt-14 flex h-[124px] w-[224px] flex-col items-center justify-center gap-2 rounded-[4px] px-6 py-4 text-center"
          style={{ background: 'var(--color-pure-white)', border: '1px solid var(--color-hairline)' }}
        >
          <Image
            src="/brand/RMI%20Approved%20Logo%20-%20160x60px.png"
            alt="RMI Approved"
            width={160}
            height={60}
            className="h-auto w-40"
          />
          <p className="t-label" style={{ color: 'var(--color-deep-steel)' }}>
            RMI Approved Supplier
          </p>
        </div>
      </div>
    </section>
  );
}
