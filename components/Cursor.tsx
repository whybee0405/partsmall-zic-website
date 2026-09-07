'use client';

import { useEffect } from 'react';

/**
 * Fine-pointer enhancement only. Mouse Follower owns the ring's eased motion,
 * directional stretch, and magnetic pull.
 */
export default function Cursor() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)');

    if (!finePointer.matches || !motionAllowed.matches) return;

    let destroyed = false;
    let cursor: import('mouse-follower').default | undefined;
    let stuckTarget: HTMLElement | null = null;
    const root = document.documentElement;

    const releaseStick = () => {
      if (!stuckTarget) return;
      stuckTarget = null;
      cursor?.removeStick();
      cursor?.removeState('-sticky');
    };

    const handleStickyEnter = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('.btn-primary');
      if (!target || !cursor) return;
      stuckTarget = target;
      cursor.setStick(target);
      cursor.addState('-sticky');
    };

    const handleStickyLeave = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('.btn-primary');
      const nextTarget = event.relatedTarget as Node | null;
      if (!target || target.contains(nextTarget)) return;
      releaseStick();
    };

    // A stuck button can unmount on its own click (the cookie banner's
    // Accept, the enquiry form's submit button navigating away) without ever
    // firing a real mouseout — the cursor would otherwise stay stuck to
    // wherever that element used to be until an unrelated click reset it.
    const stickyTargetWatcher = new MutationObserver(() => {
      if (stuckTarget && !stuckTarget.isConnected) releaseStick();
    });

    const isDarkSurface = (x: number, y: number) => {
      for (const element of document.elementsFromPoint(x, y)) {
        const channels = getComputedStyle(element).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (!channels || channels.length < 3 || (channels[3] ?? 1) < 0.5) continue;

        const [red, green, blue] = channels;
        // Relative luminance is enough here because surfaces are deliberately
        // opaque, restrained ZIC engineering colours rather than gradients.
        return (red * 0.2126 + green * 0.7152 + blue * 0.0722) < 128;
      }
      return false;
    };

    const syncSurface = (event: MouseEvent) => {
      cursor?.toggleState('-on-dark', isDarkSurface(event.clientX, event.clientY));
    };

    const emitRipple = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest('input, select, textarea, button:disabled')) return;

      for (let index = 0; index < 3; index += 1) {
        const ripple = document.createElement('span');
        ripple.className = 'zic-cursor-ripple';
        ripple.style.left = `${event.clientX}px`;
        ripple.style.top = `${event.clientY}px`;
        ripple.style.setProperty('--ripple-delay', `${index * 55}ms`);
        document.body.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      }
    };

    void Promise.all([import('mouse-follower'), import('gsap')]).then(
      ([{ default: MouseFollower }, { gsap }]) => {
        if (destroyed) return;

        MouseFollower.registerGSAP(gsap);
        cursor = new MouseFollower({
          className: 'zic-cursor',
          innerClassName: 'zic-cursor-inner',
          dataAttr: null,
          activeState: '-active',
          speed: 0.38,
          ease: 'expo.out',
          skewing: 1.8,
          skewingDelta: 0.0025,
          skewingDeltaMax: 0.12,
          stateDetection: {
            '-hover': 'a, button:not(:disabled), [role="tab"]',
            '-hidden': 'input, select, textarea, button:disabled',
          },
        });

        root.classList.add('has-custom-cursor');
        document.body.addEventListener('mouseover', handleStickyEnter, { passive: true });
        document.body.addEventListener('mouseout', handleStickyLeave, { passive: true });
        document.body.addEventListener('mousemove', syncSurface, { passive: true });
        document.body.addEventListener('pointerdown', emitRipple, { passive: true });
        stickyTargetWatcher.observe(document.body, { childList: true, subtree: true });
      },
    );

    return () => {
      destroyed = true;
      root.classList.remove('has-custom-cursor');
      document.body.removeEventListener('mouseover', handleStickyEnter);
      document.body.removeEventListener('mouseout', handleStickyLeave);
      document.body.removeEventListener('mousemove', syncSurface);
      document.body.removeEventListener('pointerdown', emitRipple);
      stickyTargetWatcher.disconnect();
      document.querySelectorAll('.zic-cursor-ripple').forEach((ripple) => ripple.remove());
      cursor?.destroy();
    };
  }, []);

  return null;
}
