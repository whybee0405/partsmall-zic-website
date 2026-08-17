'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Stamp } from '@/components/ui';
import { YUBASE_CAPACITY } from '@/content/proof';
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from '@/lib/scroll';

/**
 * 06 — Ch.02. Performance begins with the base.
 *
 * The strongest authority fact on the page gets its own chamber: SK Enmove
 * makes the base oil that other lubricant brands buy. Centred stack with a
 * full-bleed image band across the middle.
 *
 * Three things this chapter used to get wrong, all fixed here:
 *
 * 1. The capacity figures — the actual evidence for "35% of world supply" —
 *    were a single dense mono line, the same visual weight as a footnote.
 *    They now use the same big-number-over-label pattern as the branch
 *    counts in Distribution (Ch.06), because these are the same kind of
 *    fact: a count that is the argument, not colour around it.
 * 2. The closing line repeated the H2 verbatim ("Performance begins with
 *    the base." twice). Removed rather than replaced with invented copy —
 *    a design pass isn't licence to write new marketing claims.
 * 3. A scroll-linked Ken Burns pan on the vortex image (tried first) didn't
 *    earn its place: the image is decorative, so moving it just moved
 *    decoration. The numbers are the actual content, so the motion moved
 *    there instead — each count-up from zero once it scrolls into view.
 *
 * Design: docs/design-snapshots/sections/s06-ch02-yubase.png (pull-quote
 * and capacity line are superseded by the changes above).
 */

/** Splits "48,600 b/d" into a numeric target (48600) and a suffix (" b/d"). */
function splitAmount(amount: string): { target: number; suffix: string } {
  const match = amount.match(/^([\d,]+)(.*)$/);
  if (!match) return { target: 0, suffix: '' };
  return { target: Number(match[1].replace(/,/g, '')), suffix: match[2] };
}

export default function Yubase() {
  const stats = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !stats.current) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('[data-capacity-value]');
      cells.forEach((el, i) => {
        const target = Number(el.dataset.target);
        const suffix = el.dataset.suffix ?? '';
        const proxy = { value: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(proxy, {
              value: target,
              duration: 1.4,
              delay: i * 0.15,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(proxy.value).toLocaleString('en-US') + suffix;
              },
            });
          },
        });
      });
    }, stats);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="yubase"
      className="relative overflow-hidden"
      style={{ background: 'var(--color-eng-white)' }}
    >
      <div className="shell stack-centre pt-24 lg:pt-28">
        <Stamp>Ch.02 / 06 — YUBASE — Group III base oil</Stamp>

        <h2 className="t-display t-h2 mt-6">Performance begins with the base.</h2>

        <div
          className="mt-10 space-y-6"
          style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-deep-steel)' }}
        >
          <p className="t-lead">
            A finished motor oil is base oil plus additives, and the base oil is most of it.
            Conventional Group I and Group II base oils still carry the sulphur, aromatics and wax
            left over from crude. Those are the parts that oxidise, thicken and turn into sludge.
          </p>
          <p className="t-lead">
            YUBASE is SK Enmove&rsquo;s Group III base oil, hydrocracked and hydroisomerised until
            those impurities are gone. SK Enmove does not buy this base oil. It makes it, at roughly
            35% of world supply, and sells it to other lubricant brands.
          </p>
        </div>
      </div>

      {/* Full-bleed band, breaking the shell on purpose. Static — the motion
          budget for this chapter belongs to the numbers below, not to
          decoration. */}
      <div className="relative mt-16 h-[280px] w-full md:h-[360px]">
        <Image
          src="/plates/oil-vortex.jpg"
          alt="Amber motor oil turning in a slow vortex, lit against carbon black"
          fill
          sizes="100vw"
          data-plane="0"
          className="object-cover"
        />
      </div>

      <div className="shell stack-centre pb-24 lg:pb-28">
        <div className="mt-16 w-full" style={{ height: 1, background: 'var(--color-hairline)' }} />

        <p className="t-label mt-10" style={{ color: 'var(--color-zic-red)' }}>
          [ YUBASE capacity ]
        </p>

        <ul ref={stats} className="mt-6 grid w-full grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-3">
          {YUBASE_CAPACITY.map((cell, i) => {
            const { target, suffix } = splitAmount(cell.amount);
            return (
              <li
                key={cell.site}
                className="sm:pl-6"
                style={{ borderLeft: i > 0 ? '1px solid var(--color-hairline)' : undefined }}
              >
                <p
                  data-capacity-value
                  data-target={target}
                  data-suffix={suffix}
                  className="t-display text-[2rem] tracking-[-0.03em] md:text-[2.25rem]"
                  style={{ color: 'var(--color-carbon)' }}
                >
                  {cell.amount}
                </p>
                <p className="t-label mt-1" style={{ color: 'var(--color-steel-text)' }}>
                  {cell.site}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
