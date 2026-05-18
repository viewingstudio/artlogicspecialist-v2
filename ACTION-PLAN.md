# SEO Action Plan — artlogicspecialist.com

**Date:** 2026-05-18 (revised after confirming `www` resolves)
Prioritized by impact × effort. Numbers reference findings in `FULL-AUDIT-REPORT.md`.

---

## 🔴 Do this week (high impact, low effort)

### 1. Add an `<h1>` to the homepage (Finding #1)
- [ ] In the hero block component, wrap the headline in `<h1>`. Suggested copy: `Artlogic Website Specialist for Art Galleries`.
- [ ] One H1 per page only — demote anything that conflicts.

### 2. Trim title and og:title to ≤ 60 chars (Finding #5)
- [ ] Update homepage frontmatter / SEO defaults. Suggested: `Artlogic Website Specialist for Art Galleries` (45 chars) — keep the brand suffix in `og:site_name`.

### 3. Fix viewport meta (Finding #6)
- [ ] One-line change in the base layout: `<meta name="viewport" content="width=device-width, initial-scale=1">`.

### 4. Un-lazy the hero image (Finding #4)
- [ ] On `home-hero.webp`: change `loading="lazy"` to `loading="eager"` and add `fetchpriority="high"`.
- [ ] Audit other page heroes for the same issue.

---

## ⚠️ Do this month (medium impact)

### 5. Add CSP header (Finding #3)
- [ ] Configure in Cloudflare Transform Rules or Wrangler `_headers`. Start in report-only mode for a week, then enforce.

### 6. Self-host fonts (Finding #8)
- [ ] Replace Google Fonts `<link>` with `@fontsource-variable/<family>` import in Astro.
- [ ] Remove the two preconnect hints once Google Fonts is gone.
- [ ] Expected: 100–300ms LCP improvement.

### 7. Generate responsive `srcset` for the hero (Finding #4 cont.)
- [ ] 2740×2116 is overkill. Use Astro's `<Image>` / `<Picture>` to emit `srcset` with 800/1200/1600/2400 widths.

### 8. Copy edit for readability (Finding #7)
- [ ] Target Flesch ≥ 60 / grade ≤ 10. Break sentences > 20 words. Hero intro and "Why galleries choose to work with me" are the biggest offenders.

---

## ℹ️ Nice to have

- [ ] Add `og:locale` = `en_GB`.
- [ ] Add `twitter:site` / `twitter:creator` if you have a handle.
- [ ] Generate `llms-full.txt` (concatenated content) for richer AI ingestion.
- [ ] Get a free PageSpeed Insights API key and add to `.env` so the next audit can pull real CWV field data.
- [ ] (Optional) Add an apex → www 301 via Cloudflare Bulk Redirect — the canonical tag is doing the job, but a redirect is a stronger signal.

---

## Re-audit checklist (after changes ship)

```bash
SKILL=/Users/kurt/.claude/skills/seo
python3 $SKILL/scripts/fetch_page.py https://www.artlogicspecialist.com --output /tmp/page.html
python3 $SKILL/scripts/parse_html.py /tmp/page.html --url https://www.artlogicspecialist.com --json | jq '{title, h1, canonical}'
python3 $SKILL/scripts/social_meta.py https://www.artlogicspecialist.com
python3 $SKILL/scripts/security_headers.py https://www.artlogicspecialist.com
python3 $SKILL/scripts/pagespeed.py https://www.artlogicspecialist.com --strategy mobile
```

Verify:
- `h1` array is non-empty
- title length ≤ 60
- security score ≥ 95 (with CSP)
- LCP < 2.5s on mobile
