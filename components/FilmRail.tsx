'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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
  const [active, setActive] = useState(0);
  const mobileFill = useRef<HTMLDivElement>(null);
  const desktopFill = useRef<HTMLDivElement>(null);
  const bounds = useRef<{ top: number; height: number }[]>([]);
  const lastActive = useRef(0);

  useEffect(() => {
    const measure = () =>
      SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return { top: 0, height: 0 };
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, height: r.height };
      });

    bounds.current = measure();

    // Written straight to the fill elements' transform on GSAP's ticker —
    // the same loop that drives Lenis — every frame, rather than through
    // React state plus a CSS width/height transition. That round trip (and
    // the layout cost of animating width/height at all) is what read as
    // stutter against a scroll that is otherwise smoothed to the frame.
    const tick = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      if (mobileFill.current) mobileFill.current.style.transform = `scaleX(${progress})`;
      if (desktopFill.current) desktopFill.current.style.transform = `scaleY(${progress})`;

      const probe = y + window.innerHeight * 0.4;
      let idx = 0;
      for (let i = 0; i < bounds.current.length; i++) {
        if (probe >= bounds.current[i].top) idx = i;
      }
      if (idx !== lastActive.current) {
        lastActive.current = idx;
        setActive(idx);
      }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        bounds.current = measure();
      }, 120);
    };

    tick();
    gsap.ticker.add(tick);
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const current = SECTIONS[active] ?? SECTIONS[0];
  // Deep Steel on Carbon is all but invisible, which left the red column
  // standing on its own down the edge of every dark chamber and reading as a
  // stray rule rather than as fluid held between two walls. The walls have to
  // be visible for the cross-section to be legible as one.
  const hairline = current.dark ? 'rgba(169, 173, 178, 0.5)' : 'var(--color-hairline)';

  return (
    <>
      {/* Mobile: top progress bar, sitting just under the 72px nav rather
          than over it. z-30 keeps it under the nav's z-40, so the mobile
          sheet's near-opaque background (which occupies this same strip
          while open) still paints over it instead of the bar cutting a red
          line across the open menu. */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-[var(--nav-height)] z-30 lg:hidden"
        style={{ height: 'var(--nav-bar-height)' }}
      >
        <div style={{ height: 1, background: hairline }} />
        <div
          ref={mobileFill}
          style={{
            height: 3,
            width: '100%',
            background: 'var(--color-zic-red)',
            transform: 'scaleX(0)',
            transformOrigin: '0 0',
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
          {/* The column fills to the scroll position rather than running the
              full height. Full height read as a rule someone had left behind;
              filling reads as what it is, and the mobile half of this same
              component was already a progress bar. */}
          <div
            className="relative"
            style={{
              width: current.film,
              transition: 'width 420ms var(--ease-in-out)',
            }}
          >
            <div
              ref={desktopFill}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'var(--color-zic-red)',
                transform: 'scaleY(0)',
                transformOrigin: '0 0',
                transition: 'opacity 300ms var(--ease-out)',
                opacity: current.film === 0 ? 0 : 1,
              }}
            />
          </div>
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
