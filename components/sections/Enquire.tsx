'use client';

import { useId } from 'react';
import { ENQUIRY_REGIONS, ENQUIRY_INTERESTS } from '@/content/branches';
import { PRIMARY_CTA } from '@/content/cta';

/**
 * 11 — Enquire. The close.
 *
 * Visible labels on every field, never placeholder-only. Validation on blur,
 * not on keystroke. Errors render below the field they belong to.
 *
 * Design: docs/design-snapshots/sections/s11-enquire.png
 */

function Field({
  label,
  name,
  type = 'text',
  required,
  helper,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  helper?: string;
  children?: React.ReactNode;
}) {
  const id = useId();
  const style = {
    background: 'color-mix(in oklab, var(--color-graphite) 60%, transparent)',
    border: '1px solid var(--color-deep-steel)',
    color: 'var(--color-eng-white)',
  } as const;

  return (
    <div className="text-left">
      <label htmlFor={id} className="t-label block" style={{ color: 'var(--color-metal-grey)' }}>
        {label}
        {required && ' *'}
      </label>
      {children ? (
        <select id={id} name={name} required={required} className="mt-2 h-13 w-full rounded-[4px] px-4" style={style}>
          {children}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} name={name} rows={4} className="mt-2 w-full rounded-[4px] px-4 py-3" style={style} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined}
          autoComplete={
            type === 'tel' ? 'tel' : type === 'email' ? 'email' : name === 'name' ? 'name' : 'off'
          }
          className="mt-2 h-13 w-full rounded-[4px] px-4"
          style={style}
        />
      )}
      {helper && (
        <p className="mt-2 text-[0.75rem]" style={{ color: 'var(--color-steel-text)' }}>
          {helper}
        </p>
      )}
    </div>
  );
}

export default function Enquire() {
  return (
    <section
      id="enquire"
      className="chamber-dark relative py-24 lg:py-28"
      style={{ background: 'var(--color-carbon)' }}
    >
      {/* The red flow line arriving from the rail, closing the argument that
          started with the splash. */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-24 w-px -translate-x-1/2"
        style={{ background: 'var(--color-zic-red)' }}
      />

      <div className="shell stack-centre">
        <p className="t-label mt-8" style={{ color: 'var(--color-zic-red)' }}>
          [ Enquire ]
        </p>

        <h2 className="t-display t-h2 mt-4" style={{ color: 'var(--color-eng-white)' }}>
          Tell us what you run.
        </h2>

        <p
          className="t-lead mt-6"
          style={{ maxWidth: 'var(--measure-body)', color: 'var(--color-metal-grey)' }}
        >
          Workshop, fleet, dealership or driveway. Tell us the vehicle or the specification and we
          will point you at the right ZIC product and the nearest branch that has it.
        </p>

        <form
          className="mt-12 grid w-full max-w-[680px] grid-cols-1 gap-6 sm:grid-cols-2"
          action="/api/enquire"
          method="post"
        >
          <Field label="Name" name="name" required />
          <Field label="Business or workshop" name="business" />
          <Field label="Phone" name="phone" type="tel" required />
          <Field label="Email" name="email" type="email" required />

          <Field label="Province" name="province" required>
            <option value="">Select…</option>
            {ENQUIRY_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Field>

          <Field label="I’m asking about" name="interest" required>
            <option value="">Select…</option>
            {ENQUIRY_INTERESTS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Vehicle or specification"
              name="vehicle"
              helper="e.g. “2019 Hyundai Creta 1.6” or “ACEA C3”"
            />
          </div>

          <div className="sm:col-span-2">
            <Field label="Message" name="message" type="textarea" />
          </div>

          <div className="sm:col-span-2 flex flex-col items-center">
            <button type="submit" className="btn btn-primary !min-h-[60px] !px-12 !text-[1.0625rem]">
              {PRIMARY_CTA.label}
            </button>
            <p className="mt-6 text-[0.8125rem]" style={{ color: 'var(--color-steel-text)' }}>
              We reply within one business day. Your details are not shared outside Parts-Mall
              Africa.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
