import { NextResponse } from 'next/server';
import { validateEnquiry, type EnquiryPayload } from '@/lib/enquiry';
import { emailDeliveryConfigured, sendEnquiryEmail } from '@/lib/mailer';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { CLOUDIA_URL } from '@/lib/cms/content';

// 5 submissions per 5 minutes per IP — generous for a genuine buyer filling
// the form more than once, tight enough to blunt a scripted spam run.
const ENQUIRY_RATE_LIMIT = 5;
const ENQUIRY_RATE_WINDOW_MS = 5 * 60_000;

export async function POST(request: Request) {
  const { limited, retryAfterSeconds } = rateLimit(clientIp(request), ENQUIRY_RATE_LIMIT, ENQUIRY_RATE_WINDOW_MS);
  if (limited) {
    return NextResponse.json(
      { ok: false, errors: { form: 'Too many submissions — please try again shortly.' } },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    );
  }

  let payload: Partial<EnquiryPayload>;
  try {
    payload = (await request.json()) as Partial<EnquiryPayload>;
  } catch {
    return NextResponse.json({ ok: false, errors: { form: 'Malformed request.' } }, { status: 400 });
  }

  const errors = validateEnquiry(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const enquiry = payload as EnquiryPayload;

  // Store first, in CloudIA's private Enquiries form (staff-only, at /admin), so a lead never
  // depends on email delivery. The visitor's address (for the CMS's throttle, never stored) and
  // analytics session (to credit the lead's source) are forwarded.
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  for (const name of ['x-forwarded-for', 'user-agent', 'referer', 'x-cloudia-session']) {
    const value = request.headers.get(name);
    if (value) headers[name] = value;
  }
  const optional = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : undefined);
  let stored = false;
  try {
    const response = await fetch(`${CLOUDIA_URL}/api/enquiries`, {
      method: 'POST',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        name: enquiry.name.trim(),
        business: optional(enquiry.business),
        phone: enquiry.phone.trim(),
        email: enquiry.email.trim(),
        province: enquiry.province.trim(),
        interest: enquiry.interest.trim(),
        vehicle: optional(enquiry.vehicle),
        message: optional(enquiry.message),
      }),
    });
    if (response.status === 429) {
      return NextResponse.json(
        { ok: false, errors: { form: 'Too many submissions — please try again shortly.' } },
        { status: 429 },
      );
    }
    stored = response.ok;
    if (!stored) console.error('[enquiry] CMS refused the enquiry:', response.status, await response.text());
  } catch (error) {
    console.error('[enquiry] CMS unreachable:', error);
  }
  if (!stored) {
    // Never lose a lead silently: the server log keeps it for recovery.
    console.log('[enquiry] not stored, kept here:', JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }));
  }

  const result = emailDeliveryConfigured ? await sendEnquiryEmail(enquiry) : null;
  if (result && !result.ok) console.error('[enquiry] email delivery failed:', result.error);

  // Saved in the CMS, or emailed: the lead reached Parts-Mall either way.
  if (stored || result?.ok) return NextResponse.json({ ok: true });

  return NextResponse.json(
    {
      ok: false,
      errors: { form: "Couldn't send your enquiry — please try WhatsApp or phone instead, both on this page." },
    },
    { status: 502 },
  );
}
