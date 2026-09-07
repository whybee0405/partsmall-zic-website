'use client';

import { clearConsent } from '@/lib/consent';

/** Footer-weight version of ManageCookiesButton — a plain link, not a CTA button. */
export default function CookiePreferencesLink() {
  return (
    <button type="button" onClick={clearConsent} className="group relative inline-block">
      Cookie preferences
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left scale-x-0 transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-x-100"
        style={{ background: 'var(--color-zic-red)' }}
      />
    </button>
  );
}
