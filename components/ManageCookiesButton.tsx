'use client';

import { clearConsent } from '@/lib/consent';

/** Clears the stored choice, which re-shows the persistent CookieBanner. */
export default function ManageCookiesButton() {
  return (
    <button type="button" onClick={clearConsent} className="btn btn-primary !min-h-[44px] !px-6">
      Change cookie preferences
    </button>
  );
}
