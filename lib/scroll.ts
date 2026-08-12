'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Scroll plumbing. One Lenis instance, one GSAP ticker, one source of truth.
 *
 * Lenis and ScrollTrigger both want to own the frame loop. If you let them run
 * independently the scrub lags the scroll by a frame and every pinned sequence
 * feels rubbery, so Lenis is driven from GSAP's ticker and ScrollTrigger is
 * updated from Lenis's scroll event.
 *
 * Nothing here runs under prefers-reduced-motion: `init` returns a no-op
 * teardown and the page falls back to native scrolling with static layouts.
 */

let registered = false;

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function initScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  registerGsap();

  if (prefersReducedMotion()) {
    // Native scroll, no smoothing, no scrubs. Sections render resolved.
    return () => {};
  }

  const lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

export { gsap, ScrollTrigger };
