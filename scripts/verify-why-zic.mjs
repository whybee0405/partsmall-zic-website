import { chromium } from 'playwright';
const b = await chromium.launch();

const desktop = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
desktop.on('pageerror', (e) => errors.push(e.message));
await desktop.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await desktop.waitForTimeout(500);

// Section order: proof, then why-zic, then inside, top-to-bottom.
const order = await desktop.evaluate(() => {
  const ids = ['proof', 'why-zic', 'inside'];
  return ids.map((id) => {
    const el = document.getElementById(id);
    return el ? Math.round(el.getBoundingClientRect().top + scrollY) : null;
  });
});
console.log('section tops (proof, why-zic, inside):', JSON.stringify(order));
console.log('order correct:', order[0] < order[1] && order[1] < order[2]);

// Light chamber: background should be Engineering White, not Carbon.
const bg = await desktop.evaluate(() => {
  const el = document.getElementById('why-zic');
  return el ? getComputedStyle(el).backgroundColor : null;
});
console.log('why-zic background:', bg);

// Content: 10 cells, 5-column grid at desktop width.
const itemCount = await desktop.evaluate(() => document.querySelectorAll('#why-zic li').length);
const desktopCols = await desktop.evaluate(() => {
  const grid = document.querySelector('#why-zic ul');
  return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : null;
});
console.log('item count:', itemCount, '| desktop grid columns:', desktopCols);

const whyZicDesktop = await desktop.$('#why-zic');
if (whyZicDesktop) await whyZicDesktop.screenshot({ path: 'scripts/audit-shots/why-zic-desktop.png' });

console.log('page errors (desktop):', JSON.stringify(errors));

// Mobile: 2-column grid.
const mobile = await b.newPage({ viewport: { width: 375, height: 800 } });
await mobile.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(500);
const mobileCols = await mobile.evaluate(() => {
  const grid = document.querySelector('#why-zic ul');
  return grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : null;
});
console.log('mobile grid columns:', mobileCols);

const whyZicMobile = await mobile.$('#why-zic');
if (whyZicMobile) await whyZicMobile.screenshot({ path: 'scripts/audit-shots/why-zic-mobile.png' });

await b.close();
