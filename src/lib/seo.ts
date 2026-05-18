import type { CollectionEntry } from "astro:content";

export type Breadcrumb = { name: string; url: string };
export type Faq = { question: string; answer: string };

type PageEntry = CollectionEntry<"pages">;
type ServiceEntry = CollectionEntry<"services">;

const slugFor = (page: PageEntry): string => page.data.slug ?? page.id;
const titleFor = (page: PageEntry): string =>
  page.data.seo?.title ?? page.data.title ?? page.id;

export function buildBreadcrumbs(
  slug: string,
  pages: PageEntry[],
  siteUrl: URL | string,
  leafTitle?: string,
): Breadcrumb[] {
  const site = typeof siteUrl === "string" ? siteUrl : siteUrl.toString();
  const base = site.replace(/\/$/, "");
  const clean = slug.replace(/^\/+|\/+$/g, "");
  if (!clean) return [];

  const segments = clean.split("/");
  const slugToPage = new Map(pages.map(p => [slugFor(p).replace(/^\/+|\/+$/g, ""), p]));

  const crumbs: Breadcrumb[] = [{ name: "Home", url: `${base}/` }];
  let accumulated = "";
  segments.forEach((seg, i) => {
    accumulated = accumulated ? `${accumulated}/${seg}` : seg;
    const match = slugToPage.get(accumulated);
    const isLeaf = i === segments.length - 1;
    const name =
      (isLeaf && leafTitle) ||
      (match && titleFor(match)) ||
      humanise(seg);
    crumbs.push({ name, url: `${base}/${accumulated}/` });
  });
  return crumbs;
}

export function breadcrumbListSchema(crumbs: Breadcrumb[]) {
  if (crumbs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function collectFaqsFromSections(sections: unknown[]): Faq[] {
  const out: Faq[] = [];
  for (const s of sections ?? []) {
    if (!s || typeof s !== "object") continue;
    const block = s as { type?: string; items?: Array<{ question?: string; answer?: string }> };
    if (block.type !== "faqBlock") continue;
    for (const item of block.items ?? []) {
      if (item?.question && item?.answer) {
        out.push({ question: item.question, answer: item.answer });
      }
    }
  }
  return out;
}

export function faqPageSchema(faqs: Faq[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(
  service: ServiceEntry,
  opts: {
    siteUrl: URL | string;
    orgId: string;
    pageUrl: string;
    areaServed?: string;
  },
) {
  const { data } = service;
  const site = typeof opts.siteUrl === "string" ? opts.siteUrl : opts.siteUrl.toString();
  const base = site.replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.title,
    serviceType: data.serviceType ?? data.title,
    description: data.description,
    url: opts.pageUrl,
    provider: { "@id": opts.orgId },
    areaServed: opts.areaServed ?? "Worldwide",
    ...(data.faq && data.faq.length > 0 && {
      mainEntityOfPage: `${base}/services/${data.slug ?? service.id.replace(/\.mdx?$/, "")}/`,
    }),
    ...(data.deliverables && data.deliverables.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${data.title} — deliverables`,
        itemListElement: data.deliverables
          .filter(d => d.item)
          .map(d => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: d.item },
          })),
      },
    }),
  };
}

function humanise(seg: string): string {
  return seg
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
