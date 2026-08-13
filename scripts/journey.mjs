import { chromium } from 'playwright';
const b = await chromium.launch();
const rows = [];
for (const vp of [{ w: 1440, h: 900, tag: 'desktop' }, { w: 393, h: 852, tag: 'phone' }]) {
  const p = await b.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, isMobile: vp.w < 768, hasTouch: vp.w < 768 });
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const m = await p.evaluate(() => {
    const ids = ['hero', 'descent', 'splash', 'range', 'proof', 'inside', 'yubase', 'vhvi', 'products', 'transmission', 'distribution', 'enquire', 'footer'];
    const out = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      out[id] = el ? Math.round(el.getBoundingClientRect().top + scrollY) : null;
    }
    return { total: document.documentElement.scrollHeight, vh: innerHeight, tops: out,
      navLinksVisible: getComputedStyle(document.querySelector('nav ul')).display !== 'none' };
  });
  for (const [id, top] of Object.entries(m.tops)) {
    rows.push({ vp: vp.tag, section: id, px: top, screens: top === null ? null : +(top / m.vh).toFixed(1) });
  }
  rows.push({ vp: vp.tag, section: '— TOTAL PAGE —', px: m.total, screens: +(m.total / m.vh).toFixed(1) });
  rows.push({ vp: vp.tag, section: '— nav links visible —', px: m.navLinksVisible ? 1 : 0, screens: null });
  await p.close();
}
console.table(rows);
await b.close();
