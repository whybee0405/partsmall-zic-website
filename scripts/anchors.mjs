import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const target = await p.evaluate(() => Math.round(document.getElementById('enquire').getBoundingClientRect().top + scrollY));
await p.click('header a.btn-primary');
await p.waitForTimeout(2500);
const after = await p.evaluate(() => Math.round(scrollY));
console.log(JSON.stringify({ enquireTop: target, scrollAfterClick: after, arrived: Math.abs(after - target) < 200 }));
// second: products link
await p.evaluate(() => window.__lenis.scrollTo(0, { immediate: true, force: true }));
await p.waitForTimeout(800);
const pt = await p.evaluate(() => Math.round(document.getElementById('products').getBoundingClientRect().top + scrollY));
await p.click('nav a[href="#products"]');
await p.waitForTimeout(2500);
const pa = await p.evaluate(() => Math.round(scrollY));
console.log(JSON.stringify({ productsTop: pt, scrollAfterClick: pa, arrived: Math.abs(pa - pt) < 200 }));
await b.close();
