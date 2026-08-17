import { chromium } from 'playwright';
const b = await chromium.launch();

async function shotThroughPin(page, label) {
  const top = await page.evaluate(() => Math.round(document.getElementById('inside').getBoundingClientRect().top + scrollY));
  const height = await page.evaluate(() => document.getElementById('inside').getBoundingClientRect().height);
  for (const frac of [0, 0.2, 0.5, 0.8, 1]) {
    const y = top + height * frac;
    await page.evaluate((yy) => (window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true, force: true }) : window.scrollTo(0, yy)), y);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `scripts/audit-shots/${label}-${frac}.png` });
  }
  return { top, height };
}

// Desktop
const desktop = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
desktop.on('pageerror', (e) => errors.push(e.message));
await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await desktop.waitForTimeout(800);
const dims = await shotThroughPin(desktop, 'fix-desktop');
console.log(JSON.stringify({ desktop: dims, errors }));

// Check no clipping: body text of all 3 states should be fully within viewport, mid-pin
await desktop.evaluate((yy) => (window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true, force: true }) : window.scrollTo(0, yy)), dims.top + dims.height * 0.5);
await desktop.waitForTimeout(300);
const overflowCheck = await desktop.evaluate(() => {
  const stage = document.querySelector('#inside .sticky');
  const items = Array.from(document.querySelectorAll('#inside [data-state-title]'));
  return items.map((el) => {
    const p = el.parentElement.querySelector('p:last-child');
    const r = p.getBoundingClientRect();
    return { title: el.textContent, bodyBottom: Math.round(r.bottom), viewportH: window.innerHeight };
  });
});
console.log('overflow check (desktop):', JSON.stringify(overflowCheck));

// Landscape phone — the exact case that was broken (I1)
const landscape = await b.newPage({ viewport: { width: 812, height: 375 } });
await landscape.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await landscape.waitForTimeout(800);
const isStaticLandscape = await landscape.evaluate(() => {
  const section = document.getElementById('inside');
  return section.className.includes('py-24 lg:py-28');
});
console.log('landscape uses static fallback:', isStaticLandscape);
const ltop = await landscape.evaluate(() => Math.round(document.getElementById('inside').getBoundingClientRect().top + scrollY));
await landscape.evaluate((yy) => (window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true, force: true }) : window.scrollTo(0, yy)), ltop);
await landscape.waitForTimeout(400);
await landscape.screenshot({ path: 'scripts/audit-shots/fix-landscape.png' });

// Tablet portrait 768 wide (boundary of the width breakpoint) — should still be animated, not clipped
const tablet = await b.newPage({ viewport: { width: 768, height: 900 } });
await tablet.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await tablet.waitForTimeout(800);
await shotThroughPin(tablet, 'fix-tablet768');
console.log('tablet 768 done');

await b.close();
