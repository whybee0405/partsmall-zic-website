'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CONSENT_EVENT, getConsent, saveConsent, type ConsentStatus } from '@/lib/consent';

/**
 * Bottom consent bar. Accept and Reject are the same size and the same
 * visual weight on purpose — a real choice, not a default dressed up as one.
 *
 * Mounted once in the root layout. Stays hidden once a decision is stored,
 * but listens for CONSENT_EVENT so the Cookie Notice page's "change your
 * mind" control can bring it back without a reload.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(getConsent() === null);
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);

  function decide(status: ConsentStatus) {
    saveConsent(status);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 z-50 border-t"
      style={{
        bottom: 'var(--sticky-cta-height)',
        background: 'var(--color-carbon)',
        borderColor: 'var(--color-deep-steel)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="shell flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-metal-grey)' }}>
          This site uses cookies that are strictly necessary to run it, plus Google Analytics. Accept to
          allow analytics cookies that remember you between visits. Reject to keep analytics
          cookie-free.{' '}
          <Link href="/cookies" className="underline underline-offset-4" style={{ color: 'var(--color-eng-white)' }}>
            Cookie Notice
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide('rejected')}
            className="btn btn-secondary !min-h-[44px] flex-1 lg:flex-none"
            style={{ color: 'var(--color-eng-white)' }}
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="btn btn-primary !min-h-[44px] flex-1 lg:flex-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
