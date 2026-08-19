import { ContactBlock, ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';

export const metadata = pageMetadata(
  'Website Terms of Use',
  'Terms governing access to and use of the SK ZIC South Africa website operated by Parts-Mall Africa.',
  '/terms',
);

export default function TermsPage() {
  return (
    <SupportPage
      stamp="LEGAL / WEBSITE USE"
      title="Terms of Use"
      intro="These terms govern use of this information and enquiry website. By using it, you agree to the terms below."
      updated="19 AUGUST 2026"
    >
      <ContentSection number="01 / OPERATOR" title="Website operator">
        <p>
          This website is operated by Parts-Mall Africa, the South African importer and distributor identified on the website. It presents information about selected SK ZIC products available through the Parts-Mall Africa network.
        </p>
        <ContactBlock title="Operating address" />
      </ContentSection>

      <ContentSection number="02 / INFORMATION" title="Informational purpose" dark>
        <p>
          Website content is general product information. It is not mechanical, engineering or warranty advice and does not replace the vehicle manufacturer&apos;s owner manual, service information or approved lubricant specification.
        </p>
        <p>
          Always identify the exact specification required by the vehicle manufacturer before selecting a lubricant. Products with the same viscosity grade are not necessarily interchangeable.
        </p>
      </ContentSection>

      <ContentSection number="03 / SPECIFICATIONS" title="Claims, approvals and corrections">
        <p>
          Product specifications and OEM claims are product-specific. &quot;Approved by&quot;, &quot;meets&quot;, &quot;meets or exceeds&quot; and &quot;suitable for use&quot; describe different claim types and must not be treated as equivalent.
        </p>
        <p>
          Parts-Mall Africa takes reasonable care to keep the website accurate, but specifications, packaging, approvals and availability may change. Where the website conflicts with a current manufacturer document or product label, obtain written confirmation before use. Please report suspected errors to the contact address below.
        </p>
      </ContentSection>

      <ContentSection number="04 / AVAILABILITY" title="Stock, pricing and enquiries" dark>
        <p>
          Product display does not guarantee stock, price, territory availability or suitability for a particular vehicle. An enquiry is a request for information. It is not an order, quotation, reservation or contract of sale unless Parts-Mall Africa or an authorised seller confirms that separately in writing.
        </p>
      </ContentSection>

      <ContentSection number="05 / RIGHTS" title="Intellectual property">
        <p>
          SK ZIC and associated marks are trademarks of SK Enmove Co., Ltd. Other names and marks belong to their respective owners. Website text, layout, images and code are protected by applicable intellectual property law or used with permission. No licence is granted except the limited right to view the website for lawful personal or business evaluation.
        </p>
      </ContentSection>

      <ContentSection number="06 / ACCEPTABLE USE" title="Using the website" dark>
        <p>You may not:</p>
        <ul>
          <li>Interfere with the website, its security or its availability.</li>
          <li>Submit false, unlawful, harmful or abusive material.</li>
          <li>Use automated systems in a way that places unreasonable load on the service.</li>
          <li>Copy product data or brand assets in a way that implies authorisation or endorsement.</li>
        </ul>
      </ContentSection>

      <ContentSection number="07 / THIRD PARTIES" title="External links">
        <p>
          The website links to Parts-Mall Africa branches and other external services. Those services operate under their own terms and privacy practices. A link is provided for convenience and does not make Parts-Mall Africa responsible for an external site&apos;s content or availability.
        </p>
      </ContentSection>

      <ContentSection number="08 / LIABILITY" title="Limits and applicable law" dark>
        <p>
          To the extent permitted by law, Parts-Mall Africa is not liable for loss arising solely from reliance on general website information, interruption of the website, or an external website. Nothing in these terms excludes rights or liability that South African law does not allow to be excluded.
        </p>
        <p>
          These terms are governed by the laws of the Republic of South Africa. South African courts have jurisdiction over disputes connected with this website.
        </p>
      </ContentSection>

      <ContentSection number="09 / CONTACT" title="Questions and updates">
        <p>
          We may update these terms when the website, business process or law changes. Continued use after an update is subject to the current version published here.
        </p>
        <ContactBlock />
      </ContentSection>
    </SupportPage>
  );
}

