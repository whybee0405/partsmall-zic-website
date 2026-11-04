// CloudIA CMS config for SK ZIC South Africa (skzic.co.za). The source of truth for the CMS's
// models: edit here, then restart the cms service (see cloudia/README.md).
import type { CloudiaConfig } from '@cloudia-cms/client/config'

const config: CloudiaConfig = {
  site: {
    name: 'SK ZIC South Africa',
    slug: 'skzic',
    domains: ['skzic.co.za', 'www.skzic.co.za'],
  },
  dashboard: {
    theme: 'nocturne',
    mode: 'system',
  },
  // Gives the site keyless form submissions (POST /api/enquiries), analytics events
  // (POST /api/analytics-events) and Payload-style reads (GET /api/<model>), which the site
  // reads through @cloudia-cms/client's createCloudia().
  payloadCompat: {
    analytics: 'analytics-events',
  },
  collections: [
    {
      slug: 'products',
      name: 'Products',
      description:
        'The confirmed South African assortment. Nothing outside this list may be presented as locally available. Claim wording follows BRAND-DNA §7 exactly.',
      titleField: 'name',
      sortField: 'order',
      url: '/products/{slug}',
      fields: [
        { name: 'name', type: 'text', required: true, placeholder: 'ZIC X7' },
        {
          name: 'family',
          type: 'select',
          required: true,
          options: [
            { label: 'Petrol', value: 'petrol' },
            { label: 'Diesel', value: 'diesel' },
            { label: 'Transmission', value: 'transmission' },
          ],
        },
        { name: 'grade', type: 'text', required: true, placeholder: '5W-30' },
        {
          name: 'order',
          type: 'number',
          required: true,
          help: 'Position in the line-up and product lists, lowest first.',
        },
        { name: 'packSizes', type: 'tags', label: 'Pack sizes', help: 'e.g. 1 L, 4 L' },
        { name: 'oilType', type: 'text', label: 'Oil type', required: true },
        { name: 'technology', type: 'text', help: 'e.g. VHVI Technology. Optional.' },
        {
          name: 'specification',
          type: 'tags',
          help: 'Headline specifications, shown in mono type (e.g. API SP, ILSAC GF-6).',
        },
        {
          name: 'shortSpec',
          type: 'text',
          label: 'Short specification',
          help: 'Compact label for the five-across line-up where columns are narrow. Optional.',
        },
        {
          name: 'claims',
          type: 'array',
          label: 'OEM claims',
          help: 'Use the verb the source supports. Never upgrade "meets" to "approved".',
          fields: [
            {
              name: 'verb',
              type: 'select',
              required: true,
              options: [
                { label: 'Approved', value: 'approved' },
                { label: 'Meets or exceeds', value: 'meets-or-exceeds' },
                { label: 'Meets', value: 'meets' },
                { label: 'Suitable for use', value: 'suitable-for-use' },
              ],
            },
            { name: 'value', type: 'text', required: true, placeholder: 'MB 229.3' },
          ],
        },
        {
          name: 'whoItsFor',
          type: 'textarea',
          label: "Who it's for",
          required: true,
          help: 'Plain language. Answers "is this me?"',
        },
        { name: 'positioning', type: 'text', required: true },
        {
          name: 'benefits',
          type: 'array',
          fields: [{ name: 'text', type: 'text', label: 'Benefit', required: true }],
        },
        {
          name: 'properties',
          type: 'array',
          label: 'Typical properties',
          fields: [
            { name: 'label', type: 'text', required: true, placeholder: 'Viscosity Index' },
            { name: 'value', type: 'text', required: true, placeholder: '160' },
          ],
        },
        {
          name: 'warning',
          type: 'textarea',
          help: 'Shown as a bordered notice, never as body copy. Optional.',
        },
        { name: 'image', type: 'image', required: true, help: 'Transparent pack render.' },
        {
          name: 'imageWidth',
          type: 'number',
          label: 'Image width (px)',
          required: true,
          help: 'Pixel size of the uploaded image, so the page reserves the right space.',
        },
        { name: 'imageHeight', type: 'number', label: 'Image height (px)', required: true },
        {
          name: 'imageNote',
          type: 'textarea',
          label: 'Image note (internal)',
          help: 'Where the render came from and anything to confirm. Not shown on the site.',
        },
      ],
    },
    {
      slug: 'faqs',
      name: 'FAQs',
      description:
        'Homepage questions. Also published as FAQ structured data, which is what search engines and assistants quote.',
      titleField: 'question',
      sortField: 'order',
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          help: 'A complete answer that makes sense quoted on its own.',
        },
        { name: 'order', type: 'number', required: true },
      ],
    },
    {
      slug: 'enquiries',
      name: 'Enquiries',
      kind: 'form',
      titleField: 'name',
      form: {
        accept: ['name', 'business', 'phone', 'email', 'province', 'interest', 'vehicle', 'message'],
        rateLimit: { max: 5, windowMinutes: 5 },
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'business', type: 'text' },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'province', type: 'text', required: true, label: 'Province or country' },
        { name: 'interest', type: 'text', required: true, label: 'Asking about' },
        { name: 'vehicle', type: 'text' },
        { name: 'message', type: 'textarea' },
        {
          name: 'status',
          type: 'select',
          default: 'new',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Contacted', value: 'contacted' },
            { label: 'Routed to branch', value: 'routed' },
            { label: 'Closed', value: 'closed' },
          ],
        },
      ],
    },
  ],
  singletons: [
    {
      slug: 'company',
      name: 'Company & contact',
      description:
        'Legal identity and contact details used across the site (footer, contact page, legal pages, structured data, enquiry emails).',
      fields: [
        { name: 'legalName', type: 'text', required: true },
        { name: 'tradingName', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
        { name: 'registrationNumber', type: 'text', label: 'CIPC registration number', required: true },
        { name: 'vatNumber', type: 'text', label: 'VAT number', required: true },
        {
          name: 'email',
          type: 'email',
          required: true,
          help: 'Public contact address. Also where website enquiries are emailed.',
        },
        {
          name: 'addressStreet',
          type: 'text',
          label: 'Head office street',
          required: true,
          placeholder: '901 Herman Street, PZR Business Park',
        },
        { name: 'addressLocality', type: 'text', label: 'Head office area', required: true, placeholder: 'Meadowdale, Germiston' },
        { name: 'addressPostalCode', type: 'text', label: 'Head office postal code', required: true },
        { name: 'phone', type: 'text', required: true, help: 'As displayed, e.g. 011 392 1141.' },
        {
          name: 'whatsapp',
          type: 'text',
          required: true,
          help: 'As displayed, in international form, e.g. +27 76 311 7593.',
        },
        {
          name: 'whatsappMessage',
          type: 'text',
          label: 'WhatsApp opening message',
          required: true,
        },
        {
          name: 'primaryCtaLabel',
          type: 'text',
          label: 'Main button label',
          required: true,
          help: 'Every main button on the site. When the store launches: "Shop ZIC".',
        },
        {
          name: 'primaryCtaHref',
          type: 'text',
          label: 'Main button link',
          required: true,
          help: '/#enquire for the enquiry form, or a full https:// address.',
        },
        { name: 'secondaryCtaLabel', type: 'text', label: 'Second button label', required: true },
        { name: 'secondaryCtaHref', type: 'text', label: 'Second button link', required: true },
        { name: 'branchFinderLabel', type: 'text', label: 'Branch finder label', required: true },
        { name: 'branchFinderHref', type: 'url', label: 'Branch finder link', required: true },
      ],
    },
    {
      slug: 'trust',
      name: 'Proof & trust figures',
      description:
        'Authority claims and figures. Every one must have a source (docs/RESEARCH.md): do not add a claim without one, and do not round further than the source did.',
      fields: [
        {
          name: 'proofCells',
          type: 'array',
          label: 'Proof row',
          help: 'Live network figures: write {branches}, {provinces} or {countries} and the site fills in the current Parts-Mall numbers.',
          fields: [
            { name: 'label', type: 'text', required: true, placeholder: '[ NETWORK ]' },
            { name: 'value', type: 'textarea', required: true },
          ],
        },
        {
          name: 'yubaseCapacity',
          type: 'array',
          label: 'YUBASE capacity',
          fields: [
            { name: 'amount', type: 'text', required: true, placeholder: '48,600 b/d' },
            { name: 'site', type: 'text', required: true, placeholder: 'Ulsan' },
          ],
        },
        { name: 'googleRatingScore', type: 'number', label: 'Google rating', required: true },
        { name: 'googleRatingOutOf', type: 'number', label: 'Rating out of', required: true },
        { name: 'googleRatingCount', type: 'text', label: 'Review count', required: true },
        { name: 'googleRatingSource', type: 'text', label: 'Rating source', required: true },
        { name: 'googleRatingHref', type: 'url', label: 'Rating link', required: true },
        { name: 'kbpiYears', type: 'number', label: 'Brand Power Index: years at No.1', required: true },
        { name: 'kbpiIndex', type: 'text', label: 'Brand Power Index: name', required: true },
        { name: 'kbpiClaim', type: 'text', label: 'Brand Power Index: claim', required: true },
        { name: 'kbpiHref', type: 'url', label: 'Brand Power Index: source link', required: true },
        {
          name: 'sourcesNote',
          type: 'textarea',
          label: 'Sources and review notes (internal)',
          help: 'When and where each figure was last checked. Not shown on the site.',
        },
      ],
    },
  ],
}

export default config
