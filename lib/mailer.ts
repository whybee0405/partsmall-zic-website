import { Resend } from 'resend';
import { COMPANY } from '@/content/company';
import type { EnquiryPayload } from '@/lib/enquiry';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Resend's shared sandbox sender works with no domain verification, so this
// is a safe default — but it's rate-limited and can only send to the
// account owner's own address. Verify skzic.co.za (or parts-mall.co.za) in
// the Resend dashboard, then set RESEND_FROM_EMAIL to something like
// "SK ZIC Website <enquiries@skzic.co.za>" for real production delivery.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'SK ZIC Website <onboarding@resend.dev>';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

/** False when RESEND_API_KEY isn't set — callers fall back to log-only delivery. */
export const emailDeliveryConfigured = Boolean(resend);

export type SendEnquiryResult = { ok: true } | { ok: false; error: string };

export async function sendEnquiryEmail(payload: EnquiryPayload): Promise<SendEnquiryResult> {
  if (!resend) return { ok: false, error: 'RESEND_API_KEY is not configured' };

  const fields: [string, string | undefined][] = [
    ['Name', payload.name],
    ['Business', payload.business],
    ['Phone', payload.phone],
    ['Email', payload.email],
    ['Province', payload.province],
    ['Interest', payload.interest],
    ['Vehicle', payload.vehicle],
    ['Message', payload.message],
  ];

  const text = fields
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: COMPANY.email,
      replyTo: payload.email,
      subject: `New enquiry — ${payload.name} (${payload.interest})`,
      text,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error sending mail' };
  }
}
