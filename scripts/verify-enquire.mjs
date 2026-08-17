import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000/#enquire', { waitUntil: 'networkidle' });
await p.evaluate(() => document.getElementById('enquire').scrollIntoView());
await p.waitForTimeout(500);

// 1. Submit empty — expect an inline error under every required field, no navigation
await p.click('#enquire button[type=submit]');
await p.waitForTimeout(300);
const errorTexts = await p.$$eval('#enquire form p', (els) =>
  els.map((e) => e.textContent).filter((t) => t && /Enter|Select/.test(t))
);
console.log(JSON.stringify({ emptySubmitErrorCount: errorTexts.length, expected: 5 }));

// 2. Blur an empty required field directly — expect its own error to appear
const nameInput = p.locator('#enquire input[name=name]');
await nameInput.focus();
await nameInput.blur();
await p.waitForTimeout(200);
const nameError = await p.locator('#enquire form').getByText('Enter your name.').count();
console.log(JSON.stringify({ blurTriggersError: nameError > 0 }));

// 3. Fill correctly and submit — expect a success message and no page navigation
await p.fill('#enquire input[name=name]', 'Playwright Test');
await p.fill('#enquire input[name=phone]', '0812345678');
await p.fill('#enquire input[name=email]', 'test@example.com');
await p.selectOption('#enquire select[name=province]', 'Gauteng');
await p.selectOption('#enquire select[name=interest]', 'Passenger petrol');
await p.click('#enquire button[type=submit]');
await p.waitForTimeout(800);
const successVisible = await p.locator('#enquire').getByText(/with us now/).count();
console.log(
  JSON.stringify({ successMessageVisible: successVisible > 0, urlAfterSubmit: p.url() })
);

await b.close();
