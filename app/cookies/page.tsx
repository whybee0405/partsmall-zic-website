import ManageCookiesButton from '@/components/ManageCookiesButton';
import { ContentSection, SupportPage, pageMetadata } from '@/components/SupportPage';

export const metadata = pageMetadata(
  'Cookie Notice',
  'What cookies this site uses, what Google Analytics and Search Console mean for your visit, and how to accept or reject them.',
  '/cookies',
);

const GA_COOKIES = [
  { name: '_ga', provider: 'Google Analytics (GA4)', purpose: 'Distinguishes unique visitors.', duration: 'Up to 2 years' },
  {
    name: '_ga_<container-id>',
    provider: 'Google Analytics (GA4)',
    purpose: 'Persists session state between page views.',
    duration: 'Up to 2 years',
  },
];

export default function CookiesPage() {
  return (
    <SupportPage
      stamp="LEGAL / BROWSER STORAGE"
      title="Cookie Notice"
      intro="A plain account of what this site stores in your browser, why, and how to accept or reject what's optional."
      updated="7 SEPTEMBER 2026"
    >
      <ContentSection number="01 / YOUR CHOICE" title="How the cookie banner works">
        <p>
          On your first visit, a banner offers two equal choices: <strong>Accept</strong> or{' '}
          <strong>Reject</strong>. Strictly necessary storage runs either way, because the
          site cannot function without it. Google Analytics runs either way too, but what it&rsquo;s
          allowed to do is different: before you choose, and if you reject, it stays cookie-free; if you
          accept, it also sets cookies to recognise you as a returning visitor. Section 03 below has the
          detail.
        </p>
        <p>You can change your mind at any time:</p>
        <div className="mt-5">
          <ManageCookiesButton />
        </div>
      </ContentSection>

      <ContentSection number="02 / STRICTLY NECESSARY" title="Used no matter what you choose" dark>
        <ul>
          <li>
            <strong>skzic-cookie-consent</strong> — stored in your browser&rsquo;s local storage, not a
            cookie sent to a server, to remember your accept/reject choice so we don&rsquo;t ask again.
          </li>
          <li>
            Hosting, network-security and delivery providers may process short-lived technical
            identifiers or request logs needed to deliver the site, prevent abuse and diagnose faults.
          </li>
          <li>
            Fonts on this site are self-hosted at build time. Your browser never contacts Google&rsquo;s
            font servers, so no font-related cookie or request is sent to Google when you load a page.
          </li>
        </ul>
        <p>None of this is used to build an advertising profile, and none of it requires consent.</p>
      </ContentSection>

      <ContentSection number="03 / ANALYTICS" title="Google Analytics (GA4)">
        <p>
          Google Analytics 4 is active on this site to understand traffic and page performance. It runs
          in Google&rsquo;s <strong>Consent Mode</strong>, which changes what it&rsquo;s allowed to do
          based on your choice rather than switching on or off entirely:
        </p>
        <ul>
          <li>
            <strong>Before you choose, or if you reject</strong> — GA4 still sends Google a basic,
            anonymous measurement of the visit (page views, in aggregate) with no cookie and nothing that
            identifies your browser between visits. Google calls this a cookieless ping.
          </li>
          <li>
            <strong>If you accept</strong> — GA4 additionally sets the cookies below, which let it
            recognise you as a returning visitor and measure sessions rather than isolated page loads.
          </li>
        </ul>
        <p>Cookies below are set only after you accept:</p>
        <div className="mt-2 overflow-x-auto">
          <div
            className="grid min-w-[620px] grid-cols-[1fr_1fr_2fr_0.8fr] gap-px overflow-hidden rounded-[8px] text-base"
            style={{ background: 'var(--color-hairline)', border: '1px solid var(--color-hairline)' }}
          >
            {['Cookie', 'Provider', 'Purpose', 'Duration'].map((h) => (
              <div key={h} className="p-3 font-semibold" style={{ background: 'var(--color-fluid-grey)' }}>
                {h}
              </div>
            ))}
            {GA_COOKIES.map((c) => (
              <div key={c.name} className="contents">
                <div className="p-3 t-mono" style={{ background: 'var(--color-pure-white)' }}>{c.name}</div>
                <div className="p-3" style={{ background: 'var(--color-pure-white)' }}>{c.provider}</div>
                <div className="p-3" style={{ background: 'var(--color-pure-white)' }}>{c.purpose}</div>
                <div className="p-3" style={{ background: 'var(--color-pure-white)' }}>{c.duration}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-base" style={{ color: 'var(--color-steel-text)' }}>
          Cookie names and durations above are Google&rsquo;s published defaults for GA4. Per
          Google&rsquo;s current documentation, GA4 is designed not to log or store full IP addresses.
        </p>
      </ContentSection>

      <ContentSection number="04 / SEARCH PERFORMANCE" title="Google Search Console" dark>
        <p>
          We use, or plan to use, Google Search Console to see how this site appears in Google Search —
          impressions, clicks and search terms. Search Console reads data Google already collects on its
          own search results pages. It does not place any additional cookie in your browser when you
          visit this site, so it is not part of the table above and is not affected by the cookie banner.
        </p>
      </ContentSection>

      <ContentSection number="05 / BROWSER CONTROLS" title="Other ways to control storage">
        <p>
          You can also block or delete cookies and local storage through your browser settings. Blocking
          the strictly necessary category may affect parts of the site that depend on it, such as
          remembering that you already made a cookie choice.
        </p>
      </ContentSection>

      <ContentSection number="06 / CHANGES" title="If this notice changes" dark>
        <p>
          If new non-essential cookies or tracking technology are introduced, this notice will be updated
          before they go live, and — where the law requires it — you will be asked for a fresh choice
          rather than having an old acceptance carried over silently.
        </p>
      </ContentSection>
    </SupportPage>
  );
}
