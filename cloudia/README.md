# CloudIA CMS for skzic.co.za

The site's CMS configuration, mounted read-only into the `cms` container at `/app/site-config`.
Editors use https://skzic.co.za/admin.

| File | Purpose |
|---|---|
| `cloudia.config.ts` | Models: Products, FAQs, the private Enquiries form, Company & contact, Proof & trust figures. Edit, then `docker compose -f docker-compose.prod.yml restart cms`. |
| `cms-version` | CloudIA version the site is built and tested against (see `scripts/deploy-cms.sh`). |
| `cms.env.example` | Every variable the CMS reads. Copy to `cms.env` (git-ignored, mode 600). |
| `migration/` | How the content moved from `content/*.ts` into the CMS on 2026-11-04 (`seed.json` is the exact data loaded). |

## How the site uses it

- `lib/cms/content.ts` reads products, FAQs, company details and trust figures (Payload-style
  `find` from `@cloudia-cms/client`, vendored in `vendor/`) at most every 30 seconds, and serves the
  last good copy if the CMS is briefly unreachable. Published edits show within 30 seconds; no
  rebuild.
- The branch network figures (Distribution section, the network proof cell, `{branches}`,
  `{provinces}` and `{countries}` in proof text) come live from Parts-Mall Africa's own CMS
  (`PARTSMALL_BRANCHES_URL`), with the last transcribed figures as a fallback.
- `/api/enquire` (the site) validates, stores the enquiry in the CMS's private Enquiries form, then
  emails it through Resend.
- Analytics: the CloudIA tracker (`lib/analytics.ts`) posts to `/api/analytics-events`. Cookieless,
  so there is no cookie banner. GA4 was removed on 2026-11-04; its history stays in the Google
  Analytics account.
- Product images live in the CMS media library (`/api/media/<id>`); `app/api/media/[id]` proxies
  them for next/image.
