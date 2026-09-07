'use client';

import { clearConsent } from '@/lib/consent';

/** Footer-weight version of ManageCookiesButton — a plain link, not a CTA button. */
export default function CookiePreferencesLink() {
  return (
    <button type="button" onClick={clearConsent} className="underline underline-offset-4">
      Cookie preferences
    </button>
  );
}
