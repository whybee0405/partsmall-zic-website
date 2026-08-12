'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';

/**
 * The oil splash, as a scroll-scrubbed frame sequence.
 *
 * Three ways to put moving oil on a page, and why this one:
 *
 * - A `<video>` that plays on entry is the cheapest, but it runs on its own
 *   clock. Everything else in this stage is scrubbed, so the splash would be
 *   the one element that ignores the scroll, and reversing it is not possible.
 * - Seeking `video.currentTime` from scroll keeps the tie to the scroll but
 *   seeks land on keyframes, so it judders on desktop and is unreliable on iOS.
 * - Frames on a canvas seek exactly, reverse for free, and cost one draw call.
 *
 * The source footage is shot on black, and the frames are composited with
 * `screen`, so the black falls away and the oil sits over the carbon backdrop
 * without needing per-frame alpha, which would roughly double the payload.
 *
 * Nothing is fetched until the sequence is wanted: `prime()` starts the load,
 * and the poster carries the section until the last frame has decoded. A
 * viewer who scrolls straight past pays for the poster only.
 */

interface Props {
  /** Total frames on disk, named `${dir}/f-00.webp` upward. */
  count: number;
  dir: string;
  /** Shown until every frame has decoded, and to anyone who never triggers it. */
  poster: string;
  width: number;
  height: number;
  /**
   * Receives the scrub function. Call with 0-1; call `prime` on it to begin
   * loading. Written rather than returned so the parent's GSAP timeline can
   * drive it without a re-render per frame.
   */
  api: MutableRefObject<SplashApi | null>;
  className?: string;
}

export interface SplashApi {
  (t: number): void;
  prime: () => void;
}

export default function SplashFrames({
  count,
  dir,
  poster,
  width,
  height,
  api,
  className,
}: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const still = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;

    const frames: HTMLImageElement[] = [];
    let loaded = 0;
    let ready = false;
    let primed = false;
    let last = -1;
    let raf = 0;

    const src = (i: number) => `${dir}/f-${String(i).padStart(2, '0')}.webp`;

    /** Cover-fit, so the canvas box can be any aspect without distortion. */
    const paint = (img: HTMLImageElement) => {
      const ctx = cv.getContext('2d');
      if (!ctx) return;
      const cw = cv.width;
      const ch = cv.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const size = () => {
      // Layout size, not the visual rect: the stage scales this element, and a
      // backing store measured mid-scale bakes that scale into the resolution.
      const w = cv.offsetWidth;
      const h = cv.offsetHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const img = frames[last];
      if (ready && img) paint(img);
    };

    const prime = () => {
      if (primed) return;
      primed = true;
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = src(i);
        img.onload = () => {
          loaded += 1;
          if (loaded === count) {
            ready = true;
            size();
            still.current?.style.setProperty('opacity', '0');
            cv.style.setProperty('opacity', '1');
          }
        };
        // A gap in the sequence must not strand the poster forever.
        img.onerror = () => {
          loaded += 1;
          if (loaded === count) ready = frames.some((f) => f.complete);
        };
        frames.push(img);
      }
    };

    const scrub: SplashApi = Object.assign(
      (t: number) => {
        if (!ready) return;
        const i = Math.round(Math.min(1, Math.max(0, t)) * (count - 1));
        if (i === last) return;
        last = i;
        // One paint per frame at most, whatever the scroll does.
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const img = frames[i];
          if (img?.complete && img.naturalWidth) paint(img);
        });
      },
      { prime },
    );

    api.current = scrub;

    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      api.current = null;
    };
  }, [api, count, dir]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={still}
        src={poster}
        alt=""
        aria-hidden
        width={width}
        height={height}
        className="h-auto w-full"
        style={{ transition: 'opacity 200ms var(--ease-out)' }}
      />
      <canvas
        ref={canvas}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0, transition: 'opacity 200ms var(--ease-out)' }}
      />
    </div>
  );
}
