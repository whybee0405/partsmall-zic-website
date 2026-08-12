'use client';

import { useEffect, useRef, useState } from 'react';
import { SECTIONS } from '@/content/sections';

/**
 * The Film Rail.
 *
 * BRAND-DNA's "Protection Layer" made structural: two metal hairlines with a
 * ZIC Red fluid column between them, in cross-section down the left edge. The
 * column's thickness is driven by chapter meaning, not by decoration, so it
 * thins at boundary lubrication and swells at fluid film.
 *
 * It is the page's progress indicator, its chapter index and its brand device
 * in one object. aria-hidden, because the chapter anchors in the nav are the
 * real navigation.
 *
 * Desktop: fixed left edge with chapter ticks.
 * Mobile:  3px top progress bar, no ticks.
 */
export default function FilmRail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const measure = () =>
      SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return { top: 0, height: 0 };
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, height: r.height };
      });

    let bounds = measure();

    const read = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);

      const probe = y + window.innerHeight * 0.4;
      let idx = 0;
      for (let i = 0; i < bounds.length; i++) {
        if (probe >= bounds[i].top) idx = i;
      }
      setActive(idx);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(read);
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        bounds = measure();
        read();
      }, 120);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const current = SECTIONS[active] ?? SECTIONS[0];
  const hairline = current.dark ? 'var(--color-deep-steel)' : 'var(--color-hairline)';

  return (
    <>
      {/* Mobile: top progress bar */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 lg:hidden"
        style={{ height: 5 }}
      >
        <div style={{ height: 1, background: hairline }} />
        <div
          style={{
            height: 3,
            width: `${progress * 100}%`,
            background: 'var(--color-zic-red)',
            transition: 'width 90ms linear',
          }}
        />
        <div style={{ height: 1, background: hairline }} />
      </div>

      {/* Desktop: left-edge cross-section */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-[34px] z-50 hidden lg:block"
      >
        <div className="relative flex h-full items-stretch">
          <div style={{ width: 1, background: hairline }} />
          <div
            style={{
              width: current.film,
              background: 'var(--color-zic-red)',
              transition:
                'width 420ms var(--ease-in-out), opacity 300ms var(--ease-out)',
              opacity: current.film === 0 ? 0 : 1,
            }}
          />
          <div style={{ width: 1, background: hairline }} />

          {/* Chapter tick for the current chamber */}
          {current.tick && (
            <span
              className="t-label absolute left-6 top-1/2 -translate-y-1/2"
              style={{ color: current.dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)' }}
            >
              {current.tick}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
