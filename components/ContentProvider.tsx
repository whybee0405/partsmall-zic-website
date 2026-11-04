'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SiteContent } from '@/lib/cms/types';

/**
 * Site content from CloudIA CMS for client components. The root layout loads it once per request
 * (getSiteContent) and provides it here; server components call getSiteContent() directly.
 */
const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  const content = useContext(ContentContext);
  if (!content) throw new Error('useSiteContent() needs <ContentProvider> (app/layout.tsx)');
  return content;
}
