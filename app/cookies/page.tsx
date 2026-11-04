import { ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';

export const metadata = pageMetadata(
  'Cookie Notice',
  'This site sets no tracking cookies. What it stores in your browser, how its own cookieless analytics work, and what Search Console means for your visit.',
  '/cookies',
);

const BROWSER_STORAGE = [
  {
    name: 'cloudia-session-…',
    where: 'Session storage',
    purpose: 'A random id for this tab, so page views in one visit can be counted as one session.',
    duration: 'Until the tab closes',
  },
  {
    name: 'cloudia-landed-…',
    where: 'Session storage',
    purpose: 'Marks that this tab has recorded its landing page, so campaign details are read once.',
    duration: 'Until the tab closes',
  },
  {
    name: 'cloudia-analytics-ignore',
    where: 'Local storage',
    purpose: 'Only set on Parts-Mall staff browsers, to leave their own visits out of the figures.',
    duration: 'Until removed',
  },
];

export default function CookiesPage() {
  return (
    <SupportPage
      stamp="LEGAL / BROWSER STORAGE"
      title="Cookie Notice"
      intro="A plain account of what this site stores in your browser and why. Short version: no tracking cookies."
      updated="4 NOVEMBER 2026"
    >
      <ContentSection number="01 / IN SHORT" title="No tracking cookies">
        <p>
          This site does not set cookies to track you, and it does not load Google Analytics or any other
          third-party tracker. Its visitor statistics come from analytics that run on Parts-Mall
          Africa&rsquo;s own server and work without cookies, so there is nothing to accept or reject.
          Section 03 explains what is measured.
        </p>
      </ContentSection>

      <ContentSection number="02 / BROWSER STORAGE" title="What is kept in your browser" dark>
        <p>The analytics keep a tab-lifetime id in session storage. Nothing persists across tabs or visits:</p>
        <div className="mt-2 overflow-x-auto">
          <div
            className="grid min-w-[620px] grid-cols-[1.1fr_0.9fr_2fr_0.9fr] gap-px overflow-hidden rounded-[8px] text-base"
            style={{ background: 'var(--color-hairline)', border: '1px solid var(--color-hairline)' }}
          >
            {['Name', 'Where', 'Purpose', 'Kept'].map((h) => (
              <div key={h} className="p-3 font-semibold" style={{ background: 'var(--color-fluid-grey)', color: 'var(--color-carbon)' }}>
                {h}
              </div>
            ))}
            {BROWSER_STORAGE.map((item) => (
              <div key={item.name} className="contents">
                <div className="p-3 t-mono" style={{ background: 'var(--color-pure-white)', color: 'var(--color-carbon)' }}>{item.name}</div>
                <div className="p-3" style={{ background: 'var(--color-pure-white)', color: 'var(--color-carbon)' }}>{item.where}</div>
                <div className="p-3" style={{ background: 'var(--color-pure-white)', color: 'var(--color-carbon)' }}>{item.purpose}</div>
                <div className="p-3" style={{ background: 'var(--color-pure-white)', color: 'var(--color-carbon)' }}>{item.duration}</div>
              </div>
            ))}
          </div>
        </div>
        <ul className="mt-6">
          <li>
            Hosting, network-security and delivery providers may process short-lived technical
            identifiers or request logs needed to deliver the site, prevent abuse and diagnose faults.
          </li>
          <li>
            Fonts on this site are self-hosted. Your browser never contacts Google&rsquo;s font servers.
          </li>
        </ul>
      </ContentSection>

      <ContentSection number="03 / ANALYTICS" title="How visits are measured">
        <p>
          We measure how the website is used with analytics that run on our own server. We do not store
          your IP address. To count unique visitors, your IP address and browser type are combined into a
          one-way code that changes every day; the code is stored with the visit record, but once that day
          has passed it cannot be linked back to you or to your visits on other days.
        </p>
        <p>
          We record the pages you view, how long you stay and how far you scroll, which links you open
          (including WhatsApp, phone and email links), the website or campaign that referred you, your
          device type, browser language, screen size class and page-loading performance. If you send an
          enquiry, it is linked to the visit it came from so we can see which pages and campaigns lead to
          enquiries.
        </p>
        <p>
          If your browser sends a <strong>Do Not Track</strong> or <strong>Global Privacy Control</strong>{' '}
          signal, nothing is recorded. The data stays on Parts-Mall Africa&rsquo;s server, is not shared
          with third parties or used for advertising, and individual visit records are deleted after 425
          days; only daily page totals are kept beyond that.
        </p>
      </ContentSection>

      <ContentSection number="04 / SEARCH PERFORMANCE" title="Google Search Console" dark>
        <p>
          We use, or plan to use, Google Search Console to see how this site appears in Google Search —
          impressions, clicks and search terms. Search Console reads data Google already collects on its
          own search results pages. It does not place anything in your browser when you visit this site.
        </p>
      </ContentSection>

      <ContentSection number="05 / BROWSER CONTROLS" title="Other ways to control storage">
        <p>
          You can clear or block session and local storage through your browser settings, or turn on Do
          Not Track or Global Privacy Control. The site works fully either way.
        </p>
      </ContentSection>

      <ContentSection number="06 / CHANGES" title="If this notice changes" dark>
        <p>
          If cookies, third-party tools or other tracking technology are ever introduced, this notice will
          be updated before they go live, and where the law requires it you will be asked for your
          consent first.
        </p>
      </ContentSection>
    </SupportPage>
  );
}
