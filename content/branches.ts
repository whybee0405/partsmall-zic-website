/**
 * Parts-Mall Africa branch distribution.
 * Source: parts-mall.co.za/partsmall-branches.asp, transcribed 2026-08-11.
 */

export interface Region {
  name: string;
  count: number;
}

export const REGIONS: Region[] = [
  { name: 'Gauteng', count: 16 },
  { name: 'Limpopo', count: 6 },
  { name: 'Mpumalanga', count: 4 },
  { name: 'North West', count: 4 },
  { name: 'Cape Region', count: 3 },
  { name: 'Free State', count: 3 },
  { name: 'KwaZulu-Natal', count: 3 },
  { name: 'Elsewhere in Africa', count: 5 },
];

export const NEIGHBOURING =
  'ESWATINI  ·  BOTSWANA  ·  MOZAMBIQUE  ·  NAMIBIA  ·  ZIMBABWE';

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
