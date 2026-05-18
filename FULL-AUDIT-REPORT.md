# SEO Full Audit — artlogicspecialist.com

**URL:** https://www.artlogicspecialist.com
**Date:** 2026-05-16
**Auditor:** Claude (LLM-first SEO skill)
**Methodology:** Direct page fetch + parse, robots/llms/sitemap checks, security headers, social meta, internal-link crawl, readability analysis. Findings labeled by confidence: **Confirmed** (script evidence), **Likely** (reasoning + partial evidence), **Hypothesis** (not directly verified).

> **Environment limitation:** Google PageSpeed Insights API returned rate-limit errors on repeated attempts, so Core Web Vitals (LCP, INP, CLS) could not be measured. Re-run with a PSI API key or test manually at https://pagespeed.web.dev/.

---

## Executive summary

The site is **technically clean but commercially under-built for SEO**. The four live pages have decent titles, meta descriptions, canonicals, OG tags, and HSTS. But you have almost nothing for Google to rank you on:

- **5 URLs in the sitemap.** No blog, no case studies, no programmatic pages. There is nothing for long-tail queries to land on.
- **Broken/missing JSON-LD schema.** The homepage's only structured-data block is leaking the raw Sanity CMS object (no `@context`, no valid `@type`). Google ignores it. There is no `Person`, `Organization`, `LocalBusiness`, `Service`, or `BreadcrumbList` schema anywhere.
- **`/artlogic/` hub page is empty** — no H1, no meta description, no body content. It's currently a dead URL inside your own nav.
- **`/contact` title is just "Contact"** — wastes the most valuable on-page SEO real estate.
- **No `llms.txt`**, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) are not explicitly addressed — so you have zero AI-search optimization (GEO/AEO).
- **Local repo is mid-migration** (Astro + Pages CMS) but the live site is still the older Sanity-driven build. Several SEO problems below are inherited from the live build and should be fixed *as part of* the migration cutover.

### Scores (LLM-first, weighted)

| Category | Score | Weight | Notes |
|---|---:|---:|---|
| Technical SEO | 62 | 25% | Robots OK, HTTPS+HSTS OK, sitemap exists but tiny; 5 missing security headers; no llms.txt |
| Content Quality | 38 | 20% | Thin content site-wide, no blog, hero readability "very difficult", empty hub page |
| On-Page SEO | 55 | 15% | Service pages well-optimized; homepage + contact + /artlogic underbuilt |
| Schema / Structured Data | 10 | 15% | Only block is malformed leaked CMS data; no valid JSON-LD anywhere |
| Performance (CWV) | — | 10% | Not measured (PSI rate-limited) |
| Image Optimization | 55 | 10% | Mixed: 3 of 6 homepage images missing alt; one hero served at 2740×2116 |
| AI Search Readiness (GEO) | 25 | 5% | No llms.txt, no FAQ-style answers, no entity schema |

**Overall (excluding CWV, re-weighted):** **≈42 / 100 — Poor.** The site is healthy under the hood but is too small and too thinly-described to compete for the queries you want.

---

## 1. Crawlability & indexability (Confirmed)

| Item | Value | Severity |
|---|---|:---:|
| robots.txt | Present, 200 OK, allows all | ✅ |
| Sitemap referenced in robots.txt | `https://www.artlogicspecialist.com/sitemap-index.xml` | ✅ |
| `/sitemap.xml` direct fetch | **404** (only sitemap-index works) | ⚠️ |
| URLs in sitemap | **5 total** | 🔴 |
| Canonical tags | Present on all 4 sampled pages, self-referential | ✅ |
| `meta robots` | `index,follow` everywhere | ✅ |
| Redirect chain to `https://www.` | 0 hops | ✅ |
| HTTPS / HSTS | Yes (`max-age=31536000`, no `includeSubDomains`) | ⚠️ |

**Sitemap contents (entire site):**
```
/
/artlogic/
/artlogic/seo/
/artlogic/website-migration/
/contact/
```

**Impact:** Search engines literally cannot find more than 5 things to rank you on. Most service businesses in this niche have 30–150+ indexable pages (one per service, location, case study, blog post, comparison page).

---

## 2. Structured data / schema (Confirmed — critical)

The only JSON-LD block on the homepage:
```json
{
  "logo": { "_type": "image", "asset": { "_ref": "image-…", "_type": "reference" } },
  "name": "The Artlogic Specialist"
}
```

This is **raw Sanity CMS data being dumped into a `<script type="application/ld+json">` tag**. It has:
- No `@context` (must be `https://schema.org`)
- No `@type` (must be `Organization`, `Person`, etc.)
- `_ref` / `_type` are Sanity internal fields, not schema.org

Google's parser drops it silently. You currently have **zero valid structured data** on the site.

**What's missing site-wide:**
- `Organization` / `LocalBusiness` (with `name`, `url`, `logo`, `sameAs` for LinkedIn, `areaServed`, `founder`)
- `Person` (Kurt Stubbings — `jobTitle`, `worksFor`, `alumniOf` Artlogic, `sameAs`)
- `Service` blocks on `/artlogic/seo/` and `/artlogic/website-migration/` (with `provider`, `serviceType`, `areaServed`)
- `BreadcrumbList` on nested pages
- `WebSite` with `SearchAction` on the homepage

> Note on FAQ schema: do **not** add `FAQPage` — Google restricted it to government/health authority sites in Aug 2023.

---

## 3. On-page SEO per URL (Confirmed)

| URL | Title (len) | Meta desc (len) | H1 | Content | Verdict |
|---|---|---:|---|---|---|
| `/` | "The Artlogic Specialist \| Kurt Stubbings \| Website Designer" (59) | 183 (slightly long) | 1 ✅ | OK | Title is brand-led, not query-led |
| `/artlogic/` | "The Artlogic Specialist" (23) | **empty** | **none** | **empty page** | 🔴 Dead hub page |
| `/artlogic/seo/` | "Artlogic SEO for Art Galleries \| Specialist SEO Consultant for Artlogic Websites" (80) | 160 | 1 ✅ | 292 words | Best page; still thin |
| `/artlogic/website-migration/` | "Artlogic Website Setup & Migration \| Specialist for Art Galleries" (65) | 161 | 1 ✅ | OK | Good |
| `/contact/` | "Contact" (7) | 170 | "Helping galleries get more from their Artlogic websites" | OK | 🔴 Title wastes SERP real estate |

**Top issues:**
- 🔴 `/artlogic/` page is completely empty (no H1, no meta description, no body content) yet it's linked from the main nav. It's an indexable empty page — exactly the kind of "thin content" Google's Helpful Content update targets.
- 🔴 `/contact/` title is `Contact` — should be e.g. `Book a Free Artlogic Consultation | The Artlogic Specialist`.
- ⚠️ Homepage title leads with brand, not the query users actually search ("Artlogic website designer", "Artlogic specialist", "Artlogic SEO consultant").
- ⚠️ Meta descriptions on `/`, `/artlogic/seo/`, `/artlogic/website-migration/` are all 160–183 chars — at or just over Google's mobile truncation point (~155 char safe limit).

---

## 4. Content quality (Confirmed + Likely)

- **Homepage readability:** Flesch 36.7 ("Very Difficult / college"), avg sentence length 26 words, 20% complex words. Long sentences will reduce engagement and dwell time. (Confirmed)
- **`/artlogic/seo/` body:** 292 words — flagged as thin. Competitors ranking for "Artlogic SEO" type queries will typically have 800–1,500 words plus FAQs. (Confirmed)
- **No blog, no case studies, no FAQ, no comparison content.** The local repo has scaffolding for case studies (under `src/pages/case-studies/` and a `caseStudies` collection mentioned in `.pages.yml`) but **none are published to the live site**. (Confirmed via sitemap)
- **E-E-A-T signals are weak.** No visible "About Kurt" page with credentials, no author bio block, no testimonials with schema, no `Person` schema linking to LinkedIn. Trust signals exist in copy ("3 years at Artlogic", "10+ years experience") but aren't structured for Google. (Likely)

---

## 5. AI search readiness — GEO / AEO (Confirmed)

| Check | Result |
|---|---|
| `/llms.txt` | 🔴 Not found (404) |
| `/llms-full.txt` | 🔴 Not found |
| GPTBot in robots.txt | ⚠️ Not explicitly managed |
| ClaudeBot | ⚠️ Not managed |
| PerplexityBot | ⚠️ Not managed |
| Google-Extended | ⚠️ Not managed |
| Applebot-Extended, Bytespider, CCBot, etc. | ⚠️ Not managed |

Currently AI assistants inherit your `User-agent: *` allow rule, so they **can** crawl you — but you have nothing concise for them to ingest (no `llms.txt`), no FAQ-style answers, no entity schema, no `Person`/`Organization` markup. If a user asks ChatGPT "who can help me with Artlogic SEO?", you have very little signal in the index.

---

## 6. Security & headers (Confirmed)

| Header | Status |
|---|---|
| HSTS | ✅ Present, but missing `includeSubDomains` |
| Content-Security-Policy | ❌ Missing |
| X-Frame-Options | ❌ Missing |
| X-Content-Type-Options | ❌ Missing |
| Referrer-Policy | ❌ Missing |
| Permissions-Policy | ❌ Missing |

Security score: **45/100**. Not a ranking factor directly but contributes to trust signals and is trivial to fix at the Netlify edge.

---

## 7. Social / Open Graph (Confirmed)

OG and Twitter cards score **69/100**. Both have title, description, image, url. Missing optional `og:image:width`/`height`, `og:site_name`, `twitter:site`, `twitter:creator`. Image is served from `cdn.sanity.io` at 1200×630 (correct).

---

## 8. Images (Confirmed)

- Homepage: 6 images, **3 missing `alt` attributes** (all 3 are 1920×1080 hero/section backgrounds from Sanity CDN).
- Hero image `home-hero.27m3A_gY_12gMUk.webp` is served at intrinsic 2740×2116 — Astro is generating a webp but at huge dimensions. Confirm `srcset` is producing smaller variants for mobile.
- Other pages: alt coverage is good (0 missing on the 3 sampled pages).

---

## 9. Internal links (Confirmed)

Crawl of depth 1 found only **4 unique pages and 20 total internal links**, all from the nav/footer. There are **zero contextual in-body links** between service pages, no "related case studies" blocks, no breadcrumbs. Anchor text is repetitive ("Artlogic SEO", "Website Migration", "Contact" appearing 5× each from header/footer repetition).

---

## 10. Repo / build status (Likely)

The local Pages CMS repo (`/Users/kurt/websites/artlogicspecialist-pagescms`) is mid-migration:
- Routes exist for `case-studies/[slug].astro` and a `caseStudies` collection is in `.pages.yml`.
- Git status shows many deleted asset files and `M astro.config.mjs` — looks like an in-flight content/structure rework.
- The **live** site still appears to be the older Sanity-driven build (evidenced by `cdn.sanity.io` images and Sanity-shaped JSON-LD).

The SEO fixes below should be applied to whichever codebase actually ships — ideally as part of the Astro cutover.

---

## Environment limitations

- Google PageSpeed Insights API returned rate-limit errors on retries → **Core Web Vitals (LCP, INP, CLS) not measured.** Test manually at https://pagespeed.web.dev/ or set `PAGESPEED_API_KEY` and re-run.
- No GSC / GA access, so click/impression data was not consulted.
- No competitor URLs supplied, so SERP-relative gaps are inferred not measured.

---

See `ACTION-PLAN.md` for prioritized fixes.
