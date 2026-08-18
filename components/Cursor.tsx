'use client';

import { useEffect } from 'react';

/**
 * Fine-pointer enhancement only. Mouse Follower owns position and magnetic
 * pull, while the visual language remains in globals.css with the rest of the
 * ZIC token system.
 */
export default function Cursor() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)');

    if (!finePointer.matches || !motionAllowed.matches) return;

    let destroyed = false;
    let cursor: import('mouse-follower').default | undefined;
    const root = document.documentElement;

    const handleStickyEnter = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('.btn-primary');
      if (!target || !cursor) return;
      cursor.setStick(target);
      cursor.addState('-sticky');
    };

    const handleStickyLeave = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('.btn-primary');
      const nextTarget = event.relatedTarget as Node | null;
      if (!target || target.contains(nextTarget) || !cursor) return;
      cursor.removeStick();
      cursor.removeState('-sticky');
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
          speed: 0.32,
          ease: 'expo.out',
          skewing: 0,
          stateDetection: {
            '-hover': 'a, button:not(:disabled), [role="tab"]',
            '-hidden': 'input, select, textarea, button:disabled',
          },
        });

        root.classList.add('has-custom-cursor');
        document.body.addEventListener('mouseover', handleStickyEnter, { passive: true });
        document.body.addEventListener('mouseout', handleStickyLeave, { passive: true });
      },
    );

    return () => {
      destroyed = true;
      root.classList.remove('has-custom-cursor');
      document.body.removeEventListener('mouseover', handleStickyEnter);
      document.body.removeEventListener('mouseout', handleStickyLeave);
      cursor?.destroy();
    };
  }, []);

  return null;
}
