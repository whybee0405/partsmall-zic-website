'use client';

import { useEffect } from 'react';
import { initScroll, prefersReducedMotion } from '@/lib/scroll';
import { createParallax } from '@/lib/parallax';

/**
 * Mounts the scroll stack once, at the root.
 *
 * Order matters: Lenis and ScrollTrigger come up first so the parallax loop
 * reads a scroll position that is already being smoothed, otherwise planes
 * judder against the eased scroll.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const teardownScroll = initScroll();
    const parallax = createParallax();
    parallax.mount();

    // Re-measure once fonts and product renders have settled. Section anchors
    // captured before layout stabilises put every plane in the wrong place.
    const remeasure = () => parallax.measure();
    window.addEventListener('load', remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});

    return () => {
      window.removeEventListener('load', remeasure);
      parallax.unmount();
      teardownScroll();
    };
  }, []);

  return null;
}

export { prefersReducedMotion };
