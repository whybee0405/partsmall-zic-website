import { PROOF_CELLS, PROOF_SOURCE_LINE } from '@/content/proof';

/**
 * 04 — Proof manifest.
 *
 * A rule-separated manifest, deliberately echoing the cover manifest in the
 * Parts-Mall Africa brand manual so the two documents read as one company.
 *
 * Explicitly not the hero-metric template: no oversized numerals, no gradient
 * accents, no icons. The claims carry themselves.
 *
 * Design: docs/design-snapshots/sections/s04-proof-manifest.png
 */
export default function Proof() {
  return (
    <section
      id="proof"
      className="chamber-dark py-16"
      style={{ background: 'var(--color-carbon)' }}
    >
      <div className="shell">
        <div style={{ height: 1, background: 'var(--color-deep-steel)' }} />

        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF_CELLS.map((cell, i) => (
            <li
              key={cell.label}
              className="lg:pl-6"
              style={{
                borderLeft:
                  i > 0 ? '1px solid var(--color-deep-steel)' : undefined,
              }}
            >
              <p className="t-label" style={{ color: 'var(--color-zic-red)' }}>
                {cell.label}
              </p>
              <p
                className="mt-3 text-[0.9375rem] leading-[1.55] lg:text-base"
                style={{ color: 'var(--color-eng-white)' }}
              >
                {cell.value}
              </p>
            </li>
          ))}
        </ul>

        <p className="t-label mt-12" style={{ color: 'var(--color-steel-text)' }}>
          {PROOF_SOURCE_LINE}
        </p>
      </div>
    </section>
  );
}
