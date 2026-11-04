import { NextResponse } from 'next/server';
import { validateEnquiry, type EnquiryPayload } from '@/lib/enquiry';
import { emailDeliveryConfigured, sendEnquiryEmail } from '@/lib/mailer';
import { clientIp, rateLimit } from '@/lib/rate-limit';

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

  // Server log stays regardless — it's the only record if RESEND_API_KEY
  // isn't set yet, and a paper trail even when it is.
  console.log('[enquiry]', JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }));

  if (!emailDeliveryConfigured) {
    // No RESEND_API_KEY configured yet — log-only, same as before. Not an
    // error: this keeps local/dev and any pre-launch environment working
    // without the key. See docs/CUSTOMER-JOURNEY-AUDIT.md B1.
    return NextResponse.json({ ok: true });
  }

  const result = await sendEnquiryEmail(enquiry);
  if (!result.ok) {
    console.error('[enquiry] email delivery failed:', result.error);
    return NextResponse.json(
      {
        ok: false,
        errors: { form: "Couldn't send your enquiry — please try WhatsApp or phone instead, both on this page." },
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
