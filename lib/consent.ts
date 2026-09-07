/**
 * Cookie consent storage. One localStorage key, one status, one event so the
 * banner, the Cookie Notice page's "change your mind" control, and the
 * analytics loader can all stay in sync without a context provider.
 */
export type ConsentStatus = 'accepted' | 'rejected';

export interface ConsentRecord {
  status: ConsentStatus;
  /** ISO timestamp, kept so a "when did you agree" question is answerable. */
  decidedAt: string;
}

const STORAGE_KEY = 'skzic-cookie-consent';
export const CONSENT_EVENT = 'skzic:consent-updated';

export function getConsent(): ConsentRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.status !== 'accepted' && parsed.status !== 'rejected') return null;
    return { status: parsed.status, decidedAt: parsed.decidedAt ?? '' };
  } catch {
    return null;
  }
}

export function saveConsent(status: ConsentStatus) {
  if (typeof window === 'undefined') return;
  const record: ConsentRecord = { status, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage may be unavailable (private browsing, blocked site data). The
    // banner will simply reappear next visit — fail safe, not fail closed.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Used by the Cookie Notice page's "Change cookie preferences" control. */
export function clearConsent() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // See saveConsent — non-fatal either way.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
