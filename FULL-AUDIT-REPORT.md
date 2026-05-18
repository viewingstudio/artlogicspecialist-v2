# SEO Audit — artlogicspecialist.com

**Date:** 2026-05-18
**Audited URL:** https://artlogicspecialist.com/
**Method:** LLM-first analysis with script-backed evidence (LLM-first SEO skill)

---

## Overall Score: 80 / 100 — Good

The site has a strong technical foundation: excellent llms.txt, AI-crawler friendly robots, rich schema, secure headers, valid canonical (www resolves, sitemap resolves, og:image resolves), 0-hop response from Cloudflare edge. The remaining gaps are a **missing H1** and a few quick on-page wins.

| Category | Weight | Score | Notes |
|---|---|---|---|
| Technical SEO | 25% | 80 | Valid canonical & sitemap; CSP missing; apex serves 200 (canonical tag handles consolidation) |
| Content Quality | 20% | 65 | Missing H1, dense readability |
| On-Page SEO | 15% | 70 | Title 64 chars, og:title 62 chars |
| Schema / Structured Data | 15% | 95 | Rich `ProfessionalService`, all referenced URLs resolve |
| Performance (CWV) | 10% | N/A | PageSpeed API rate-limited (Hypothesis) |
| Image Optimization | 10% | 80 | All WebP, dimensions present, hero is lazy-loaded |
| AI Search Readiness (GEO) | 5% | 95 | Excellent llms.txt (100/100), all AI bots allowed |

---

## 🔴 Critical Findings

### 1. Homepage has no `<h1>` — Confirmed
- **Evidence:** `parse_html.py` reports `"h1": []`. The page jumps straight into multiple H2s (e.g. "Former Artlogic designer, now here to help your gallery grow online.").
- **Impact:** H1 is a primary topical signal for ranking and accessibility. Most SEO scorers and screen readers flag missing H1.
- **Fix:** Promote the hero headline to `<h1>`. Recommended: `<h1>Artlogic Website Specialist for Art Galleries</h1>` (matches title intent, includes primary keyword).

---

## ⚠️ Warnings

### 2. Apex serves 200 instead of redirecting to www (low priority)
- **Evidence:** `curl -I https://artlogicspecialist.com` → 200. `curl -I https://www.artlogicspecialist.com` → 200. Both serve identical HTML.
- **Impact:** Minor duplicate-content risk. Your `<link rel="canonical">` points to www, so Google will consolidate signals correctly — this is exactly what canonical tags are for. A 301 from apex → www would be a stronger signal but isn't required.
- **Fix (optional):** Add a Cloudflare Bulk Redirect rule, or Astro middleware that 301s apex to www. Skipped per your decision to keep things simple.

### 3. No Content-Security-Policy header
- **Evidence:** `security_headers.py` — 5/6 headers present; CSP missing. Score 85/100.
- **Impact:** XSS / clickjacking surface. Not a direct ranking signal but part of trust/security signals.
- **Fix:** Add via Cloudflare. Start with report-only mode:
  `Content-Security-Policy-Report-Only: default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self';`

### 4. Hero image is `loading="lazy"` — hurts LCP
- **Evidence:** `home-hero.27m3A_gY_Z1o4roC.webp` (2740×2116) has `loading="lazy"`. It is the largest above-the-fold element and almost certainly the LCP candidate.
- **Impact:** Lazy-loading the LCP image delays Largest Contentful Paint, hurting CWV (LCP target < 2.5s).
- **Fix:** Set `loading="eager"` and add `fetchpriority="high"` on the hero `<img>`. Remove `lazy` for any image above the fold. Also: 2740×2116 is much larger than needed — serve a responsive `srcset` and downscale.

### 5. Title and og:title slightly over recommended length
- **Evidence:** `<title>` is 64 chars: "Artlogic Website Specialist for Art Galleries | Kurt Stubbings". `og:title` is 62 chars (max 60).
- **Impact:** Truncation in SERP and social previews.
- **Fix:** Trim to ≤ 60. Suggested: `Artlogic Website Specialist for Art Galleries` (45) or keep the brand suffix shorter.

### 6. Viewport meta is incomplete
- **Evidence:** `<meta name="viewport" content="width=device-width">` — missing `initial-scale=1`.
- **Impact:** Inconsistent mobile rendering (mobile-first indexing is 100% since Jul 2024).
- **Fix:** `<meta name="viewport" content="width=device-width, initial-scale=1">`.

### 7. Long, dense readability
- **Evidence:** `readability.py` — Flesch 36.9 ("Very Difficult / college"), Flesch-Kincaid grade 14.7, avg sentence 26.4 words, 20.3% complex words.
- **Impact:** Engagement and AI-search snippet selection both prefer scannable prose.
- **Fix:** Break the hero intro and section descriptions into shorter sentences (target 15–20 words). One idea per sentence.

### 8. Render-blocking Google Fonts via `<link>` with no preload
- **Evidence:** `resource_hints` shows `preconnect` to fonts.googleapis.com/gstatic.com but no `<link rel="preload">` for the actual font file.
- **Fix:** Self-host fonts via `@fontsource-variable/...` and remove the preconnects. Often shaves 100–300ms off LCP.

---

## ✅ Pass / Strengths

- **llms.txt 100/100** — present, well-structured, 7 sections, 10 links. Top-tier AI search readiness.
- **AI crawler robots policy** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, Bytespider, CCBot, anthropic-ai all explicitly allowed.
- **Schema** — `ProfessionalService` with `@id`, `knowsAbout` (8 topical entities), `areaServed`, `founder` reference, `sameAs`, `address`, `logo`, `image`. Strong entity definition. (Just make sure the `@id` URL actually resolves — see Finding #1.)
- **Security headers** — HSTS with preload + includeSubDomains, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all set.
- **Image format** — every image is WebP with width/height attributes (no CLS).
- **Sitemap** — clean sitemap-index → sitemap-0.xml, HTTP 200, Cloudflare cached.
- **Response speed** — 0 redirect hops, 76ms TTFB from edge.
- **All alt text present and descriptive** on the 6 homepage images.
- **HTTPS + HSTS preload-ready.**

---

## ℹ️ Info / Not Issues

- **LinkedIn 999 response** — LinkedIn always blocks bots with 999. Not actually broken.
- **og:locale missing** — optional. Add `en_GB` if you want.
- **twitter:site / twitter:creator missing** — optional.
- **llms-full.txt missing** — optional companion to llms.txt; nice-to-have, not required.

---

## Environment Limitations

- **PageSpeed Insights API was rate-limited** during this run, so Core Web Vitals (LCP, INP, CLS field data) could not be measured. Recommendation: re-run `pagespeed.py` with a PSI API key. CWV findings above (#4, #8) are **Likely** based on HTML inspection, not confirmed from CrUX.
- Only the homepage was crawled. A multi-page audit is worth running once the canonical issue is fixed.

---

## Evidence Summary Table

| Check | Status | Source |
|---|---|---|
| robots.txt | ✅ 200, AI bots allowed | robots_checker.py |
| llms.txt | ✅ 100/100 | llms_txt_checker.py |
| Sitemap | ✅ 200 (apex serves it despite robots.txt pointing to www) | curl |
| Canonical host | ✅ www resolves, serves 200, og:image + sitemap OK | dig + curl --resolve |
| Apex redirect | ⚠️ Apex serves 200 (canonical tag handles consolidation) | curl |
| `<h1>` | 🔴 Missing | parse_html.py |
| Security headers | ⚠️ CSP missing, 85/100 | security_headers.py |
| Social meta | ⚠️ 77/100, og:title 62 chars | social_meta.py |
| Schema | ✅ ProfessionalService, rich | parse_html.py |
| Redirects | ✅ 0 hops, 76ms | redirect_checker.py |
| Broken links | ⚠️ 1 (LinkedIn — false positive) | broken_links.py |
| Readability | ⚠️ Grade 14.7, Flesch 36.9 | readability.py |
| Hero LCP image | ⚠️ `loading=lazy` | parse_html.py |
| Viewport meta | ⚠️ Missing initial-scale | parse_html.py |
| CWV field data | ℹ️ Not measured (API rate-limited) | pagespeed.py |
