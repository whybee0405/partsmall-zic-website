import { PRIMARY_CTA } from '@/content/cta';
import { Cta } from '@/components/ui';

/**
 * Mobile-only bottom action bar. Above `lg` the nav's own "Enquire Now"
 * button is already always visible in the fixed header, so this would just
 * duplicate it — hence `lg:hidden`.
 *
 * Height is fixed via `--sticky-cta-height` (globals.css) so CookieBanner can
 * sit directly above it on mobile without the two overlapping — see that
 * variable's definition for the pairing.
 */
export default function StickyCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t lg:hidden"
      style={{
        height: 'var(--sticky-cta-height)',
        background: 'color-mix(in oklab, var(--color-eng-white) 96%, transparent)',
        borderColor: 'var(--color-hairline)',
        backdropFilter: 'blur(10px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="shell flex h-full items-center">
        <Cta href={PRIMARY_CTA.href} external={PRIMARY_CTA.external} className="!flex w-full">
          {PRIMARY_CTA.label}
        </Cta>
      </div>
    </div>
  );
}
