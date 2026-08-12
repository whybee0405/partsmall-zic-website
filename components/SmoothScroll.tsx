'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { createParallax } from '@/lib/parallax';

/**
 * Owns the scroll. Lenis drives it, the parallax loop reads from it.
 *
 * Lenis is skipped entirely under prefers-reduced-motion so the page falls back
 * to native scrolling, which is what someone with vestibular sensitivity wants.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parallax = createParallax();

    if (reduced) {
      parallax.mount(); // no-ops internally, but keeps resize wiring consistent
      return () => parallax.unmount();
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    parallax.mount();

    // Re-measure once fonts and product images have settled, otherwise section
    // anchors are captured against the wrong heights.
    const onLoad = () => parallax.measure();
    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(() => parallax.measure());

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('load', onLoad);
      parallax.unmount();
      lenis.destroy();
    };
  }, []);

  return null;
}
