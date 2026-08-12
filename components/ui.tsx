import Link from 'next/link';
import type { ReactNode } from 'react';

/** Chapter stamp. Used exactly once per chapter, never as section grammar. */
export function Stamp({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className="t-stamp"
      style={{ color: dark ? 'var(--color-metal-grey)' : 'var(--color-steel-text)' }}
    >
      {children}
    </p>
  );
}

export function Cta({
  href,
  external,
  children,
  variant = 'primary',
  className = '',
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const cls = `btn btn-${variant} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/**
 * Claim chip. Makes the BRAND-DNA claim taxonomy visible, because "approved by"
 * and "meets or exceeds" are legally different things and the page must not
 * flatten them into one another.
 */
export function ClaimChip({ verb }: { verb: string }) {
  const approved = verb === 'approved';
  const label = approved ? 'APPROVED BY' : 'MEETS OR EXCEEDS';
  return (
    <span
      className="t-label inline-block rounded-[3px] px-2 py-1"
      style={{
        background: 'var(--color-fluid-grey)',
        color: approved ? 'var(--color-zic-red)' : 'var(--color-steel-text)',
      }}
    >
      {label}
    </span>
  );
}

/** Bordered notice. Never body copy: warnings must look like warnings. */
export function Notice({
  label,
  children,
  tone = 'quiet',
}: {
  label: string;
  children: ReactNode;
  tone?: 'quiet' | 'alert';
}) {
  return (
    <div
      className="mx-auto w-full rounded-[8px] p-6 text-left"
      style={{
        maxWidth: 'var(--measure-headline)',
        background: tone === 'alert' ? 'var(--color-pure-white)' : 'var(--color-fluid-grey)',
        border: tone === 'alert' ? '1px solid var(--color-zic-red)' : 'none',
        borderLeft: tone === 'quiet' ? '3px solid var(--color-zic-red)' : undefined,
      }}
    >
      <p className="t-label" style={{ color: 'var(--color-zic-red)' }}>
        {label}
      </p>
      <p className="mt-2 text-[0.9375rem] leading-[1.55]" style={{ color: 'var(--color-deep-steel)' }}>
        {children}
      </p>
    </div>
  );
}

/** Hairline rule, full content width. */
export function Rule({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <div
      className={className}
      style={{
        height: 1,
        background: dark ? 'var(--color-deep-steel)' : 'var(--color-hairline)',
      }}
    />
  );
}
