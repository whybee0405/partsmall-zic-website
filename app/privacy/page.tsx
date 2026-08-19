import { ContactBlock, ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';

export const metadata = pageMetadata(
  'Privacy Notice',
  'How Parts-Mall Africa collects, uses, protects and manages personal information on the SK ZIC South Africa website.',
  '/privacy',
);

export default function PrivacyPage() {
  return (
    <SupportPage
      stamp="LEGAL / POPIA"
      title="Privacy Notice"
      intro="This notice explains what happens to personal information submitted through the SK ZIC South Africa website and how you can exercise your rights under South African privacy law."
      updated="19 AUGUST 2026"
    >
      <ContentSection number="01 / RESPONSIBLE PARTY" title="Who is responsible for your information">
        <p>
          Parts-Mall Africa operates this website as the South African importer and distributor of the SK ZIC products shown here. Parts-Mall Africa is the responsible party for personal information collected through this website.
        </p>
        <ContactBlock title="Responsible party address" />
      </ContentSection>

      <ContentSection number="02 / INFORMATION" title="What we collect" dark>
        <p>When you submit an enquiry, we may collect:</p>
        <ul>
          <li>Your name, telephone number and email address.</li>
          <li>Your business or workshop name.</li>
          <li>Your province or country and area of interest.</li>
          <li>Vehicle, lubricant specification and enquiry details you choose to provide.</li>
          <li>Technical information needed for security and reliable delivery, such as request time, browser type and network address.</li>
        </ul>
        <p>Please do not include identity numbers, payment details or unrelated sensitive information in an enquiry.</p>
      </ContentSection>

      <ContentSection number="03 / PURPOSE" title="Why we process it">
        <p>We process the information to:</p>
        <ul>
          <li>Respond to product, technical, stock, branch and reseller enquiries.</li>
          <li>Identify a suitable branch or Parts-Mall Africa representative.</li>
          <li>Maintain a record of the request and our response.</li>
          <li>Protect the website against abuse, fraud and security threats.</li>
          <li>Meet legal, regulatory and operational obligations.</li>
        </ul>
        <p>
          We process enquiry information because you asked us to take steps in response to your request and because Parts-Mall Africa has a legitimate business need to answer and administer that request. Separate consent will be requested before using your details for electronic direct marketing where consent is required.
        </p>
      </ContentSection>

      <ContentSection number="04 / SHARING" title="Who may receive it" dark>
        <p>
          Information is limited to Parts-Mall Africa staff, relevant branches or distributors, and contracted service providers that need it to respond or operate the website. We do not sell personal information.
        </p>
        <p>
          A service provider may process information outside South Africa if website hosting, email or business systems are operated there. Parts-Mall Africa must use appropriate contractual and legal safeguards for cross-border processing.
        </p>
      </ContentSection>

      <ContentSection number="05 / RETENTION" title="How long we keep it">
        <p>
          Enquiry information is kept only for as long as reasonably required to answer the enquiry, maintain business records, resolve disputes and meet legal obligations. Security logs are kept for a limited operational period. Information that is no longer required must be deleted, destroyed or de-identified securely.
        </p>
      </ContentSection>

      <ContentSection number="06 / YOUR RIGHTS" title="Access, correction and objection" dark>
        <p>You may ask Parts-Mall Africa to:</p>
        <ul>
          <li>Confirm whether it holds personal information about you.</li>
          <li>Provide access to that information where the law permits.</li>
          <li>Correct, update or delete inaccurate or unlawfully held information.</li>
          <li>Object to certain processing or withdraw consent where consent is the basis.</li>
        </ul>
        <p>
          Send the request to <a href="mailto:pma.sales2@parts-mall.com">pma.sales2@parts-mall.com</a>. We may need to verify your identity before acting. You may also lodge a complaint with the <a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">Information Regulator South Africa</a>.
        </p>
      </ContentSection>

      <ContentSection number="07 / SECURITY" title="Security and changes">
        <p>
          Parts-Mall Africa applies reasonable technical and organisational measures designed to protect personal information. No internet transmission is completely risk-free, so please use the enquiry form only for the information needed to answer your request.
        </p>
        <p>
          This notice may change when systems, service providers or legal requirements change. The current publication date appears at the top of this page.
        </p>
      </ContentSection>
    </SupportPage>
  );
}

