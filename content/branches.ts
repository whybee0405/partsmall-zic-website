/**
 * Enquiry form options. The branch network figures shown on the site (regions, counts,
 * neighbouring countries) are read live from Parts-Mall Africa's CMS: see lib/cms/content.ts.
 */

/** Provinces plus neighbouring countries, for the enquiry form select. */
export const ENQUIRY_REGIONS = [
  'Gauteng',
  'Western Cape',
  'Eastern Cape',
  'Northern Cape',
  'Free State',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Botswana',
  'Eswatini',
  'Mozambique',
  'Namibia',
  'Zimbabwe',
] as const;

export const ENQUIRY_INTERESTS = [
  'Passenger petrol',
  'Diesel bakkie & SUV',
  'Fleet & commercial',
  'Transmission fluid',
  'Reseller / territory',
] as const;
