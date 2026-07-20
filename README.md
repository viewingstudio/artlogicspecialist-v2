# Artlogic Specialist

Marketing site for **artlogicspecialist.com** — an Artlogic website specialist for art galleries. Built with Astro, driven by [Pages CMS](https://pagescms.org/), and deployed to Cloudflare Workers.

## Stack

- **[Astro](https://astro.build) 6** — static + SSR, output via the Cloudflare adapter
- **[Pages CMS](https://pagescms.org/)** — Git-based content editing (`astro-pagescms` generates the content collection schema from `.pages.yml`)
- **[UnoCSS](https://unocss.dev/)** — utility styling (`uno.config.ts`), alongside CSS custom properties in `src/styles/`
- **[Alpine.js](https://alpinejs.dev/)** — lightweight client interactivity
- **Every Layout primitives** — composable layout components in `src/components/layout/`
- **Cloudflare Workers** — hosting (`wrangler.jsonc`), deployed at `www.artlogicspecialist.com`
- Fonts: Jost (variable) + Libre Caslon. Media: Plyr (video) and lightbox3.

## Getting started

This project uses **pnpm** (see `pnpm-lock.yaml`).

```sh
pnpm install
pnpm dev        # local dev server at localhost:4321
```

## Commands

All commands run from the project root:

| Command          | Action                                       |
| :--------------- | :------------------------------------------- |
| `pnpm install`   | Install dependencies                         |
| `pnpm dev`       | Start the local dev server at `localhost:4321` |
| `pnpm build`     | Build the production site to `./dist/`       |
| `pnpm preview`   | Preview the production build locally         |
| `pnpm astro ...` | Run Astro CLI commands (`astro add`, `astro check`, …) |

Deployment is handled via Wrangler / Cloudflare Workers using `wrangler.jsonc`.

## Project structure

```text
/
├── .pages.yml              # Pages CMS config (source of truth for content schema)
├── astro.config.mjs        # Astro config (Cloudflare adapter, integrations, redirects)
├── wrangler.jsonc          # Cloudflare Workers deploy config
├── uno.config.ts           # UnoCSS config
├── public/                 # Static assets served as-is
└── src/
    ├── config.ts           # Static SITE fallbacks (canonical URL, default SEO/JSON-LD)
    ├── content.config.ts   # AUTO-GENERATED from .pages.yml — do not edit by hand
    ├── content/            # CMS content
    │   ├── pages/          # Section-built pages (homepage, landing pages)
    │   ├── services/       # Service entries
    │   ├── caseStudies/    # Case study entries
    │   ├── settings/       # Site settings (name, SEO defaults, organization/JSON-LD)
    │   └── redirects.json  # 301/302 redirects (wired into astro.config.mjs)
    ├── pages/              # Astro routes ([...slug], services/[slug], case-studies/[slug], contact, llms.txt)
    ├── components/
    │   ├── blocks/         # Page-section blocks (see below)
    │   ├── layout/         # Every Layout primitives + Header/Footer/SEO
    │   ├── display/        # Presentational components
    │   ├── forms/          # Form components
    │   └── actions/        # Buttons / interactive actions
    ├── layouts/            # Layout.astro (base HTML shell)
    ├── styles/             # CSS custom properties, reset, typography, tokens, utilities
    ├── plugins/            # Markdown/rehype plugins (e.g. rehype-youtube-plyr)
    ├── scripts/            # Client scripts
    └── lib/                # Helpers
```

## Content model

Content collections are declared in `.pages.yml` and compiled to `src/content.config.ts` by `astro-pagescms` on build — **edit `.pages.yml`, never `content.config.ts` directly.**

- **pages** — built from an ordered list of `sections` (a discriminated union of block types)
- **services** — service offerings, with deliverables, FAQ, and ordering
- **caseStudies** — portfolio entries with a featured image and gallery
- **siteSettings** — global site name, tagline, default SEO, and organization details for JSON-LD
- **redirects** — `from` / `to` / `status` entries

### Page-section blocks

Pages are assembled from blocks rendered by `src/components/blocks/BlockRenderer.astro`. Each block type in the `pages` collection maps to a component:

`imageHeroBlock`, `videoHeroBlock`, `splitHeroBlock`, `heroStackedBlock`, `headingBlock`, `leadBlock`, `textBlock`, `textGridBlock`, `contentBlock`, `mediaBlock`, `mediaTextBlock`, `splitMediaBlock`, `featureBlock`, `featureGridBlock`, `aboutBlock`, `tileGridBlock`, `galleryBlock`, `carouselBlock`, `timelineBlock`, `quoteFeatureBlock`, `faqBlock`, `contactBlock`, `clientLogosBlock`, `serviceCardsBlock`, `caseStudyGridBlock`.

To scaffold a new block, use the `new-block` skill (or follow an existing block + its schema entry in `.pages.yml`).

## Editing content

Content lives in the Git repo and is edited either directly (Markdown with YAML frontmatter in `src/content/`) or through the Pages CMS UI, which commits changes back to the repo.
