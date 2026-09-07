import { ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';
import { COMPANY } from '@/content/company';

export const metadata = pageMetadata(
  'Accessibility',
  'Accessibility commitments, supported interaction methods, built-in features and feedback contact for the SK ZIC South Africa website.',
  '/accessibility',
);

export default function AccessibilityPage() {
  return (
    <SupportPage
      stamp="SERVICE / ACCESS"
      title="Accessibility"
      intro="Technical product information should remain usable regardless of device, input method or motion preference."
      updated="19 AUGUST 2026"
    >
      <ContentSection number="01 / COMMITMENT" title="What we aim to support">
        <p>
          Parts-Mall Africa aims to make this website perceivable, operable, understandable and robust for a broad range of visitors. The target is WCAG 2.2 Level AA where reasonably practicable.
        </p>
      </ContentSection>

      <ContentSection number="02 / BUILT IN" title="Accessibility features" dark>
        <ul>
          <li>A skip link to the main content.</li>
          <li>Keyboard-operable navigation, forms and product disclosures.</li>
          <li>Visible focus states and labelled form controls.</li>
          <li>Responsive layouts designed for text zoom and small screens.</li>
          <li>Reduced-motion behaviour for visitors who request it.</li>
          <li>Text alternatives for meaningful product and brand imagery.</li>
        </ul>
      </ContentSection>

      <ContentSection number="03 / LIMITATIONS" title="Known limitations">
        <p>
          Product packaging may contain small printed text that is not readable in the supplied pack image. The relevant specification is therefore also provided as accessible page text. External Parts-Mall Africa pages and PDF documents may have different accessibility support.
        </p>
      </ContentSection>

      <ContentSection number="04 / FEEDBACK" title="Tell us where access fails" dark>
        <p>
          If you cannot access information or complete an enquiry, email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or call <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>. Include the page address, what you were trying to do, and the browser or assistive technology used if you are comfortable doing so. We will provide the information in another reasonable format where possible.
        </p>
      </ContentSection>
    </SupportPage>
  );
}
