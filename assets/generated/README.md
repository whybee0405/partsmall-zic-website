# Generated assets

Produced with Higgsfield (Nano Banana Pro, 2K) for the SK ZIC South Africa landing page.
All are placement assets for the Figma comp and the first build pass.

| File | Use | Notes |
|---|---|---|
| `01-splash.png` | source plate | Crown splash on solid black. Keep for screen-blend compositing. |
| `01-splash-cutout.png` | source cutout | Background removed, full frame including the spreading pool. |
| `01-splash-crown.png` | **hero act 2/3** | Cropped to the crown with a numpy alpha ramp on the bottom 40% and outer 8%. This is the one in the comp. |
| `02-ribbon.png` | chapter transition | Oil ribbon in flight on black. For the splash-to-Film-Rail handoff. |
| `03-oilfilm.png` | **Ch.01 hero** | Oil film glowing between two ground steel surfaces. The Protection Layer device. |
| `04-vortex.png` | **Ch.02 YUBASE** | Amber oil vortex on carbon. |
| `05-bottle.png` | source | Blank 6 L canister on white. |
| `05-bottle-cutout.png` | **hero placeholder** | Transparent 6 L canister. Deliberately unbranded. |
| `06-highveld.png` | **Ch.03 VHVI** | Highveld winter dawn, frost, bakkie idling. The cold-start argument. |
| `07-counter.jpg` | **Ch.06 distribution** | Parts trade counter interior. JPEG because the PNG exceeded Figma's 10 MB upload limit. |

## Before build

- Convert to AVIF with WebP fallback, and generate `srcset` widths at 640 / 1024 / 1440 / 2048.
- Replace `05-bottle-cutout.png` with real SK ZIC product photography from Parts-Mall. The
  placeholder is blank on purpose so it cannot be mistaken for real ZIC packaging, and no
  imitation ZIC label should be generated to stand in for it.
- The hero canister is the LCP element. Preload it; it must not queue behind the splash plates.
