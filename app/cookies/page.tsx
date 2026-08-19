import { ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';

export const metadata = pageMetadata(
  'Cookie Notice',
  'Current cookie and browser storage use on the SK ZIC South Africa website.',
  '/cookies',
);

export default function CookiesPage() {
  return (
    <SupportPage
      stamp="LEGAL / BROWSER STORAGE"
      title="Cookie Notice"
      intro="A plain account of browser storage and tracking on this website. No consent theatre, only what the site actually uses."
      updated="19 AUGUST 2026"
    >
      <ContentSection number="01 / CURRENT USE" title="No advertising cookies">
        <p>
          The current SK ZIC South Africa website does not intentionally set advertising, remarketing or cross-site profiling cookies. It does not currently use a marketing analytics platform.
        </p>
      </ContentSection>

      <ContentSection number="02 / ESSENTIAL DATA" title="Technical operation" dark>
        <p>
          Hosting, network-security and delivery providers may process short-lived technical identifiers or request logs needed to deliver the site, prevent abuse and diagnose faults. These are used for operation and security, not to build advertising profiles.
        </p>
      </ContentSection>

      <ContentSection number="03 / FUTURE CHANGES" title="If measurement is introduced">
        <p>
          If non-essential analytics or marketing technology is introduced, this notice will be updated before use. Where consent is legally required, visitors will be offered a real choice before the technology is activated.
        </p>
        <p>
          You can also control cookies through your browser. Blocking essential storage may affect services that depend on it.
        </p>
      </ContentSection>
    </SupportPage>
  );
}

