import Link from 'next/link';
import { HOME_FAQS } from '@/lib/seo';

export default function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28" aria-labelledby="faq-title">
      <div className="shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <header>
          <p className="t-stamp" style={{ color: 'var(--color-zic-red)' }}>
            07 / QUICK ANSWERS
          </p>
          <h2 id="faq-title" className="t-display t-h2 mt-6">
            SK ZIC questions, answered.
          </h2>
          <p className="t-lead mt-7" style={{ color: 'var(--color-deep-steel)' }}>
            Clear guidance for drivers, workshops and resellers in South Africa.
          </p>
          <Link href="/contact" className="btn btn-secondary mt-8">
            Ask a product question
          </Link>
        </header>

        <div className="border-t" style={{ borderColor: 'var(--color-hairline)' }}>
          {HOME_FAQS.map((item) => (
            <details key={item.question} className="group border-b py-5" style={{ borderColor: 'var(--color-hairline)' }}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1rem] font-semibold marker:content-none md:text-[1.125rem]">
                <span>{item.question}</span>
                <span aria-hidden className="t-mono text-[1.1rem] text-[var(--color-zic-red)] group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-[760px] pr-10 text-[0.9375rem] leading-7" style={{ color: 'var(--color-deep-steel)' }}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
