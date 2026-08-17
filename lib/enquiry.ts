/**
 * Shared enquiry validation — used by the client form (blur + submit) and
 * the /api/enquire route handler, so the two can never disagree.
 */

export const ENQUIRY_FIELDS = ['name', 'phone', 'email', 'province', 'interest'] as const;

export type EnquiryField = (typeof ENQUIRY_FIELDS)[number];

export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export interface EnquiryPayload {
  name: string;
  business?: string;
  phone: string;
  email: string;
  province: string;
  interest: string;
  vehicle?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,}$/;

const FIELD_VALIDATORS: Record<EnquiryField, (value: string) => string | undefined> = {
  name: (v) => (v.trim() ? undefined : 'Enter your name.'),
  phone: (v) => {
    const value = v.trim();
    if (!value) return 'Enter a phone number.';
    if (!PHONE_RE.test(value)) return "That doesn't look like a phone number.";
    return undefined;
  },
  email: (v) => {
    const value = v.trim();
    if (!value) return 'Enter an email address.';
    if (!EMAIL_RE.test(value)) return 'Enter a valid email address.';
    return undefined;
  },
  province: (v) => (v.trim() ? undefined : 'Select a province.'),
  interest: (v) => (v.trim() ? undefined : "Select what you're asking about."),
};

export function isEnquiryField(name: string): name is EnquiryField {
  return (ENQUIRY_FIELDS as readonly string[]).includes(name);
}

export function validateField(field: EnquiryField, value: string): string | undefined {
  return FIELD_VALIDATORS[field](value);
}

export function validateEnquiry(payload: Partial<Record<EnquiryField, string>>): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const field of ENQUIRY_FIELDS) {
    const message = validateField(field, payload[field] ?? '');
    if (message) errors[field] = message;
  }
  return errors;
}
