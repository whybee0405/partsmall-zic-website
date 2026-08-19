'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GOOGLE_RATING, KBPI } from '@/content/trust';

const STAR_PATH =
  'M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.63l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z';

/**
 * Five-star row, the base row in Hairline and a Red copy clipped to the
 * rating's share of the total width — proportional clipping reads a partial
 * star correctly without hand-drawing a half-star path.
 */
function StarRow({ rating, outOf }: { rating: number; outOf: number }) {
  const pct = Math.max(0, Math.min(1, rating / outOf)) * 100;
  // w-max: without an explicit width, this row (a block-level flex
  // container) stretches to fill its parent's width. That's invisible for
  // the base row, but the red overlay row's parent is deliberately narrowed
  // to `pct%` to create the clip window — without w-max, the row itself
  // shrank to match, so flexbox squeezed all five stars narrower instead of
  // the overlay's overflow:hidden cleanly clipping a full-size row.
  const stars = (color: string) => (
    <div className="flex w-max gap-[2px]">
      {Array.from({ length: outOf }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="13" height="13">
          <path d={STAR_PATH} fill={color} />
        </svg>
      ))}
    </div>
  );
  return (
    <div className="relative inline-flex" aria-hidden>
      {stars('var(--color-hairline)')}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {stars('var(--color-zic-red)')}
      </div>
    </div>
  );
}

/**
 * A slim strip fixed directly under the nav, visible only at the very top of
 * the page.
 *
 * Deliberately fixed rather than sitting in normal flow above OpeningSequence:
 * that stage is a `100dvh` sticky box, and any real document height placed
 * ahead of it delays when it pins, so on first load the whole hero — canister,
 * CTAs, all of it — sat shifted down by this strip's own height and ran off
 * the bottom of the viewport. Fixed positioning keeps the stage's box exactly
 * `100dvh`; its own `--nav-clearance`-based top offset (already reserved for
 * the nav) is what folds this strip's height in, so the hero text drops just
 * far enough to clear both without anything overflowing.
 *
 * Fades out within the first ~30px of scroll rather than persisting: the
 * hero's background flips from Engineering White to Carbon within roughly
 * the first third of a viewport of scroll (OpeningSequence's Act 1), and a
 * white strip fixed on top of that dark chamber for the rest of the pinned
 * sequence would clash rather than read as chrome.
 */
export default function TrustBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const read = () => setVisible(window.scrollY < 30);
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 z-[35] flex justify-center"
      style={{
        top: 'var(--nav-height)',
        background: 'var(--color-eng-white)',
        borderBottom: '1px solid var(--color-hairline)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 220ms var(--ease-out), transform 220ms var(--ease-out)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* flex-col below sm. Sharing a left edge (items-start) wasn't enough
          on its own: the three icons have very different natural widths
          (numeral ~23px, RMI logo ~53px, star row ~73px), so even with a
          shared left edge the *text* after each icon still started at three
          different x positions — the actual thing a "list" needs to line up.
          Each row below is its own [80px_1fr] grid on mobile (80px comfortably
          fits the widest icon, and is a step on BRAND-DNA's spacing scale),
          so every label starts at the same x regardless of its icon's width.
          sm: and up drops back to the original flex row — that layout
          already read cleanly once there's room for one line per item. */}
      <div className="shell flex w-full flex-col items-start justify-center gap-y-2 py-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:py-3">
        {/* SK ZIC's own standing, not the distributor's — leads, since it's
            the strongest and most directly on-brand of the three. */}
        <a
          href={KBPI.href}
          target="_blank"
          rel="noopener noreferrer"
          className="grid w-full grid-cols-[80px_1fr] items-center gap-x-2 sm:flex sm:w-auto sm:gap-2"
        >
          <span
            className="justify-self-start t-display text-[1.25rem] leading-none tracking-[-0.02em] sm:text-[1.375rem]"
            style={{ color: 'var(--color-zic-red)' }}
          >
            {KBPI.years}
          </span>
          {/* fontSize inline, not a text-[9px] class: .t-label's own
              font-size (0.625rem = 10px) sits later in the compiled
              stylesheet than Tailwind's utility layer here, so a same-
              specificity class-based override silently lost — confirmed by
              checking the computed style, still 10px. Inline style always
              wins. At 10px, this is the one label of the three that didn't
              fit its 247px column on one line (needed 266px) — wanted as a
              single line like the other two rows, not wrapped. 9px closes
              that with ~7px to spare; applied to all three labels below,
              not just this one, so the list still reads as one consistent
              size. Still no whitespace-nowrap: if it's ever a hair short
              again (zoom, a font substitution), wrapping is the graceful
              fallback, not a hard clip. */}
          <span className="t-label text-left" style={{ color: 'var(--color-steel-text)', fontSize: '9px' }}>
            Years &middot; <span style={{ color: 'var(--color-carbon)' }}>{KBPI.index} No.1</span>
          </span>
        </a>

        <div aria-hidden className="hidden h-4 w-px sm:block" style={{ background: 'var(--color-hairline)' }} />

        <div className="grid w-full grid-cols-[80px_1fr] items-center gap-x-2 sm:flex sm:w-auto sm:gap-2">
          <Image
            src="/brand/RMI%20Approved%20Logo%20-%20160x60px.png"
            alt="RMI Approved"
            width={160}
            height={60}
            className="justify-self-start h-5 w-auto sm:h-6"
          />
          <span className="t-label whitespace-nowrap" style={{ color: 'var(--color-steel-text)', fontSize: '9px' }}>
            Approved supplier
          </span>
        </div>

        <div aria-hidden className="hidden h-4 w-px sm:block" style={{ background: 'var(--color-hairline)' }} />

        {/* This one is about the distributor's service, not the oil, so the
            entity is named rather than left implicit in the link target. */}
        <a
          href={GOOGLE_RATING.href}
          target="_blank"
          rel="noopener noreferrer"
          className="grid w-full grid-cols-[80px_1fr] items-center gap-x-2 sm:flex sm:w-auto sm:gap-2"
        >
          <span className="justify-self-start">
            <StarRow rating={GOOGLE_RATING.score} outOf={GOOGLE_RATING.outOf} />
          </span>
          {/* Entity name (Parts-Mall Africa) dropped: not needed here, and
              this trust strip has three items competing for a compact
              mobile row already. No whitespace-nowrap regardless — this
              class of label has overflowed before at other lengths, and the
              grid column keeps a wrapped second line aligned if it ever
              does again. */}
          <span className="t-label" style={{ color: 'var(--color-carbon)', fontSize: '9px' }}>
            {GOOGLE_RATING.score}
            <span style={{ color: 'var(--color-steel-text)' }}>
              {' '}
              &middot; {GOOGLE_RATING.count} reviews
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
