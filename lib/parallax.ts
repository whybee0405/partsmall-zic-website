/**
 * Parallax plane system.
 *
 * One rAF loop, one scroll read per frame, one `transform` write per plane.
 * Never a scroll listener per element, never `background-attachment: fixed`,
 * never a layout property.
 *
 * Elements opt in with `data-plane="0|1|2"`. Speed comes from PLANE_SPEED.
 * Because plane 2 exceeds 1.0, product renders drift upward relative to the
 * page as you scroll. That separation is what stops a centred layout reading
 * flat, and it is the whole reason this file exists.
 *
 * Spec: docs/LANDING-PAGE-SPEC.md §2 "The parallax system".
 */

export const PLANE_SPEED = {
  0: 0.15, // ghost wordmark, background plates
  1: 0.6, // type blocks, splash plate
  2: 1.15, // product renders
} as const;

/** Short viewports overshoot at full strength, so mobile softens the spread. */
export const PLANE_SPEED_COMPACT = {
  0: 0.4,
  1: 0.8,
  2: 1.08,
} as const;

export type PlaneId = keyof typeof PLANE_SPEED;

type Tracked = {
  el: HTMLElement;
  speed: number;
  /** Section top in document space, so each plane is relative to its own section. */
  anchor: number;
  height: number;
};

const COMPACT_QUERY = '(max-width: 767px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

export function createParallax() {
  let tracked: Tracked[] = [];
  let frame = 0;
  let running = false;
  let lastY = -1;

  const prefersReduced = () => window.matchMedia(REDUCED_QUERY).matches;
  const isCompact = () => window.matchMedia(COMPACT_QUERY).matches;

  function measure() {
    const speeds = isCompact() ? PLANE_SPEED_COMPACT : PLANE_SPEED;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-plane]')
    );

    tracked = nodes.map((el) => {
      const plane = Number(el.dataset.plane) as PlaneId;
      const custom = el.dataset.planeSpeed;
      const speed = custom ? Number(custom) : (speeds[plane] ?? 1);

      // Anchor to the nearest section so planes reset per chamber rather than
      // accumulating drift down an 11,000px page.
      const section = el.closest('section') ?? el.parentElement ?? el;
      const rect = section.getBoundingClientRect();
      const anchor = rect.top + window.scrollY;

      // Clear any existing transform before measuring so we read true position.
      el.style.transform = '';

      return { el, speed, anchor, height: rect.height };
    });

    lastY = -1;
    apply(window.scrollY);
  }

  function apply(scrollY: number) {
    const vh = window.innerHeight;

    for (const t of tracked) {
      // Progress of this section through the viewport, centred on 0.
      const sectionCentre = t.anchor + t.height / 2;
      const viewportCentre = scrollY + vh / 2;
      const delta = viewportCentre - sectionCentre;

      // Skip work for anything well outside the viewport.
      if (Math.abs(delta) > vh + t.height) {
        continue;
      }

      const offset = delta * (t.speed - 1);
      t.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
  }

  function tick() {
    if (!running) return;
    const y = window.scrollY;
    if (y !== lastY) {
      lastY = y;
      apply(y);
    }
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (prefersReduced()) return;
    measure();
    running = true;
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frame);
    for (const t of tracked) t.el.style.transform = '';
  }

  let resizeTimer: ReturnType<typeof setTimeout>;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  }

  const motionQuery = window.matchMedia(REDUCED_QUERY);
  function onMotionChange() {
    if (motionQuery.matches) stop();
    else start();
  }

  function mount() {
    start();
    window.addEventListener('resize', onResize, { passive: true });
    motionQuery.addEventListener('change', onMotionChange);
  }

  function unmount() {
    stop();
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', onResize);
    motionQuery.removeEventListener('change', onMotionChange);
  }

  return { mount, unmount, measure };
}
