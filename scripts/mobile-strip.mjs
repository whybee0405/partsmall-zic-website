/**
 * Mobile filmstrip.
 *
 * Walks a real device profile down the page in viewport-sized steps and
 * screenshots each one, so the scroll experience can be reviewed as a sequence
 * rather than inferred from a full-page capture (which collapses sticky
 * sections and hides exactly the problems worth finding).
 *
 * Usage: node scripts/mobile-strip.mjs [url] [outDir]
 */
import { chromium, devices } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';

const URL = process.argv[2] ?? 'http://localhost:3000';
const OUT = process.argv[3] ?? 'scripts/mobile-strip';

const PROFILE = {
  ...devices['iPhone 14 Pro'],
  deviceScaleFactor: 2,
};

async function run() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage(PROFILE);
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);

  const { total, vh } = await page.evaluate(() => ({
    total: document.documentElement.scrollHeight,
    vh: window.innerHeight,
  }));

  // Overlap each step slightly so nothing falls between frames.
  const step = Math.round(vh * 0.8);
  const frames = Math.ceil((total - vh) / step) + 1;
  console.log(`page ${total}px / viewport ${vh}px -> ${frames} frames`);

  for (let i = 0; i < frames; i++) {
    const y = Math.min(i * step, total - vh);
    await page.evaluate((y) => {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }, y);
    await page.waitForTimeout(900);
    const name = `${String(i).padStart(2, '0')}-y${y}.png`;
    await page.screenshot({ path: `${OUT}/${name}` });
  }

  await browser.close();
  console.log(`frames written to ${OUT}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
