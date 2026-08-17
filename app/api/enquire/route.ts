import { NextResponse } from 'next/server';
import { validateEnquiry, type EnquiryPayload } from '@/lib/enquiry';

export async function POST(request: Request) {
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

  // TODO(Parts-Mall Africa): this only logs server-side. Wire it to a real
  // destination — e.g. a transactional email to the sales inbox, or a CRM
  // webhook — once that destination is decided. See docs/CUSTOMER-JOURNEY-AUDIT.md B1.
  console.log('[enquiry]', JSON.stringify({ ...payload, receivedAt: new Date().toISOString() }));

  return NextResponse.json({ ok: true });
}
