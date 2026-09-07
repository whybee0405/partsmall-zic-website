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
                className="mt-2 text-base font-semibold"
                style={{ color: 'var(--color-carbon)' }}
              >
                {cell.title}
              </p>
              <p
                className="mt-2 text-base leading-[1.55]"
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
