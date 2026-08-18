import Image from 'next/image';

/**
 * 02 — The Splash. The transformation moment.
 *
 * The canister sits inside the crown so the product reads as rising out of the
 * oil rather than floating above a graphic. Splash on plane 1, product on plane
 * 2, so the two separate as you scroll.
 *
 * This is the only place the page goes fully theatrical, and it earns the dark
 * chamber because the darkness is what reveals the oil.
 *
 * Design: docs/design-snapshots/sections/s02-splash.png
 */
export default function Splash() {
  return (
    <section
      id="splash"
      className="chamber-dark relative overflow-hidden py-24 lg:py-28"
      style={{ background: 'var(--color-carbon)' }}
    >
      <div className="shell stack-centre relative">
        <p className="t-stamp" style={{ color: 'var(--color-steel-text)' }}>
          The transition
        </p>

        <h2
          className="t-display t-h2 mt-6"
          style={{ color: 'var(--color-eng-white)' }}
          data-plane="1"
        >
          One engineering standard.
        </h2>

        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-metal-grey)' }}
          data-plane="1"
        >
          The same base oil, the same additive discipline, the same laboratory. What changes is the
          job it is asked to do.
        </p>

        {/* Artwork block. Splash and product overlap deliberately. */}
        <div className="relative mt-10 flex w-full items-end justify-center">
          <Image
            src="/plates/oil-crown-splash.png"
            alt=""
            aria-hidden
            width={1200}
            height={822}
            data-plane="1"
            sizes="(max-width: 768px) 400px, 820px"
            className="h-auto w-[400px] max-w-none md:w-[640px] lg:w-[820px]"
          />
          <div
            data-plane="2"
            className="absolute bottom-[26%] left-1/2 -translate-x-1/2 md:bottom-[28%]"
          >
            <Image
              src="/products/ZIC X7 5W30 4L.png"
              alt="ZIC X7 5W-30 rising from an oil crown splash"
              width={502}
              height={699}
              sizes="(max-width: 768px) 150px, 273px"
              className="h-auto w-[150px] md:w-[220px] lg:w-[273px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
