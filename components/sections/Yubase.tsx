import Image from 'next/image';
import { Stamp } from '@/components/ui';
import { YUBASE_CAPACITY } from '@/content/proof';

/**
 * 06 — Ch.02. Performance begins with the base.
 *
 * The strongest authority fact on the page gets its own chamber: SK Enmove
 * makes the base oil that other lubricant brands buy. Centred stack with a
 * full-bleed image band across the middle.
 *
 * Design: docs/design-snapshots/sections/s06-ch02-yubase.png
 */
export default function Yubase() {
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

      {/* Full-bleed band, breaking the shell on purpose */}
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

        <p className="t-label mt-6" style={{ color: 'var(--color-zic-red)' }}>
          [ YUBASE capacity ]
        </p>
        <p
          className="t-mono mt-2 text-[0.75rem] tracking-[0.04em] md:text-[0.8125rem]"
          style={{ color: 'var(--color-deep-steel)' }}
        >
          {YUBASE_CAPACITY}
        </p>

        <div
          aria-hidden
          className="mt-12"
          style={{ width: 48, height: 2, background: 'var(--color-zic-red)' }}
        />
        <blockquote className="t-display mt-6 text-[1.375rem] tracking-[-0.02em] md:text-[1.625rem]">
          &ldquo;Performance begins with the base.&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
