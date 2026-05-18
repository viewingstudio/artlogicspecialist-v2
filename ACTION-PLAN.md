# SEO Action Plan — artlogicspecialist.com

**Date:** 2026-05-16
Companion to `FULL-AUDIT-REPORT.md`.

Tiers reflect impact × effort. **Do P0 this week, P1 this month, P2 this quarter.**

---

## P0 — Critical, do this week

### 1. Fix the broken JSON-LD schema 🔴
The only structured data on the homepage is raw Sanity CMS data with no `@context` and no `@type`. Google ignores it.

Add valid JSON-LD blocks. Minimum set:

**Site-wide (in base layout `src/components/layout/SEO.astro`):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "The Artlogic Specialist",
  "url": "https://www.artlogicspecialist.com",
  "logo": "https://www.artlogicspecialist.com/logo.svg",
  "image": "https://www.artlogicspecialist.com/og-image.jpg",
  "description": "Artlogic website specialist helping galleries design, customise, and grow their sites.",
  "founder": {
    "@type": "Person",
    "name": "Kurt Stubbings",
    "jobTitle": "Artlogic Website Specialist",
    "alumniOf": { "@type": "Organization", "name": "Artlogic" },
    "sameAs": [
      "https://www.linkedin.com/in/kurtstubbings",
      "https://kurtstubbings.com"
    ]
  },
  "areaServed": "Worldwide",
  "knowsAbout": ["Artlogic", "Art gallery websites", "SEO", "Website migration"]
}
</script>
```

**On `/artlogic/seo/` and `/artlogic/website-migration/`:** add `Service` schema with `provider` referencing the Organization above.

**On every page:** add `BreadcrumbList`.

**Validate:** https://search.google.com/test/rich-results before merging.

### 2. Fill or remove the empty `/artlogic/` hub page 🔴
Currently has no H1, no meta description, no body content. Either:
- Make it a proper hub: H1 "Artlogic Services for Galleries", intro paragraph, cards linking to `/artlogic/seo/` and `/artlogic/website-migration/` and any future service pages.
- Or 301-redirect it to `/` and remove from nav.

Don't leave an indexable empty page — it hurts Helpful Content scoring across the whole domain.

### 3. Rewrite the `/contact/` title 🔴
Current: `Contact` (7 chars).
Suggested: `Book a Free Artlogic Consultation | The Artlogic Specialist` (~60 chars).

Apply the same upgrade in `src/pages/contact.astro` (the file you have open).

### 4. Rewrite the homepage title for query intent ⚠️
Current: `The Artlogic Specialist | Kurt Stubbings | Website Designer`
Suggested: `Artlogic Website Specialist for Art Galleries | Kurt Stubbings`

Lead with the query, keep your name, drop the generic "Website Designer".

### 5. Add `alt` text to the 3 homepage images missing it ⚠️
Three section-background images on the homepage have `alt=null`. Either add descriptive alt text or, if purely decorative, set `alt=""` explicitly so screen readers skip them and Lighthouse stops flagging.

### 6. Tighten meta descriptions to ≤155 chars ⚠️
`/` (183), `/artlogic/seo/` (160), `/artlogic/website-migration/` (161), `/contact/` (170) all get truncated on mobile SERPs.

---

## P1 — High impact, do this month

### 7. Ship case studies as their own indexable pages 🔴
The repo has scaffolding for case studies; none are live. Each case study = one ranking opportunity for gallery-name + "website" queries.

Minimum per case study: 600+ words, H1 = gallery name + descriptor, 4–8 images with alt text, results section, link back to relevant service page, `CreativeWork` or `Article` schema.

### 8. Start a blog targeting Artlogic-specific long-tail queries
Topic ideas that match buyer intent based on your existing services:
- "How to set up canonical URLs on Artlogic"
- "Artlogic SEO checklist for galleries"
- "Migrating from [WordPress/Squarespace/etc] to Artlogic"
- "Artlogic vs Cargo vs Exhibbit for galleries"
- "Optimizing artwork images for Artlogic"
- "Adding structured data on Artlogic"

Even **6–10 well-researched posts** (1,000+ words each) will radically expand your indexable surface area.

### 9. Add an `/about/` page with strong E-E-A-T signals
Author bio + photo, credentials, years at Artlogic, named clients (with logos), testimonials, link to LinkedIn. Mark up with `Person` schema (`jobTitle`, `worksFor`, `alumniOf`, `sameAs`, `knowsAbout`).

### 10. Add `BreadcrumbList` schema and visible breadcrumbs on `/artlogic/*` pages

### 11. Beef up `/artlogic/seo/` to 800–1,200 words
Currently 292 words — too thin to rank for "Artlogic SEO". Add:
- What's different about SEO on Artlogic (vs. WordPress/Shopify)
- Common Artlogic SEO issues you fix
- What's included in an audit
- Process / timeline
- Sample results (link to case study)
- 5–8 Q&A pairs in body text (not as FAQPage schema — Google restricted it)

### 12. Add `llms.txt` and `llms-full.txt`
Create `public/llms.txt`:
```
# The Artlogic Specialist
> Artlogic website specialist helping art galleries design, customise, and grow their sites. 10+ years experience, 3 years at Artlogic.

## Services
- [Artlogic SEO](https://www.artlogicspecialist.com/artlogic/seo/): SEO audits, training, and ongoing strategy tailored to Artlogic.
- [Artlogic Website Setup & Migration](https://www.artlogicspecialist.com/artlogic/website-migration/): Full setup and migration for galleries.
- [Book a Consultation](https://www.artlogicspecialist.com/contact/): Free 45-minute consultation.

## About
- Founder: Kurt Stubbings, former Artlogic designer.
```

### 13. Explicitly manage AI crawlers in `public/robots.txt`
Decide your policy. If you want AI assistants to cite you (recommended for a consultancy):
```
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: https://www.artlogicspecialist.com/sitemap-index.xml
```

### 14. Improve homepage readability
Average sentence is 26 words. Break the hero intro and service blurbs into shorter sentences (target 15–20 word avg). Aim for Flesch 50+.

### 15. Add security headers at the Netlify edge
In `netlify.toml` or `_headers`:
```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://cdn.sanity.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; (tune per actual assets)
```

### 16. Set up Google Search Console + Bing Webmaster Tools
You need impression / click / query data to make further decisions evidence-based. Submit the sitemap. Watch for coverage errors. (Likely you already have GSC — if not, this is the single highest-ROI thing you can do.)

---

## P2 — Strategic, do this quarter

### 17. Build out programmatic / templated pages for long-tail capture
- One page per common Artlogic migration source: "Migrate to Artlogic from [WordPress / Squarespace / Cargo / Exhibbit / custom]"
- One page per gallery type/segment: "Artlogic for emerging galleries", "Artlogic for blue-chip galleries", "Artlogic for artist estates"

Enforce: unique copy per page (not templated boilerplate), 600+ words, unique meta, internal links between siblings.

### 18. Get real backlinks
For a B2B consultancy in a tiny niche, 5–15 high-relevance backlinks will move the needle more than any on-page tweak. Sources:
- Guest articles on art-industry blogs (Artnet, Hyperallergic, etc.)
- A "tools/resources" page on Artlogic's own knowledge base (worth asking)
- Case-study reciprocal links from gallery clients
- Speaking/podcast appearances → show notes links

### 19. Add a testimonials section with `Review` schema on the homepage
Use real client quotes. Mark up with `Review` nested in your `ProfessionalService` schema (not standalone, which Google flags).

### 20. Migrate to the Astro + Pages CMS repo cleanly
The cutover from Sanity → this repo is an opportunity to fix all the schema, content, and sitemap issues above in one go rather than patching the old site. Make sure the migration:
- Keeps every existing URL or 301-redirects it
- Generates a complete `sitemap-index.xml` (you have `@astrojs/sitemap` — verify it's wired up)
- Doesn't drop the OG image references

### 21. Re-run this audit after P0+P1 ship
Re-run with a PSI API key set so Core Web Vitals get measured. Target: 75+ overall.

---

## Quick wins you can do in the next hour

1. Add `alt=""` to the 3 homepage images.
2. Change `/contact/` `<title>` in `src/pages/contact.astro`.
3. Trim the 4 over-length meta descriptions to ≤155 chars.
4. Add `includeSubDomains; preload` to the HSTS header.
5. Add `Sitemap:` line to `public/robots.txt` if not already present.
