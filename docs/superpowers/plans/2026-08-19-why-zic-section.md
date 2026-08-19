# Why ZIC Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an unnumbered "Why ZIC" benefits section between the Proof manifest and the Inside
chapter, giving the page a plain-language bridge between the authority claims and the
mechanism-level engineering chapters.

**Architecture:** One new content module (`content/why-zic.ts`), one new presentational section
component (`components/sections/WhyZic.tsx`), and two small edits to existing files
(`content/sections.ts` to register the chamber with the Film Rail, `app/page.tsx` to render it).
No new dependencies, no motion — the section ships static, following the existing `Proof.tsx`
precedent.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4 over the existing
`app/globals.css` token layer. No test runner exists in this repo (no Jest/Vitest); verification
uses `tsc --noEmit`, `next lint`, and a Playwright smoke script following the existing
`scripts/verify-*.mjs` convention.

**Spec:** `docs/superpowers/specs/2026-08-19-why-zic-section-design.md`

---

### Task 1: Content data

**Files:**
- Create: `content/why-zic.ts`
- Modify: `content/sections.ts`

- [ ] **Step 1: Create `content/why-zic.ts`**

```ts
/**
 * Why ZIC — 10 Benefits. Plain-language bridge between the Proof manifest
 * (authority) and the Inside/Yubase/Vhvi chapters (mechanism).
 *
 * Source: the official ZIC 10 Benefits (skzic.com/eng/ibuilder.do?menu_idx=150),
 * rewritten in non-technical language. Guardrails preserved: no OEM interval
 * override, no absolute lifespan guarantee, no unsupported fuel-economy or
 * horsepower figures, no product-specific approval claims. SA localisation on
 * 05, 06, 09 per docs/RESEARCH.md §3.
 */

export interface WhyZicCell {
  id: string;
  title: string;
  body: string;
}

export const WHY_ZIC: WhyZicCell[] = [
  {
    id: '01',
    title: 'Elevated Engine Protection',
    body: 'High viscosity index keeps the protective film doing its job under heat and load, not just when the engine is idling in the driveway.',
  },
  {
    id: '02',
    title: 'Outstanding Cleanliness',
    body: 'A precisely balanced additive package keeps sludge and deposits from building up as the kilometres add up.',
  },
  {
    id: '03',
    title: 'Extended Replacement Interval',
    body: 'Oil that holds its performance for longer gets more distance out of each service, within whatever interval your manufacturer sets.',
  },
  {
    id: '04',
    title: 'Improved Fuel Efficiency',
    body: 'Lower viscosity means less drag on moving parts, so the engine works a little less to do the same job.',
  },
  {
    id: '05',
    title: 'Enhanced Durability',
    body: "On the N3 in summer or grinding up a mountain pass, a strong oil film at high temperature means less metal-on-metal wear over the engine's life.",
  },
  {
    id: '06',
    title: 'Excellent Low-Temperature Performance',
    body: 'On a frosty Highveld morning, ZIC keeps flowing so oil reaches the top end fast instead of leaving the engine running dry in those first seconds.',
  },
  {
    id: '07',
    title: 'Extended Engine Lifespan',
    body: 'Consistent protection and cleanliness help the engine keep running the way it did when it left the factory floor, for longer.',
  },
  {
    id: '08',
    title: 'Certified by Global Automakers',
    body: 'The same formulations ZIC sells to workshops are supplied as factory-fill oil to major automakers worldwide.',
  },
  {
    id: '09',
    title: 'Improved Engine Function',
    body: 'Through stop-start Joburg traffic or a loaded highway run, the engine keeps delivering the output it was built for.',
  },
  {
    id: '10',
    title: 'Reduced Oil Consumption',
    body: 'A stable oil film at high temperature means less oil burns off, so the level on the dipstick holds steadier between checks.',
  },
];
```

- [ ] **Step 2: Run typecheck to verify the new file is valid**

Run: `npm run typecheck`
Expected: exits 0, no errors mentioning `content/why-zic.ts`

- [ ] **Step 3: Insert the new chamber into `content/sections.ts`**

Find this block (currently lines 22-24 of the `SECTIONS` array):

```ts
  { id: 'proof', label: 'Proof', film: 2, dark: true },
  { id: 'inside', label: 'What is happening inside?', film: 8, dark: true, tick: '01' },
```

Replace with:

```ts
  { id: 'proof', label: 'Proof', film: 2, dark: true },
  { id: 'why-zic', label: 'Why ZIC', film: 2, dark: false },
  { id: 'inside', label: 'What is happening inside?', film: 8, dark: true, tick: '01' },
```

No `tick` field on the new entry — same as `proof`. This keeps every existing chapter's
`Ch.01/06`…`Ch.06/06` stamp and Film Rail tick unchanged, and gives the new chamber
`dark: false` so the Film Rail hairline and rail-fill colour render correctly for a light
chamber when the reader scrolls through it.

- [ ] **Step 4: Run typecheck again**

Run: `npm run typecheck`
Expected: exits 0

- [ ] **Step 5: Commit**

```bash
git add content/why-zic.ts content/sections.ts
git commit -m "$(cat <<'EOF'
Add Why ZIC content data and register its chamber

Ten benefits, rewritten in plain language from the official ZIC 10
Benefits page, with light SA localisation on three of them. Registered
in SECTIONS as an unnumbered chamber between Proof and Inside, matching
how Proof itself is unnumbered.
EOF
)"
```

---

### Task 2: WhyZic section component

**Files:**
- Create: `components/sections/WhyZic.tsx`

- [ ] **Step 1: Create `components/sections/WhyZic.tsx`**

```tsx
import { WHY_ZIC } from '@/content/why-zic';
import { Rule } from '@/components/ui';

/**
 * Why ZIC — the bridge between Proof (authority) and Inside (mechanism).
 *
 * Unnumbered, like Proof: no Film Rail tick, no chapter Stamp. Ships static —
 * no motion primitive exists in this codebase for a plain content grid with
 * no numeric data to animate (see docs/superpowers/specs/2026-08-19-why-zic-
 * section-design.md, "Motion").
 *
 * Design: docs/superpowers/specs/2026-08-19-why-zic-section-design.md
 */
export default function WhyZic() {
  return (
    <section
      id="why-zic"
      className="py-16 lg:py-20"
      style={{ background: 'var(--color-eng-white)' }}
    >
      <div className="shell stack-centre">
        <p className="t-label" style={{ color: 'var(--color-zic-red)' }}>
          [ Why ZIC ]
        </p>

        <h2 className="t-display t-h2 mt-6">Ten reasons, before the engineering.</h2>

        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-deep-steel)' }}
        >
          The chapters ahead explain how ZIC works. This is what it means for the vehicle in
          front of you.
        </p>

        <ul className="mt-14 grid w-full grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5">
          {WHY_ZIC.map((cell) => (
            <li key={cell.id}>
              <Rule />
              <p className="t-mono mt-4 text-sm" style={{ color: 'var(--color-zic-red)' }}>
                {cell.id}
              </p>
              <p
                className="mt-2 text-[0.9375rem] font-semibold"
                style={{ color: 'var(--color-carbon)' }}
              >
                {cell.title}
              </p>
              <p
                className="mt-2 text-[0.875rem] leading-[1.55]"
                style={{ color: 'var(--color-deep-steel)' }}
              >
                {cell.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

This mirrors `Yubase.tsx` and `Distribution.tsx`'s wrapper pattern (`shell stack-centre`
containing a centred eyebrow/H2/lead followed by a full-width grid whose cells are left-aligned
by default), and `Proof.tsx`'s choice not to import `Stamp` since this section is not a numbered
chapter. `Rule` is the existing hairline component from `components/ui.tsx`; called with no
props it defaults to the light-chamber hairline colour, which is correct here since this section
is `dark: false`.

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: exits 0

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: exits 0, no warnings/errors on `components/sections/WhyZic.tsx`

- [ ] **Step 4: Commit**

```bash
git add components/sections/WhyZic.tsx
git commit -m "$(cat <<'EOF'
Add WhyZic section component

Static presentational component, no motion, following Proof.tsx's
precedent since no motion primitive in this codebase animates a plain
content grid with no numeric data.
EOF
)"
```

---

### Task 3: Wire the section into the page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the import**

Find:

```tsx
import Proof from '@/components/sections/Proof';
import Inside from '@/components/sections/Inside';
```

Replace with:

```tsx
import Proof from '@/components/sections/Proof';
import WhyZic from '@/components/sections/WhyZic';
import Inside from '@/components/sections/Inside';
```

- [ ] **Step 2: Render it between Proof and the chapter sequence**

Find:

```tsx
        {/* Opening sequence: one becomes five, pinned and scrubbed */}
        <OpeningSequence />
        <Proof />

        {/* Chapters 01-06 */}
        <Inside />
```

Replace with:

```tsx
        {/* Opening sequence: one becomes five, pinned and scrubbed */}
        <OpeningSequence />
        <Proof />
        <WhyZic />

        {/* Chapters 01-06 */}
        <Inside />
```

`<WhyZic />` sits outside the `{/* Chapters 01-06 */}` comment block on purpose — it isn't one
of the six numbered chapters.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: exits 0

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "Render WhyZic between Proof and the chapter sequence"
```

---

### Task 4: Verification script and smoke test

**Files:**
- Create: `scripts/verify-why-zic.mjs`

- [ ] **Step 1: Create `scripts/verify-why-zic.mjs`**

```js
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
```

- [ ] **Step 2: Start the dev server in the background**

Run: `npm run dev` (background process)
Expected: log line containing `Ready in` and `http://localhost:3000`

- [ ] **Step 3: Run the verification script**

Run: `node scripts/verify-why-zic.mjs`
Expected output, all of the following must hold:
- `order correct: true`
- `why-zic background:` prints an RGB string matching Engineering White (`#F7F7F5` →
  `rgb(247, 247, 245)`)
- `item count: 10`
- `desktop grid columns: 5`
- `mobile grid columns: 2`
- `page errors (desktop): []`

- [ ] **Step 4: Review the screenshots**

Open `scripts/audit-shots/why-zic-desktop.png` and `scripts/audit-shots/why-zic-mobile.png`.
Confirm: eyebrow, heading, and lead are centred; the 10 cells read as a clean 5×2 grid on
desktop and a 2-column stack on mobile; no text overflow or clipping in any cell; hairline
rules appear above each cell number.

- [ ] **Step 5: Stop the dev server**

Terminate the background `npm run dev` process.

- [ ] **Step 6: Commit**

```bash
git add scripts/verify-why-zic.mjs
git commit -m "Add verify-why-zic smoke script"
```

(Screenshots in `scripts/audit-shots/` are review artifacts, not committed — check
`.gitignore` covers `scripts/audit-shots/`; if it does not already, that is pre-existing repo
state and out of scope for this plan.)

---

### Task 5: Final full-project verification

**Files:** none (verification only)

- [ ] **Step 1: Run lint across the whole project**

Run: `npm run lint`
Expected: exits 0

- [ ] **Step 2: Run typecheck across the whole project**

Run: `npm run typecheck`
Expected: exits 0

- [ ] **Step 3: Run a production build**

Run: `npm run build`
Expected: exits 0, no build errors, static/prerender step completes for `/`

- [ ] **Step 4: Confirm no regressions to existing chapters**

Using the running dev server (restart with `npm run dev` if it was stopped in Task 4), open
`http://localhost:3000/` in a real browser and scroll from Proof through Why ZIC into Inside.
Confirm: the Film Rail's chapter tick still reads `01` on Inside (not renumbered), Why ZIC has
no tick, and Products through Distribution still read `Ch.04/06` through `Ch.06/06` unchanged.

- [ ] **Step 5: Check breakpoints not covered by the script**

Resize the browser (or use devtools device toolbar) to 768px and 1024px wide. Confirm the Why
ZIC grid still reads as a clean, non-overlapping layout at both — the script in Task 4 only
checked 375px and 1440px.

- [ ] **Step 6: Check text contrast**

Using devtools' colour picker or an contrast-checking extension, confirm both text colours used
in the grid cells clear 4.5:1 against the Engineering White background (`#F7F7F5`):
- Title text, `var(--color-carbon)` (`#090B0E`) — this is a near-black on a near-white, so it
  will pass by a wide margin; confirm rather than skip.
- Body text, `var(--color-deep-steel)` (`#2A3037`) — also expected to pass comfortably, but
  confirm the actual computed value, since `color-deep-steel` is reused in dark-chamber
  contexts elsewhere on the page and this is its first use as body text on a light background.

- [ ] **Step 7: Check 200% text zoom**

In the browser, zoom to 200% (Ctrl/Cmd + repeatedly, or devtools' zoom control). Confirm the
Why ZIC grid reflows without clipping or overlapping text — the `grid-cols-2`/`grid-cols-5`
layout has no fixed heights, so cells should simply grow taller.

- [ ] **Step 8: Commit any fixes found in steps 1-7**

Only if issues were found and fixed. If everything already passed, no commit is needed — the
implementation is complete as of Task 4's commit.
