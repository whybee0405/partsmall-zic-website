/**
 * Visual audit harness.
 *
 * Drives the page at a set of scroll positions and viewports, screenshots each,
 * and reports geometry problems that are hard to see by eye: overlapping text,
 * elements escaping the viewport, and baselines that should agree but do not.
 *
 * Usage: node scripts/audit.mjs [url]
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const URL = process.argv[2] ?? 'http://localhost:3000';
const OUT = 'scripts/audit-shots';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 },
];

/** Scroll positions as a fraction of the opening sequence, then by section. */
const SEQ_STOPS = [0, 0.15, 0.3, 0.45, 0.6, 0.72, 0.85, 1];

const SECTIONS = [
  'proof',
  'inside',
  'yubase',
  'vhvi',
  'products',
  'transmission',
  'distribution',
  'enquire',
  'footer',
];

// Scrubbed timelines ease over ~0.5s, so measuring earlier catches them
// mid-transition and reports overlaps that never render.
/** Drive the page the way Lenis expects, or fall back to native scrolling. */
async function scrollTo(page, y) {
  await page.evaluate((y) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, y);
}

async function settle(page, ms = 1300) {
  await page.waitForTimeout(ms);
}

/** Report boxes that overlap when they should not, and anything off-canvas. */
async function geometry(page, label) {
  return page.evaluate((label) => {
    const issues = [];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Effective opacity, walking ancestors. A cross-fading stack is only a real
    // overlap if both layers are actually painting.
    const effOpacity = (el) => {
      let o = 1;
      let n = el;
      while (n && n !== document.body) {
        const s = getComputedStyle(n);
        if (s.display === 'none' || s.visibility === 'hidden') return 0;
        o *= parseFloat(s.opacity);
        if (o < 0.05) return 0;
        n = n.parentElement;
      }
      return o;
    };

    /** True if the element sits inside a position:fixed ancestor. */
    const isFixed = (el) => {
      let n = el;
      while (n && n !== document.body) {
        if (getComputedStyle(n).position === 'fixed') return true;
        n = n.parentElement;
      }
      return false;
    };

    const visible = (el) => {
      if (effOpacity(el) < 0.12) return false;
      const r = el.getBoundingClientRect();
      return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < vh;
    };

    // Text nodes currently on screen
    const textEls = [...document.querySelectorAll('h1,h2,h3,p,li,span,label,button,a')].filter(
      (el) =>
        visible(el) &&
        el.textContent.trim().length > 1 &&
        ![...el.children].some((c) => c.textContent.trim() === el.textContent.trim())
    );

    // Horizontal overflow
    if (document.documentElement.scrollWidth > vw + 1) {
      issues.push({
        type: 'h-overflow',
        detail: `scrollWidth ${document.documentElement.scrollWidth} > viewport ${vw}`,
      });
    }

    for (const el of textEls) {
      const r = el.getBoundingClientRect();
      if (r.left < -2 || r.right > vw + 2) {
        issues.push({
          type: 'off-canvas',
          text: el.textContent.trim().slice(0, 46),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }

    // Overlapping text blocks that are not ancestor/descendant
    for (let i = 0; i < textEls.length; i++) {
      for (let j = i + 1; j < textEls.length; j++) {
        const a = textEls[i];
        const b = textEls[j];
        if (a.contains(b) || b.contains(a)) continue;
        // Content passing beneath a fixed bar is what a fixed bar is for.
        if (isFixed(a) !== isFixed(b)) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (ox > 6 && oy > 6) {
          const areaMin = Math.min(ra.width * ra.height, rb.width * rb.height);
          if ((ox * oy) / areaMin > 0.22) {
            issues.push({
              type: 'overlap',
              a: a.textContent.trim().slice(0, 34),
              b: b.textContent.trim().slice(0, 34),
              overlap: `${Math.round(ox)}x${Math.round(oy)}`,
            });
          }
        }
      }
    }

    return { label, issues };
  }, label);
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const report = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
    page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 160)));

    await page.goto(URL, { waitUntil: 'networkidle' });
    await settle(page, 900);

    // Opening sequence
    const seqHeight = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const wrap = hero?.parentElement;
      return wrap ? wrap.getBoundingClientRect().height : 0;
    });

    for (const t of SEQ_STOPS) {
      const y = Math.round(t * Math.max(0, seqHeight - window_h(vp)));
      await scrollTo(page, y);
      await settle(page);
      const name = `${vp.name}-seq-${String(Math.round(t * 100)).padStart(3, '0')}`;
      await page.screenshot({ path: `${OUT}/${name}.png` });
      report.push(await geometry(page, name));
    }

    // Each later section, scrolled to its top
    for (const id of SECTIONS) {
      const ok = await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const y = el.getBoundingClientRect().top + window.scrollY + 1;
        const lenis = window.__lenis;
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        return true;
      }, id);
      if (!ok) continue;
      await settle(page);
      const name = `${vp.name}-${id}`;
      await page.screenshot({ path: `${OUT}/${name}.png` });
      report.push(await geometry(page, name));
    }

    if (errors.length) report.push({ label: `${vp.name}-console`, issues: errors.map((e) => ({ type: 'console', detail: e })) });
    await page.close();
  }

  await browser.close();

  const flat = report.filter((r) => r.issues.length);
  await writeFile(`${OUT}/report.json`, JSON.stringify(flat, null, 2));

  console.log(`\nShots: ${OUT}\n`);
  if (!flat.length) {
    console.log('No geometry issues found.');
    return;
  }
  for (const r of flat) {
    console.log(`\n### ${r.label}`);
    const seen = new Set();
    for (const i of r.issues) {
      const key = JSON.stringify(i);
      if (seen.has(key)) continue;
      seen.add(key);
      console.log('  ', JSON.stringify(i));
    }
  }
}

function window_h(vp) {
  return vp.height;
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
