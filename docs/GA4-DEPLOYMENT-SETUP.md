# Google Analytics 4 deployment and consent setup

Last reviewed: 19 August 2026

## Status update — 7 September 2026

GA4 is now installed and live with the client's real Measurement ID, using **Google's Consent Mode
v2** (called "Advanced Consent Mode" in the original plan below): the gtag script and a
`consent: 'default'` (denied) call load unconditionally on every page, so cookie-free measurement
pings reach Google before any visitor makes a cookie choice. Full cookie-based tracking still only
starts after a visitor accepts the banner.

This is a deliberate departure from Basic Consent Mode as originally planned below, made at the
site owner's explicit request, specifically so Google's own tag-installation checker (which only
inspects the page in its default, no-interaction state) detects the tag as installed. **The "new
privacy and legal review" this document calls for before using Advanced Consent Mode has not
happened** — that request was answered in an engineering conversation, not by counsel. Flagging
this explicitly rather than quietly rewriting the requirement below out of the document.

The rest of this document is the original pre-launch plan, kept as a record of that plan and
mostly still accurate (event helper shape, environment variables, banner requirements) — the one
place it's now wrong is "Current state" immediately below, which describes the pre-launch,
not-yet-installed state.

## Current state (as originally planned — see status update above for what's actually live)

Google Analytics 4 (GA4) is not installed. The site is being developed on localhost, and the
development team does not yet have access to the client's GA4 account or Measurement ID.

Until the production GA4 property is available:

- Do not send analytics requests to Google.
- Do not use a developer-owned GA4 property as the client's permanent property.
- Do not show a cookie consent banner on the public site when no optional tracking is active.
- Do not state in the privacy or cookie policy that GA4 is active.
- Keep analytics disabled on localhost by default, including after the production ID is received.

This document is the implementation and launch checklist for enabling GA4 later.

## Intended setup

The website will use GA4 directly through Google's `gtag.js`. A CMS, external consent platform,
and application database are not required.

The implementation must use **Basic Consent Mode**:

- GA4 is not loaded before the visitor grants analytics consent.
- Rejecting consent sends no analytics request to Google.
- Accepting consent loads GA4 and enables approved events.
- The visitor's choice is stored in a necessary first-party consent cookie.
- The visitor can change or withdraw consent from a permanent footer link.

Do not use Advanced Consent Mode without a new privacy and legal review. Advanced mode can send
cookieless measurements to Google before the visitor accepts analytics.

Google's current explanation of the two modes is available in the
[Consent Mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode).

## Client actions required before implementation

The client should complete the following under a company-controlled Google account:

1. Create or select the correct Google Analytics account.
2. Create a GA4 property for the SK ZIC South Africa website.
3. Set the correct reporting time zone and currency for the business.
4. Create a Web Data Stream for the final production domain.
5. Provide the `G-XXXXXXXXXX` Measurement ID to the developer through an approved secure channel.
6. Grant individual Google accounts access if developers must configure or test the property.
7. Keep at least two company-controlled administrators on the Analytics account.
8. Confirm who inside the business owns privacy requests, analytics access, and future Google Ads
   integration.

Do not share Google passwords. Do not make a developer's personal Google account the sole owner of
the property.

## Codebase work required

Create a small analytics integration with responsibilities separated into modules. Exact paths may
change to match the application structure, but the intended shape is:

```text
components/
  CookieConsent.tsx
  CookieSettings.tsx

lib/analytics/
  consent.ts
  google-analytics.ts
  events.ts
```

The implementation should provide:

- A single source of truth for consent state.
- A GA4 script loader that runs only after analytics consent.
- A typed event helper that becomes a no-op when analytics is unavailable or rejected.
- Client-side route-change tracking appropriate for the Next.js App Router.
- A cookie banner and settings dialog with keyboard and screen-reader support.
- A footer link that reopens cookie settings.
- Versioned consent storage so a material policy change can request consent again.
- Privacy and cookie policy pages linked from the footer and banner.

Do not place GA4 calls throughout UI components. Components should call the central event helper.

## Environment variables

Use environment variables so tracking cannot be enabled accidentally:

```env
NEXT_PUBLIC_GA_ENABLED=false
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CONSENT_PREVIEW=false
```

Required behavior:

| Configuration | Result |
|---|---|
| `GA_ENABLED=false` | No banner, GA script, analytics cookies, or GA events |
| Missing Measurement ID | Same as disabled, even if the enabled flag is accidentally true |
| Enabled with a valid ID | Consent banner is available and GA remains blocked until acceptance |
| Consent preview enabled in development | Banner can be reviewed without loading or contacting GA |

The actual environment variable names can be adjusted during implementation. The important rule is
that both an explicit enable flag and a valid Measurement ID are required.

Production secrets or environment values must not be committed to Git. Add local variants to the
appropriate `.gitignore` entries and configure production values through the deployment system.

## Consent banner requirements

The initial banner should be short and limited to the choice that currently exists:

> We use optional analytics cookies to understand how visitors use our website. You can accept or
> reject analytics without affecting website functionality.

The first layer must provide equally clear actions:

- **Accept analytics**
- **Reject analytics**
- **Cookie policy**

The banner and settings dialog must meet these requirements:

- No preselected analytics consent.
- Rejection is no harder or less prominent than acceptance.
- Continuing to browse does not count as consent.
- Closing the banner does not grant consent.
- Necessary functionality remains available after rejection.
- The visitor can withdraw consent later.
- Previously created GA cookies are removed where the site can remove them after withdrawal.
- No separate acceptance of the general privacy policy is required merely to browse the site.

If advertising or personalization tools are added later, introduce separate analytics and marketing
categories. Do not silently treat analytics consent as advertising consent.

## Consent cookie

The site may use one necessary first-party cookie to remember the visitor's preference. A conceptual
value is:

```text
site_consent=v1:analytics=granted
```

Use an implementation that is:

- First party
- `Secure` in production
- `SameSite=Lax` unless a documented flow requires something different
- Restricted to the necessary path and domain scope
- Versioned
- Given a documented expiry

Review the chosen expiry with the business's privacy owner. Six months is a practical conservative
default for remembering the choice, but the final period should reflect applicable markets and any
legal advice.

## GA4 events

Prefer GA4 recommended events and keep the initial event set small:

| Event | Trigger | Important parameters |
|---|---|---|
| `page_view` | A consented page or route view | Sanitized page path and title |
| `view_item_list` | A product list becomes meaningfully visible | Product list identifier |
| `select_item` | A visitor selects a product from a list | Product identifier and category |
| `view_item` | A visitor views product details | Product identifier, name, category |
| `search` | A visitor performs a product search | Sanitized `search_term` |
| `file_download` | A catalogue, TDS, or MSDS file is downloaded | Public file name and document type |
| `generate_lead` | An enquiry is successfully submitted | Non-personal lead source only |
| `contact_click` | A visitor intentionally chooses a contact method | Contact method, never the address or number |
| `dealer_click` | A visitor follows a distributor or retailer link | Dealer identifier or destination host |
| `language_change` | A visitor changes site language | Language code |

Only record `generate_lead` after the server confirms a successful enquiry submission. Do not treat
opening or starting a form as a completed lead.

### Data that must never be sent to GA4

- Names
- Email addresses
- Telephone numbers
- Form messages
- Customer, account, vehicle, or order identifiers
- Vehicle identification numbers
- Exact addresses or precise location
- Complete IP addresses supplied as custom parameters
- Authentication tokens
- Sensitive search terms
- Full URLs containing personal information
- Any other data that can directly identify a visitor

Sanitize page locations, referrers, search terms, and custom event parameters before sending them.
Never send the contents of an enquiry form to analytics.

## GA4 property configuration

Before launch, review these settings inside the client-owned GA4 property:

- Keep Google Signals disabled initially.
- Keep advertising personalization disabled until there is a documented advertising use case and
  matching marketing consent.
- Do not link Google Ads until the business approves the purpose and consent flow.
- Enable email-address and sensitive URL query-parameter redaction.
- Disable granular location and device collection that the business does not need.
- Avoid demographics and interest reporting unless separately justified.
- Configure internal traffic filtering for developer and office traffic where practical.
- Restrict property access to staff who need it and review access periodically.
- Review Google's account data-sharing settings and enable only approved uses.
- Record the property name, property ID, stream name, stream ID, Measurement ID, and accountable
  business owner in the deployment record.

GA4 currently offers 2-month or 14-month user-level and event-data retention for standard
properties. Choose and document the minimum period that meets the reporting need. Fourteen months
supports year-on-year exploration; two months provides stronger minimization. Standard aggregated
reports are handled separately. See Google's
[data-retention documentation](https://support.google.com/analytics/answer/7667196?hl=en_SG).

GA4 uses IP addresses during collection to derive location and states that they are discarded before
being logged, but sending a request to Google still requires appropriate disclosure and consent where
applicable. See Google's
[regional data-collection documentation](https://support.google.com/analytics/answer/11598602).

## Privacy and cookie documentation

Create or update these public routes in the same release that activates GA4:

```text
/privacy
/cookies
```

The privacy notice should accurately describe:

- The legal entity responsible for the site and its contact details
- What analytics information is collected
- Why the information is collected
- Google Analytics as the analytics provider
- The applicable legal basis and consent mechanism
- Retention periods
- International processing or transfers where applicable
- How a person can withdraw consent or exercise privacy rights
- The effective date and policy version

The cookie policy should list the cookies observed in the final tested implementation rather than
copying a generic list. Expected entries may include:

| Cookie | Provider | Purpose | Category |
|---|---|---|---|
| Consent cookie, final name TBD | This website | Remembers the analytics choice | Necessary |
| `_ga` | Google Analytics | Distinguishes browser sessions | Analytics |
| `_ga_<container-id>` | Google Analytics | Maintains session state for the GA4 property | Analytics |

Confirm cookie names, purposes, and durations using the production build and browser developer tools
before publishing the table.

Until GA4 is active, do not publish wording that claims these Google cookies are currently in use.
Policy wording and regional requirements should be reviewed by the client's privacy or legal owner,
especially if the site targets visitors outside South Africa.

## Deployment sequence

1. Receive the client-owned GA4 Measurement ID and required account access.
2. Implement the analytics modules, consent banner, settings dialog, and policy pages.
3. Keep GA disabled and test the consent UI in preview mode.
4. Configure and review the GA4 property privacy settings.
5. Add the production Measurement ID to the deployment environment, not the repository.
6. Build and deploy first to a protected staging environment if available.
7. Test acceptance, rejection, withdrawal, page views, route changes, and custom events.
8. Confirm final cookies and network requests, then finalize policy tables and wording.
9. Obtain business approval for the analytics purpose and public policy wording.
10. Enable GA4 in production.
11. Verify live events in GA4 Realtime and DebugView without sending personal information.
12. Record the enablement date, property details, consent version, and person approving launch.

Do not enable the production Measurement ID before the banner and blocking behavior have passed the
verification checklist.

## Verification checklist

### Disabled configuration

- [ ] No cookie banner is shown.
- [ ] No Google Analytics script is requested.
- [ ] No request is made to Google Analytics collection endpoints.
- [ ] No `_ga` cookie is created.
- [ ] Event helper calls fail safely without breaking the page.

### First visit before a choice

- [ ] The banner is visible and usable by keyboard.
- [ ] Acceptance and rejection are equally clear.
- [ ] No GA script or collection request occurs before a choice.
- [ ] No analytics cookie exists before a choice.

### Rejected consent

- [ ] No GA script or collection request occurs.
- [ ] No `_ga` cookie is created.
- [ ] The site remains fully usable.
- [ ] The footer can reopen cookie settings.
- [ ] Rejection persists for the documented period.

### Accepted consent

- [ ] GA loads only after acceptance.
- [ ] The initial consented page view is recorded once, not zero or twice.
- [ ] Client-side route changes produce one page view each.
- [ ] Approved events appear in GA4 DebugView or Realtime.
- [ ] No event contains personal or form data.
- [ ] Consent persists for the documented period.

### Withdrawn consent

- [ ] Future GA events stop immediately.
- [ ] Removable GA cookies are deleted.
- [ ] Reloading the site does not load GA.
- [ ] The visitor can grant consent again later.

### General quality

- [ ] The banner works at supported mobile and desktop sizes.
- [ ] Focus order, visible focus, labels, and dialog behavior are accessible.
- [ ] Content Security Policy permits only the Google endpoints actually required.
- [ ] Analytics failures and blocked scripts do not break navigation or enquiries.
- [ ] Production source maps, logs, and error reports do not expose the consent cookie unnecessarily.
- [ ] Privacy and cookie policy content matches the observed production behavior.

Test with a clean browser profile, after clearing site storage, and with browser tracking protection
enabled. Analytics will never include every visitor, and business reporting must not assume that it
does.

## Future Google Ads or additional trackers

Adding Google Ads, Meta Pixel, session replay, embedded marketing media, or another analytics vendor
requires a new review. At minimum:

- Add a separate marketing category where appropriate.
- Default advertising storage, advertising user data, and advertising personalization to denied.
- Update the banner, settings dialog, privacy notice, and cookie inventory.
- Confirm that rejecting marketing is as easy as accepting it.
- Re-test all network calls before and after consent.
- Re-request consent if the purposes or vendors materially change.

Do not use the existing analytics choice as blanket permission for future advertising or profiling.

## Rollback

If consent blocking, policy accuracy, or GA data quality fails after launch:

1. Set `NEXT_PUBLIC_GA_ENABLED=false` in the production deployment environment.
2. Redeploy the application.
3. Verify that Google scripts, collection requests, and analytics cookies are absent on a clean visit.
4. Keep the public policy accurate about the temporarily disabled state.
5. Correct and re-test the implementation before enabling it again.

The site must continue to function normally with analytics disabled.
