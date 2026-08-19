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
