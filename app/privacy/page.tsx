import { ContactBlock, ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';
import { COMPANY } from '@/content/company';

export const metadata = pageMetadata(
  'Privacy Notice',
  'How Parts-Mall Africa collects, uses, protects and manages personal information submitted through the SK ZIC South Africa website.',
  '/privacy',
);

export default function PrivacyPage() {
  return (
    <SupportPage
      stamp="LEGAL / POPIA"
      title="Privacy Notice"
      intro="This notice explains what happens to personal information submitted through the SK ZIC South Africa website, and how you can exercise your rights, wherever in South Africa or a neighbouring Southern African country you're visiting from."
      updated="7 SEPTEMBER 2026"
    >
      <ContentSection number="01 / RESPONSIBLE PARTY" title="Who is responsible for your information">
        <p>
          This website is operated by {COMPANY.legalName}, trading as {COMPANY.tradingName}, the South
          African importer and distributor of the SK ZIC products shown here.{' '}
          {COMPANY.tradingName} is the responsible party for personal information collected through this
          website.
        </p>
        {COMPANY.registrationNumber && (
          <p>
            Registration number: {COMPANY.registrationNumber}
            {COMPANY.vatNumber ? ` · VAT number: ${COMPANY.vatNumber}` : ''}
          </p>
        )}
        <p>
          This notice is written under the Protection of Personal Information Act (POPIA) as our
          baseline standard. If you are visiting from a neighbouring country and local law gives you
          additional protection, that law is not overridden by this notice — contact us and we will deal
          with your request under whichever standard applies.
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
          <li>
            Aggregated usage information via Google Analytics (GA4) — see{' '}
            <a href="/cookies">Cookie Notice</a> for detail, including what runs before and after you
            make a cookie choice.
          </li>
        </ul>
        <p>Please do not include identity numbers, payment details or unrelated sensitive information in an enquiry.</p>
      </ContentSection>

      <ContentSection number="03 / PURPOSE" title="Why we process it">
        <p>We process the information to:</p>
        <ul>
          <li>Respond to product, technical, stock, branch and reseller enquiries.</li>
          <li>Identify a suitable branch or Parts-Mall Africa representative.</li>
          <li>Maintain a record of the request and our response.</li>
          <li>Understand, in aggregate, how the website is used, where you have consented to that.</li>
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
          A service provider may process information outside South Africa if website hosting, email or
          business systems are operated there. This includes Google, via Google Analytics (GA4) and
          Google Search Console — Google processes data on infrastructure that may be located outside
          South Africa. Parts-Mall Africa must use appropriate contractual and legal safeguards for
          cross-border processing.
        </p>
      </ContentSection>

      <ContentSection number="05 / COOKIES & ANALYTICS" title="Measurement tools on this site">
        <p>
          This site uses a cookie banner to ask before setting anything beyond strictly necessary
          storage. We use, or plan to use, two Google tools:
        </p>
        <ul>
          <li>
            <strong>Google Search Console</strong> — shows us aggregate data about how the site appears
            in Google Search. It does not place a cookie in your browser.
          </li>
          <li>
            <strong>Google Analytics (GA4)</strong> — measures traffic and page performance in
            aggregate; it is not used to identify you individually. Before you make a cookie choice, it
            sends only anonymous, cookie-free measurement to Google. If you accept, it also uses cookies
            to distinguish return visits; if you reject, it stays cookie-free. See the{' '}
            <a href="/cookies">Cookie Notice</a> for the technical detail.
          </li>
        </ul>
        <p>
          Full detail, including specific cookie names and retention periods, is in the{' '}
          <a href="/cookies">Cookie Notice</a>.
        </p>
      </ContentSection>

      <ContentSection number="06 / RETENTION" title="How long we keep it" dark>
        <p>
          Enquiry information is kept only for as long as reasonably required to answer the enquiry, maintain business records, resolve disputes and meet legal obligations. Security logs are kept for a limited operational period. Analytics information, where you have consented to it, is kept for the retention period set out in the Cookie Notice. Information that is no longer required must be deleted, destroyed or de-identified securely.
        </p>
      </ContentSection>

      <ContentSection number="07 / YOUR RIGHTS" title="Access, correction and objection">
        <p>You may ask Parts-Mall Africa to:</p>
        <ul>
          <li>Confirm whether it holds personal information about you.</li>
          <li>Provide access to that information where the law permits.</li>
          <li>Correct, update or delete inaccurate or unlawfully held information.</li>
          <li>Object to certain processing or withdraw consent where consent is the basis, including by rejecting or later changing your cookie preference in the <a href="/cookies">Cookie Notice</a>.</li>
        </ul>
        <p>
          Send the request to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. We may need to verify your identity before acting. You may also lodge a complaint with the <a href="https://inforegulator.org.za/" target="_blank" rel="noopener noreferrer">Information Regulator South Africa</a>.
        </p>
      </ContentSection>

      <ContentSection number="08 / SECURITY" title="Security and changes" dark>
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
