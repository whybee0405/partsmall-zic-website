/**
 * Authority claims. Every one is sourced in docs/RESEARCH.md §1.2 and §2.2.
 *
 * Do not add a claim here without a source. Do not sharpen the wording of an
 * existing one: the Brand Power Index figure in particular is deliberately
 * vague because published counts disagree (23 vs 25 consecutive years).
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
    value: 'Korea’s No.1 engine oil brand every year since its 1995 launch.',
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

/** YUBASE production capacity, Ch.02. */
export const YUBASE_CAPACITY =
  'ULSAN 48,600 b/d   ·   ILBOC CARTAGENA 19,300 b/d   ·   PATRASK DUMAI 12,500 b/d';
