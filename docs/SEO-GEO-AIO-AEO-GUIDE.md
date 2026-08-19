# SEO, GEO, AIO and AEO Implementation Guide

This document explains why the SK ZIC South Africa website was optimised for search engines and AI answer systems, what was implemented, how the pieces work together, and how to maintain them.

## 1. What these terms mean

### SEO: Search Engine Optimisation

SEO helps traditional search engines discover, understand and rank a website. For this site, that means making it easy for Google and Bing to answer questions such as:

- What is SK ZIC?
- Who distributes SK ZIC in South Africa?
- Which SK ZIC products are available locally?
- What specifications and pack sizes does a product have?
- Where can someone buy or enquire about a product?

Technical SEO does not guarantee rankings. It removes technical ambiguity and gives search engines reliable content to evaluate.

### GEO: Generative Engine Optimisation

GEO helps generative search and research systems identify reliable facts that they can cite or summarise. Examples include AI-generated search results and conversational research tools.

These systems work best when information is:

- written in clear, direct language;
- consistent across pages;
- associated with named organisations, brands and products;
- available in the original server response;
- supported by structured data and stable URLs; and
- careful about technical claims and limitations.

### AIO: AI Optimisation

AIO is the broader practice of making content understandable to AI crawlers and language models. It overlaps with GEO and includes providing concise machine-readable summaries such as `llms.txt`.

`llms.txt` is an emerging convention, not a formal ranking requirement. It is useful as a compact map of the site's authoritative content, but it does not replace good HTML, internal links, metadata or structured data.

### AEO: Answer Engine Optimisation

AEO helps search engines and assistants return a direct, accurate answer to a specific question. The main techniques used here are:

- question-and-answer content written in natural language;
- short answers that make sense without surrounding marketing copy;
- FAQ structured data matching visible page content; and
- detailed product pages that answer one search intent at a time.

## 2. The core principle: HTML is the source of truth

The most important requirement is that meaningful content exists in the server-rendered HTML. A crawler should not need to click a button, scroll through an animation or execute application JavaScript to discover the main facts.

This project uses the Next.js App Router. The homepage, supporting pages and known product routes are prerendered. Even components marked with `use client` receive server-rendered HTML before they become interactive in the browser.

The production build confirmed:

- the homepage is generated as static HTML;
- all five product routes are statically generated using `generateStaticParams`;
- legal, resource and contact pages are generated as static HTML;
- metadata appears in the initial document `<head>`; and
- FAQ questions and answers appear in the initial homepage HTML.

Animation may change how content appears visually, but the actual words remain part of the document. The new FAQ section is also deliberately simple and semantic so important answers are readable without depending on animation.

## 3. Shared metadata

The root metadata is defined in `app/layout.tsx`. It supplies safe defaults to every page:

- a default title and a title template;
- a site description;
- the canonical site origin;
- Open Graph metadata;
- Twitter card metadata;
- language information for South African English;
- author, creator and publisher information;
- index and follow directives;
- large image and unrestricted snippet permissions for Google; and
- a focused set of topical keywords.

The title template means a child page can declare a concise title such as:

```text
ZIC X7 5W-30
```

Next.js then renders:

```text
ZIC X7 5W-30 | SK ZIC South Africa
```

This avoids repeating title-building logic and keeps naming consistent.

### Canonical URLs

A canonical URL tells a search engine which URL is the preferred version of a page. This prevents query strings, alternate paths or accidental duplicate URLs from competing with the main page.

Examples:

```text
https://zic.parts-mall.co.za
https://zic.parts-mall.co.za/products/x7-5w30
```

The root layout supplies the homepage canonical. Supporting and product pages supply their own canonicals.

### Social metadata

Open Graph and Twitter metadata controls how links are represented when shared. It also gives crawlers another clear title, description and representative image for each page.

Product pages use their product pack image. General pages use the site's oil-crown image.

## 4. Page-specific metadata

Supporting pages use the `pageMetadata` helper in `components/SupportPage.tsx`. It consistently generates:

- the page title;
- description;
- canonical URL;
- `en-ZA` language alternate;
- Open Graph fields; and
- Twitter card fields.

Product pages use `generateMetadata` in `app/products/[slug]/page.tsx`. Metadata is built from the same `PRODUCTS` record used to render the page. This prevents the visible product name and search metadata from drifting apart.

When adding a new product, update the product source of truth in `content/products.ts`. The product route, metadata, structured data, sitemap and AI reference files will then use that record.

## 5. Structured data and entity relationships

Structured data is JSON-LD placed in a script with the media type `application/ld+json`. Visitors do not see it, but machines can use it to understand what a page represents.

The reusable renderer is `components/StructuredData.tsx`. It serialises the data and escapes `<` characters to prevent an embedded value from closing the script element unexpectedly.

### Site-wide graph

The root layout publishes two connected entities:

1. `Organization` describes Parts-Mall Africa, including its address, email, operating region and subject matter.
2. `WebSite` describes SK ZIC South Africa and identifies Parts-Mall Africa as its publisher.

Stable `@id` values connect these entities to page-level graphs:

```text
https://zic.parts-mall.co.za/#organization
https://zic.parts-mall.co.za/#website
```

An `@id` is an identifier, not another visible page. Reusing the same identifier tells a machine that references on different routes refer to the same entity.

### Homepage graph

The homepage publishes:

- `WebPage` for the page itself;
- `ItemList` for the five-product South African range; and
- `FAQPage` for the visible questions and answers.

The item list gives each product a position and stable detail-page URL. The FAQ graph uses exactly the same questions and answers rendered in the visible FAQ section. Structured data should never contain hidden claims that visitors cannot verify on the page.

### Product graph

Every product page publishes:

- `Product` with its name, description, image, SKU, brand, manufacturer and category;
- `PropertyValue` entries for grade, oil type, pack sizes and published specifications;
- `WebPage` connecting the document to the product and website; and
- `BreadcrumbList` describing Home → Products → Product.

No price, rating, availability or review was invented. Those properties should only be added when real, maintained data exists. Fabricated offer data may make a rich-result test look more complete, but it would reduce trust and could violate search-engine guidelines.

## 6. Visible answer-first FAQ content

The FAQ data is stored in `lib/seo.ts` and rendered by `components/sections/Faq.tsx`.

The section answers common questions about:

- the SK ZIC brand;
- the South African distributor;
- where products are available;
- how to choose the correct lubricant;
- YUBASE technology; and
- why multi-vehicle ATF is not universal.

The answers are concise and self-contained. For example, the oil-selection answer starts with the actual selection rule instead of a promotional introduction. This format helps people, conventional featured snippets and generative answer systems.

The FAQ uses native `<details>` and `<summary>` elements. The answer remains in the HTML even when the disclosure is visually closed.

When editing an FAQ, change the record in `HOME_FAQS`. Both the visible answer and JSON-LD graph are generated from that one record, preventing inconsistencies.

## 7. Robots and crawler access

`app/robots.ts` generates `/robots.txt`.

The general rule allows public content and disallows the enquiry API:

```text
User-Agent: *
Allow: /
Disallow: /api/
```

Explicit allow rules are also provided for:

- Googlebot;
- Bingbot;
- OAI-SearchBot;
- ChatGPT-User;
- GPTBot;
- ClaudeBot;
- PerplexityBot;
- Google-Extended; and
- CCBot.

The explicit AI rules make the site's policy unambiguous. They do not force a service to crawl, index, train on or cite the site.

The file also advertises the XML sitemap:

```text
Sitemap: https://zic.parts-mall.co.za/sitemap.xml
```

### Intentional exclusions

Not every route should be indexed:

- `/api/` is an application endpoint, not useful search content.
- Real 404 responses use `noindex, follow` so invalid URLs do not become search results while links on the page can still be followed.

This is healthier than trying to make literally every response indexable.

## 8. XML sitemap

`app/sitemap.ts` generates `/sitemap.xml` from static route definitions and `content/products.ts`.

It includes:

- the homepage;
- resources and contact pages;
- privacy, terms, PAIA, cookies and accessibility pages; and
- every known product detail page.

Each entry has a canonical URL, last-modified date, change frequency and priority. The sitemap also contains:

- an `en-ZA` alternate for each page;
- the main social image for the homepage; and
- the corresponding pack image for every product.

Image sitemap entries help search engines discover product images even though filenames contain spaces and are served through application markup.

### Maintaining the last-modified date

The date should represent a meaningful content or product-data revision. Do not update it on every deployment if the page content did not change. A false freshness signal teaches crawlers that the field is unreliable.

## 9. `llms.txt` and `llms-full.txt`

Two static text routes were added:

```text
https://zic.parts-mall.co.za/llms.txt
https://zic.parts-mall.co.za/llms-full.txt
```

`app/llms.txt/route.ts` provides a short map of:

- the site's purpose;
- primary pages;
- all locally available products;
- important technical cautions; and
- the detailed reference URL.

`app/llms-full.txt/route.ts` expands the product records into a plain-text technical reference with categories, oil types, pack sizes, specifications, benefits, application guidance and warnings.

Both routes are statically generated during the production build. Product details come from `content/products.ts`, so they remain aligned with the website.

These files are supplementary. HTML pages remain the canonical source because search and AI systems are not required to support the `llms.txt` convention.

## 10. Indexability by route type

| Route type | Rendering | Index policy | Reason |
| --- | --- | --- | --- |
| Homepage | Static HTML | Index, follow | Main brand and product discovery page |
| Product pages | Static HTML | Index, follow | Unique product specifications and guidance |
| Resources | Static HTML | Index, follow | Technical-document guidance |
| Contact | Static HTML | Index, follow | Distributor and location information |
| Legal/accessibility | Static HTML | Index, follow | Public policies and trust information |
| `llms.txt` files | Static plain text | Crawlable | Supplementary AI-readable summaries |
| Enquiry API | Server endpoint | Blocked in robots | Not a content page |
| 404 response | Static error document | Noindex, follow | Prevent invalid URLs entering results |

## 11. Verification performed

The following checks were completed after implementation:

### Type checking

```powershell
npm run typecheck
```

This completed without TypeScript errors.

### Production build

```powershell
npm run build
```

The clean production build completed successfully and generated 22 routes. The homepage and supporting pages were emitted as static content, and all five product detail routes were emitted as statically generated pages.

### Generated-output inspection

The generated files were inspected to confirm:

- the homepage title, description and canonical URL exist;
- FAQ questions and answers are present in server-rendered HTML;
- product pages contain their canonical URLs and `Product` graphs;
- JSON-LD blocks parse as valid JSON;
- the 404 document contains `noindex, follow`;
- the sitemap contains image and `en-ZA` entries; and
- both LLM text endpoints are generated.

`git diff --check` also completed without whitespace errors.

## 12. Deployment checklist

After deployment, verify the public origin rather than relying only on local build output.

1. Open `https://zic.parts-mall.co.za/robots.txt` and confirm the rules are visible.
2. Open `https://zic.parts-mall.co.za/sitemap.xml` and confirm every expected page appears.
3. Open `/llms.txt` and `/llms-full.txt` and confirm they return readable plain text.
4. View the source of the homepage and a product page. Search for the description, canonical URL and `application/ld+json`.
5. Confirm an invalid URL returns HTTP 404 and contains a `noindex` directive.
6. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
7. Inspect the homepage and each product URL in the search-engine webmaster tools and request indexing when appropriate.
8. Test representative pages with a structured-data validator.
9. Watch indexing, crawl and structured-data reports for errors after deployment.

Search engines decide when and whether to index a URL. Submission is a discovery request, not an indexing guarantee.

## 13. Content maintenance rules

### When adding a product

1. Add the confirmed product to `content/products.ts`.
2. Add an accurate product image under `public/products`.
3. Check that the product ID creates a concise, permanent URL slug.
4. Include only confirmed specifications and claim verbs.
5. Run type checking and the production build.
6. Inspect the new product page and sitemap entry.

The product route, homepage list, navigation, footer, sitemap, JSON-LD and LLM files all depend on the shared product record.

### When changing a technical claim

- Update the product source of truth rather than copying corrections into individual outputs.
- Preserve the distinction between “approved,” “meets,” “meets or exceeds” and “suitable for use.”
- Keep warnings visible when a product is not appropriate for an emissions system or transmission type.
- Update the sitemap modification date when the published content meaningfully changes.
- Request the current controlled TDS or SDS before presenting a document as current.

### When adding a page

Every new public page should have:

- one descriptive `<h1>`;
- a unique title and description;
- a canonical URL;
- useful internal links to and from the page;
- server-rendered primary content;
- a sitemap entry when it is intended for discovery; and
- structured data only when it accurately describes visible content.

### When editing FAQs

- Answer the question in the first sentence.
- Avoid vague phrases such as “industry-leading solution.”
- Use the exact organisation, product and geographic names.
- Keep the answer understandable outside the page's visual context.
- Do not add FAQ structured data for questions that are not visible to visitors.

## 14. What this implementation cannot guarantee

Technical compatibility is only one part of organic visibility. This implementation cannot guarantee:

- a particular ranking;
- inclusion in an AI-generated answer;
- a rich-result display;
- immediate crawling or indexing;
- backlinks or third-party citations; or
- that a crawler will honour an emerging convention such as `llms.txt`.

Long-term performance still depends on accurate content, product-document availability, local business signals, reputable external references, site speed, real user usefulness and ongoing webmaster-tool monitoring.

## 15. File map

| File | Responsibility |
| --- | --- |
| `app/layout.tsx` | Shared metadata, crawler directives and site-wide entity graph |
| `app/page.tsx` | Homepage WebPage, product list and FAQ structured data |
| `app/products/[slug]/page.tsx` | Product metadata and Product/WebPage/Breadcrumb graphs |
| `app/robots.ts` | Search and AI crawler permissions |
| `app/sitemap.ts` | Public URL, language and image discovery |
| `app/not-found.tsx` | Correct noindex handling for missing pages |
| `app/llms.txt/route.ts` | Short AI-readable site map |
| `app/llms-full.txt/route.ts` | Detailed AI-readable product reference |
| `components/StructuredData.tsx` | Safe reusable JSON-LD output |
| `components/SupportPage.tsx` | Consistent supporting-page metadata |
| `components/sections/Faq.tsx` | Visible semantic FAQ section |
| `content/products.ts` | Product source of truth |
| `content/sections.ts` | Homepage section and navigation register |
| `lib/seo.ts` | Shared site constants, entity IDs and FAQ content |

The design goal is simple: write accurate information once, render it visibly for people, expose it semantically for machines, and keep every representation connected to the same source of truth.
