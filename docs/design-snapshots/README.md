# Design snapshots

Rendered from Figma on 2026-08-12. These are the **approved design baseline** for the build.
If the Figma file moves ahead of these, re-export and commit in the same change as the code.

**Source file:** `https://www.figma.com/design/0S6E56v08klREoNwS06ry8`
**Page:** `SK ZIC — Landing Page` (`node-id=178-2`)

## Boards

| File | Board | Figma node | Native size |
|---|---|---|---|
| `01-desktop-1440-full.png` | Desktop — 1440 | `178:17` | 1440 × 11380 |
| `02-hero-scroll-storyboard.png` | Hero — Pinned Parallax Sequence | `195:2` | 1440 × 3810 |
| `03-mobile-375-full.png` | Mobile — 375 | `206:2` | 375 × 5670 |
| `04-handoff-tokens-motion.png` | Handoff — Tokens & Motion | `208:2` | 760 × 1500 |

## Sections at native width

Build against these. Each is the exact frame at 1440 px wide.

| File | Section | Figma node | Height |
|---|---|---|---|
| `sections/s01-hero.png` | 01 — Hero, one product centred | `178:18` | 1140 |
| `sections/s02-splash.png` | 02 — The Splash | `228:2` | 980 |
| `sections/s03-the-five.png` | 03 — The Five, range reveal | `228:8` | 1020 |
| `sections/s04-proof-manifest.png` | 04 — Proof manifest | `178:19` | 340 |
| `sections/s05-ch01-inside.png` | 05 — Ch.01 What is happening inside? | `178:20` | 900 |
| `sections/s06-ch02-yubase.png` | 06 — Ch.02 Performance begins with the base | `178:21` | 1160 |
| `sections/s07-ch03-vhvi.png` | 07 — Ch.03 Stable under change | `178:22` | 940 |
| `sections/s08-ch04-find-your-zic.png` | 08 — Ch.04 Find your ZIC | `178:23` | 1260 |
| `sections/s09-ch05-atf-multi.png` | 09 — Ch.05 "Multi" does not mean any | `178:24` | 1140 |
| `sections/s10-ch06-distribution.png` | 10 — Ch.06 Where to get it | `178:25` | 1000 |
| `sections/s11-enquire.png` | 11 — Enquire | `178:26` | 1080 |
| `sections/s12-footer.png` | 12 — Footer | `178:27` | 420 |

## Design variables

A `ZIC` variable collection lives in the Figma file (`VariableCollectionId:178:3`) holding the
13 colour tokens. It mirrors `app/tokens.css`. Change both together or neither.

## Known placeholder in these renders

`sections/s03-the-five.png` shows **ZIC X3000 as a 20W-50 4 L Pakistan-market jerrycan**, tagged
in-comp with a red `PLACEHOLDER ART` label. South Africa stocks 15W-40 in 6 L, and no official
render of that pack exists on any SK ZIC channel. It must be replaced before launch.
