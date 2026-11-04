'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getTracker } from '@/lib/analytics';

/**
 * Starts CloudIA analytics (see lib/analytics.ts) and reports client-side route changes.
 * Mounted once in the root layout. Cookieless, so there is no consent banner to wait for.
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    getTracker()?.start();
  }, []);

  useEffect(() => {
    getTracker()?.pageChanged(pathname);
  }, [pathname]);

  return null;
}
