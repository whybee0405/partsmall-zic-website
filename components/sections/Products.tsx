'use client';

import { useState } from 'react';
import { PRODUCTS, FAMILIES } from '@/content/products';
import { Stamp, Notice, ClaimChip } from '@/components/ui';

/**
 * 08 — Ch.04. Find your ZIC.
 *
 * The section the fleet manager scrolled here for. A real table on desktop,
 * disclosure cards below 768px, never a horizontally scrolling table.
 *
 * This is the one place the page abandons centre alignment: tabular data needs
 * left-aligned columns to be readable, and readability outranks symmetry when
 * someone is checking whether an oil carries an approval.
 *
 * Design: docs/design-snapshots/sections/s08-ch04-find-your-zic.png
 */
export default function Products() {
  const [family, setFamily] = useState<string>('petrol');
  const [open, setOpen] = useState<string | null>('x7-5w30');

  const rows = PRODUCTS.filter((p) => p.family === family);

  return (
    <section
      id="products"
      className="py-24 lg:py-28"
      style={{ background: 'var(--color-eng-white)' }}
    >
      <div className="shell stack-centre">
        <Stamp>Ch.04 / 06 — South African range — Specification first</Stamp>

        <h2 className="t-display t-h2 mt-6">Find your ZIC.</h2>

        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-lead)', color: 'var(--color-deep-steel)' }}
        >
          Five products. Seven pack sizes. Everything Parts-Mall Africa actually holds, and nothing
          it does not.
        </p>

        <div className="mt-10 w-full">
          <Notice label="[ The rule ]">
            Start with the specification your vehicle manufacturer requires. Then match the ZIC
            product. Never the other way round, and never by viscosity alone.
          </Notice>
        </div>

        {/* Family filter */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5" role="tablist" aria-label="Product family">
          {FAMILIES.map((f) => {
            const active = f.id === family;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setFamily(f.id);
                  setOpen(null);
                }}
                className="t-mono min-h-[44px] rounded-[4px] px-5 text-[0.75rem] tracking-[0.06em]"
                style={{
                  background: active ? 'var(--color-zic-red)' : 'var(--color-pure-white)',
                  color: active ? 'var(--color-pure-white)' : 'var(--color-deep-steel)',
                  border: active ? '1px solid transparent' : '1px solid var(--color-hairline)',
                  transition: 'background 180ms ease, color 180ms ease',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="mt-12 w-full text-left">
          <div
            className="hidden md:grid md:grid-cols-[1.4fr_0.8fr_1.9fr_1.6fr_auto] md:gap-6 md:pb-3"
            style={{ borderBottom: '1px solid var(--color-carbon)' }}
          >
            {['Product', 'Pack sizes', 'Specification', 'Who it’s for', ''].map((h) => (
              <span key={h} className="t-label" style={{ color: 'var(--color-steel-text)' }}>
                {h}
              </span>
            ))}
          </div>

          <ul>
            {rows.map((p) => {
              const isOpen = open === p.id;
              return (
                <li
                  key={p.id}
                  style={{
                    borderBottom: '1px solid var(--color-hairline)',
                    background: isOpen ? 'var(--color-pure-white)' : 'transparent',
                    borderLeft: isOpen ? '3px solid var(--color-zic-red)' : '3px solid transparent',
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : p.id)}
                    aria-expanded={isOpen}
                    aria-controls={`panel-${p.id}`}
                    className="grid w-full grid-cols-1 gap-2 px-4 py-6 text-left md:grid-cols-[1.4fr_0.8fr_1.9fr_1.6fr_auto] md:items-start md:gap-6"
                  >
                    <span>
                      <span
                        className="t-display block text-[1.25rem] font-semibold tracking-[-0.02em]"
                        style={{ color: 'var(--color-carbon)' }}
                      >
                        {p.name}
                      </span>
                      <span className="t-mono block text-[0.75rem]" style={{ color: 'var(--color-steel-text)' }}>
                        {p.grade}
                      </span>
                    </span>

                    <span className="t-mono text-[0.8125rem] font-semibold tracking-[0.04em]">
                      {p.packSizes.join(' · ')}
                    </span>

                    <span className="t-mono text-[0.75rem] leading-[1.65]" style={{ color: 'var(--color-deep-steel)' }}>
                      {p.specification.length ? p.specification.join('\n') : p.oilType}
                    </span>

                    <span className="text-[0.875rem] leading-[1.58]" style={{ color: 'var(--color-steel-text)' }}>
                      {p.whoItsFor}
                    </span>

                    <span className="t-mono hidden text-[1.125rem] md:block" style={{ color: 'var(--color-steel-text)' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    id={`panel-${p.id}`}
                    inert={!isOpen}
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      opacity: isOpen ? 1 : 0,
                      transition:
                        'grid-template-rows var(--dur-disclose) var(--ease-out), opacity var(--dur-disclose) var(--ease-out)',
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-8">
                        {p.claims && p.claims.length > 0 && (
                          <ul className="mb-6 flex flex-wrap gap-3">
                            {p.claims.map((c) => (
                              <li key={c.value} className="flex items-center gap-2">
                                <ClaimChip verb={c.verb} />
                                <span className="t-mono text-[0.75rem]">{c.value}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {p.properties && (
                          <dl className="grid grid-cols-2 gap-x-8 gap-y-2 md:grid-cols-4">
                            {Object.entries(p.properties).map(([k, v]) => (
                              <div key={k}>
                                <dt className="t-label" style={{ color: 'var(--color-steel-text)' }}>
                                  {k}
                                </dt>
                                <dd className="t-mono text-[0.8125rem]">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        {p.warning && (
                          <p
                            className="mt-6 text-[0.875rem] leading-[1.55]"
                            style={{ color: 'var(--color-zic-red)' }}
                          >
                            {p.warning}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-12 w-full">
          <Notice label="[ Important ]" tone="alert">
            ZIC X7 Diesel is formulated for diesel engines without DPF, CPF or SCR. ZIC X3000 is API
            CG-4, an older diesel category. Neither is a Low SAPS oil, so neither belongs in a modern
            particulate-filter diesel unless the manufacturer specification explicitly permits it.
          </Notice>
        </div>
      </div>
    </section>
  );
}
