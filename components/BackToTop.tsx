'use client';

import { useEffect, useState } from 'react';
import type Lenis from 'lenis';

/**
 * Floating scroll button, right side, vertically centred.
 *
 * One control, two modes, rather than a separate hero "scroll down" cue plus
 * a separate "back to top" button: at the top of the page it points down and
 * pages the viewport forward; past the flip threshold it points up and jumps
 * home. The hero used to carry its own scroll-down cue in the same visual
 * language, but with the bottle sized to fill the hero the two were fighting
 * for the same space, so this replaces it rather than duplicating it.
 *
 * Kept off the bottom-right corner — that's reserved for a chat launcher
 * later, and the two would otherwise stack.
 *
 * Jumps instantly rather than animating the scroll: the page runs a heavy
 * pinned/scrubbed parallax rig, and an eased scroll fighting that rig reads
 * as janky rather than smooth (see Nav's anchor links, which teleport for
 * the same reason). If Lenis is mounted the jump still routes through
 * `lenis.scrollTo` so its internal target stays in sync — a raw
 * `window.scrollTo` leaves Lenis believing it's still at the old position
 * and it animates straight back.
 */
export default function BackToTop() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let frame = 0;
    const read = () => setAtTop(window.scrollY < window.innerHeight * 0.75);

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

  const handleClick = () => {
    const target = atTop ? window.scrollY + window.innerHeight : 0;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: target, behavior: 'auto' });
    }
  };

  return (
    <div
      className="fixed z-40"
      style={{
        right: 'max(1.25rem, env(safe-area-inset-right))',
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'opacity 220ms var(--ease-out)',
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={atTop ? 'Scroll down' : 'Back to top'}
        className="flex h-16 w-14 flex-col items-center justify-center gap-1 rounded-full border
          bg-[var(--color-carbon)] border-[var(--color-deep-steel)]
          transition-all duration-200 ease-[var(--ease-out)]
          hover:scale-105 hover:bg-[var(--color-zic-red)] hover:border-[var(--color-zic-red)]
          active:scale-95"
        style={{ color: 'var(--color-eng-white)', boxShadow: '0 8px 24px rgba(9, 11, 14, 0.32)' }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          aria-hidden="true"
          style={{
            animation: `${atTop ? 'scroll-cue-bob' : 'back-to-top-bob'} 1.8s var(--ease-in-out) infinite`,
          }}
        >
          <path
            d={atTop ? 'M9 3.5V14.5M9 14.5L3.5 9M9 14.5 14.5 9' : 'M9 14.5V3.5M9 3.5L3.5 9M9 3.5 14.5 9'}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="t-mono text-[0.5625rem] uppercase tracking-[0.2em]">
          {atTop ? 'Down' : 'Top'}
        </span>
      </button>
    </div>
  );
}
