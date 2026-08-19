/**
 * Authority claims. Every one is sourced in docs/RESEARCH.md §1.2 and §2.2.
 *
 * Do not add a claim here without a source. The Brand Power Index figure
 * moves every year the streak continues — it is pinned to the exact wording
 * of skzic.com/eng/index.do as retrieved on 2026-08-19; re-verify against
 * that page before reusing it much past this date rather than assuming the
 * number still holds.
 */

export interface ProofCell {
  label: string;
  value: string;
}

export const PROOF_CELLS: ProofCell[] = [
  {
    label: '[ BASE OIL ]',
    value: 'World’s No.1 Group III base oil, at ~35% of global supply.',
  },
  {
    label: '[ HERITAGE ]',
    value: 'No.1 in the Korea Brand Power Index for 28 consecutive years.',
  },
  {
    label: '[ NETWORK ]',
    value: '40+ branches, 9 provinces and 5 Southern African countries.',
  },
  {
    label: '[ ACCREDITATION ]',
    value: 'RMI Approved distribution through Parts-Mall Africa.',
  },
];

export interface CapacityCell {
  amount: string;
  site: string;
}

/** YUBASE production capacity, Ch.02. Source: docs/RESEARCH.md §1.2. */
export const YUBASE_CAPACITY: CapacityCell[] = [
  { amount: '48,600 b/d', site: 'Ulsan' },
  { amount: '19,300 b/d', site: 'ILBOC · Cartagena' },
  { amount: '12,500 b/d', site: 'PatraSK · Dumai' },
];
