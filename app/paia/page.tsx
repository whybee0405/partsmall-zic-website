import { ContactBlock, ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';

export const metadata = pageMetadata(
  'PAIA Manual',
  'Access to information guidance and PAIA request procedure for Parts-Mall Africa.',
  '/paia',
);

export default function PaiaPage() {
  return (
    <SupportPage
      stamp="LEGAL / ACCESS TO INFORMATION"
      title="PAIA Manual"
      intro="How to request records from Parts-Mall Africa under the Promotion of Access to Information Act 2 of 2000."
      updated="19 AUGUST 2026"
    >
      <ContentSection number="01 / PRIVATE BODY" title="Parts-Mall Africa">
        <p>
          This web publication provides access information for Parts-Mall Africa as a private body. The person responsible for PAIA requests is the Head of the private body or a person authorised to act as Information Officer.
        </p>
        <ContactBlock title="Head office" />
      </ContentSection>

      <ContentSection number="02 / PURPOSE" title="Why this manual exists" dark>
        <p>
          PAIA gives a requester a right to seek access to a record of a private body when that record is required for the exercise or protection of a right, subject to the Act&apos;s procedures, grounds for refusal and applicable fees.
        </p>
      </ContentSection>

      <ContentSection number="03 / RECORDS" title="Categories of records">
        <p>Parts-Mall Africa may hold records in categories including:</p>
        <ul>
          <li>Corporate governance, statutory and regulatory records.</li>
          <li>Finance, taxation, insurance and accounting records.</li>
          <li>Personnel and employment records.</li>
          <li>Supplier, distributor, branch, agent and customer records.</li>
          <li>Product, import, stock, warranty and technical records.</li>
          <li>Contracts, correspondence and intellectual property records.</li>
          <li>Information technology, security and website records.</li>
          <li>Health, safety, facilities and operational records.</li>
        </ul>
        <p>
          Listing a category does not mean every record is held or automatically available. Access remains subject to PAIA and other applicable law.
        </p>
      </ContentSection>

      <ContentSection number="04 / AUTOMATIC ACCESS" title="Records available without a formal request" dark>
        <p>
          Public marketing material, website content, published product information and documents expressly offered for download may be accessed without a PAIA request. Other records require the prescribed process.
        </p>
      </ContentSection>

      <ContentSection number="05 / REQUEST" title="How to request a record">
        <ol>
          <li>Use the prescribed PAIA request form for access to a record of a private body.</li>
          <li>Identify the record clearly and explain the right you seek to exercise or protect.</li>
          <li>Provide a South African postal or email address and your preferred access format.</li>
          <li>Send the completed request to <a href="mailto:pma.sales2@parts-mall.com?subject=PAIA%20request">pma.sales2@parts-mall.com</a> with the subject &quot;PAIA request&quot;.</li>
          <li>Pay a prescribed request or access fee if legally applicable and requested.</li>
        </ol>
        <p>
          The official forms and the Information Regulator&apos;s guide are available from the <a href="https://inforegulator.org.za/paia-guidelines/" target="_blank" rel="noopener noreferrer">Information Regulator PAIA guidance page</a>.
        </p>
      </ContentSection>

      <ContentSection number="06 / DECISION" title="Assessment, refusal and remedies" dark>
        <p>
          A request may be refused on a ground permitted by PAIA, including protection of privacy, confidential commercial information, safety, legal privilege or records that cannot lawfully be disclosed. The written outcome should explain the decision and available remedies.
        </p>
        <p>
          A requester may complain to the <a href="https://inforegulator.org.za/paia/" target="_blank" rel="noopener noreferrer">Information Regulator</a> or approach a court as provided by PAIA.
        </p>
      </ContentSection>

      <ContentSection number="07 / POPIA" title="Personal information requests">
        <p>
          Requests to access or correct your own personal information may also be made under the Protection of Personal Information Act. See the <a href="/privacy">Privacy Notice</a> for contact details and a summary of data-subject rights.
        </p>
      </ContentSection>
    </SupportPage>
  );
}

