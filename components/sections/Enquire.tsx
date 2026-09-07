'use client';

import { useId, useState, type FocusEvent, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ENQUIRY_REGIONS, ENQUIRY_INTERESTS } from '@/content/branches';
import { PRIMARY_CTA } from '@/content/cta';
import { validateEnquiry, validateField, isEnquiryField, type EnquiryErrors } from '@/lib/enquiry';
import { trackEvent } from '@/lib/analytics';

/**
 * 11 — Enquire. The close.
 *
 * Visible labels on every field, never placeholder-only. Validation on blur,
 * not on keystroke. Errors render below the field they belong to.
 *
 * Design: docs/design-snapshots/sections/s11-enquire.png
 */

type FieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function Field({
  label,
  name,
  type = 'text',
  required,
  helper,
  error,
  onBlur,
  children,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  helper?: string;
  error?: string;
  onBlur?: (event: FocusEvent<FieldElement>) => void;
  children?: ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const style = {
    background: 'color-mix(in oklab, var(--color-graphite) 60%, transparent)',
    border: `1px solid ${error ? 'var(--color-zic-red)' : 'var(--color-deep-steel)'}`,
    color: 'var(--color-eng-white)',
  } as const;

  return (
    <div className="text-left">
      <label htmlFor={id} className="t-label block" style={{ color: 'var(--color-metal-grey)' }}>
        {label}
        {required && ' *'}
      </label>
      {children ? (
        <select
          id={id}
          name={name}
          required={required}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="mt-2 h-13 w-full rounded-[4px] px-4"
          style={style}
        >
          {children}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          onBlur={onBlur}
          className="mt-2 w-full rounded-[4px] px-4 py-3"
          style={style}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          onBlur={onBlur}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined}
          autoComplete={
            type === 'tel' ? 'tel' : type === 'email' ? 'email' : name === 'name' ? 'name' : 'off'
          }
          className="mt-2 h-13 w-full rounded-[4px] px-4"
          style={style}
        />
      )}
      {error ? (
        <p id={errorId} className="mt-2 text-base" style={{ color: 'var(--color-zic-red)' }}>
          {error}
        </p>
      ) : helper ? (
        <p className="mt-2 text-base" style={{ color: 'var(--color-steel-text)' }}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export default function Enquire() {
  const router = useRouter();
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');

  function handleBlur(event: FocusEvent<FieldElement>) {
    const { name, value } = event.target;
    if (!isEnquiryField(name)) return;
    const message = validateField(name, value);
    setErrors((prev) => {
      if (!message) {
        if (!(name in prev)) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: message };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const fieldErrors = validateEnquiry(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      const firstInvalidName = Object.keys(fieldErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstInvalidName}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus('submitting');
    try {
      const response = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Request failed');
      trackEvent('generate_lead', { form: 'enquire' });
      // Stay in 'submitting' (button disabled, "Sending…") through the
      // navigation rather than resetting to 'idle' — avoids a flash of the
      // blank form right before the page changes.
      router.push('/thank-you');
    } catch {
      setStatus('error');
    }
  }

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
          noValidate
          onSubmit={handleSubmit}
          aria-busy={status === 'submitting'}
          className="mt-12 grid w-full max-w-[680px] grid-cols-1 gap-6 sm:grid-cols-2"
        >
            <Field label="Name" name="name" required error={errors.name} onBlur={handleBlur} />
            <Field label="Business or workshop" name="business" />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              required
              error={errors.phone}
              onBlur={handleBlur}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              error={errors.email}
              onBlur={handleBlur}
            />

            <Field
              label="Province"
              name="province"
              required
              error={errors.province}
              onBlur={handleBlur}
            >
              <option value="">Select…</option>
              {ENQUIRY_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Field>

            <Field
              label="I’m asking about"
              name="interest"
              required
              error={errors.interest}
              onBlur={handleBlur}
            >
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

            {status === 'error' && (
              <div className="sm:col-span-2" role="alert">
                <p className="text-base" style={{ color: 'var(--color-zic-red)' }}>
                  Something went wrong sending that. Please try again, or email us directly.
                </p>
              </div>
            )}

            <div className="sm:col-span-2 flex flex-col items-center">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn btn-primary !min-h-[60px] !px-12 !text-[1.0625rem]"
                style={status === 'submitting' ? { opacity: 0.7, cursor: 'wait' } : undefined}
              >
                {status === 'submitting' ? 'Sending…' : PRIMARY_CTA.label}
              </button>
              <p className="mt-6 text-base" style={{ color: 'var(--color-steel-text)' }}>
                We reply within one business day. See our{' '}
                <a href="/privacy" className="underline underline-offset-4">
                  Privacy Notice
                </a>{' '}
                for how Parts-Mall Africa uses your details.
              </p>
            </div>
        </form>
      </div>
    </section>
  );
}
