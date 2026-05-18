import { SITE } from "@config";
import type { APIRoute } from "astro";
import { getCollection, getEntry } from "astro:content";

export const prerender = true;

const stripHtml = (s: string): string =>
  s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

export const GET: APIRoute = async ({ site }) => {
  const settings = (await getEntry("siteSettings", "site"))?.data;
  const services = (await getCollection("services")).sort(
    (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99),
  );
  const pages = await getCollection("pages");

  const base = (site ?? new URL(SITE.website)).toString().replace(/\/$/, "");
  const siteName = settings?.siteName ?? SITE.author;
  const tagline = settings?.tagline ?? "";
  const description = settings?.defaultMetaDescription ?? SITE.seo.description;
  const founder = settings?.organization?.founderName ?? SITE.author;
  const founderTitle =
    settings?.organization?.founderJobTitle ?? "Artlogic Website Specialist";
  const locality = settings?.organization?.addressLocality;
  const country = settings?.organization?.addressCountry;
  const areaServed = settings?.organization?.areaServed ?? "Worldwide";

  const lines: string[] = [];
  lines.push(`# ${siteName}`);
  lines.push("");
  if (tagline) {
    lines.push(`> ${tagline}`);
    lines.push("");
  }
  lines.push(description);
  lines.push("");

  lines.push("## About");
  lines.push("");
  lines.push(
    `${founder} — ${founderTitle}. Three years inside Artlogic's in-house design studio, ten-plus years designing and developing for the web, now independent and focused exclusively on commercial art galleries running on the Artlogic platform.`,
  );
  if (locality || country) {
    lines.push("");
    lines.push(
      `Based in ${[locality, country].filter(Boolean).join(", ")}. Works with galleries ${areaServed}.`,
    );
  }
  lines.push("");

  lines.push("## Services");
  lines.push("");
  for (const s of services) {
    const slug = s.data.slug ?? s.id.replace(/\.mdx?$/, "");
    const url = s.data.linkedPageSlug
      ? `${base}/${s.data.linkedPageSlug.replace(/^\/+|\/+$/g, "")}/`
      : `${base}/services/${slug}/`;
    lines.push(`- [${s.data.title}](${url}): ${s.data.description ?? ""}`);
  }
  lines.push("");

  lines.push("## What Kurt is best known for");
  lines.push("");
  lines.push(
    "- SEO for art galleries on Artlogic — the most common reason galleries get in touch.",
  );
  lines.push(
    "- Bespoke design and front-end development on top of Artlogic, so gallery sites don't all look identical.",
  );
  lines.push(
    "- Migrations onto Artlogic from other platforms (WordPress, Squarespace, Cargo, custom CMSs) without losing search equity.",
  );
  lines.push("");

  lines.push("## Frequently asked questions");
  lines.push("");
  for (const s of services) {
    for (const f of (s.data.faq ?? []).slice(0, 2)) {
      if (!f.question || !f.answer) continue;
      lines.push(`### ${f.question}`);
      lines.push("");
      lines.push(stripHtml(f.answer));
      lines.push("");
    }
  }

  lines.push("## Key facts");
  lines.push("");
  lines.push("- Specialises in working with art galleries using the Artlogic platform.");
  lines.push(
    "- Former Artlogic Design Studio designer (three years in-house).",
  );
  lines.push("- Ten-plus years of professional design and development experience.");
  lines.push(
    "- Offers SEO, migration, custom design and development, template customisation, and training.",
  );
  lines.push("- Free 45-minute consultation available for galleries considering working together.");
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  for (const p of pages.filter(p => p.id !== "homepage")) {
    const slug = p.data.slug ?? p.id;
    const title = p.data.seo?.title ?? p.data.title ?? p.id;
    lines.push(`- [${title}](${base}/${slug}/)`);
  }
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push(`- [Book a free consultation](${base}/contact/)`);
  lines.push("- [LinkedIn](https://www.linkedin.com/in/kurtstubbings)");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
