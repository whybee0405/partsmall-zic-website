import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

// Throttle CPU heavily so React hydration + the GSAP mount effects take long
// enough to reliably capture the "before gsap.set has run" frame — this is
// the actual window the reported bug lives in (JS IS running, just hasn't
// finished yet), unlike the javaScriptEnabled:false test which simulates JS
// never running at all (a different, unrelated failure mode).
const cdp = await p.context().newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

await p.goto('http://localhost:3000/', { waitUntil: 'commit' });

// Sample screenshots at short intervals through the hydration window.
for (const delay of [0, 50, 100, 200, 400, 800, 1500]) {
  await p.waitForTimeout(delay === 0 ? 0 : 50);
  try {
    await p.screenshot({ path: `scripts/audit-shots/fouc-t${delay}.png`, timeout: 5000 });
  } catch (e) {
    console.log(`screenshot at t${delay} failed:`, e.message.split('\n')[0]);
  }
}
await p.waitForTimeout(3000);
try {
  await p.screenshot({ path: 'scripts/audit-shots/fouc-settled.png', timeout: 5000 });
} catch (e) {
  console.log('settled screenshot failed:', e.message.split('\n')[0]);
}

await b.close();
