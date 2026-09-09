/**
 * Company/legal identity and contact details used across the whole site
 * (footer, contact page, legal pages, structured data) — single source, so a
 * correction only needs to happen here.
 */
export const COMPANY = {
  legalName: 'Parts-Mall Africa (Pty) Ltd',
  tradingName: 'Parts-Mall Africa',
  country: 'South Africa',
  /** Companies and Intellectual Property Commission (CIPC) registration number. */
  registrationNumber: '2005/007249/07',
  /** VAT vendor number. */
  vatNumber: '4430222457',

  email: 'pma.sales1@parts-mall.com',

  /** Display format. */
  phone: '011 392 1141',
  /** tel: link — E.164, no spaces. */
  phoneHref: 'tel:+27113921141',

  /** Display format. */
  whatsapp: '+27 76 311 7593',
  /** wa.me click-to-chat link — digits only, no leading +. */
  whatsappHref: 'https://wa.me/27763117593?text=' + encodeURIComponent("Hi, I'd like to ask about SK ZIC products."),
} as const;
