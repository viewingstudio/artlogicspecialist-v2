/**
 * Static fallbacks used before the `siteSettings` CMS entry resolves
 * (and by astro.config.mjs which needs `site` at config-load time, when
 * content collections aren't available yet).
 *
 * Edit day-to-day SEO values in the CMS (Site Settings) instead of here.
 */

export type Site = {
  website: string;
  author: string;
  seo: {
    title: string;
    description: string;
    image: string;
  };
  jsonld: {
    organization: {
      name: string;
      logo: string;
      sameAs: string[];
    };
  };
};

export const SITE: Site = {
  website: "https://www.artlogicspecialist.com",
  author: "Kurt Stubbings",
  seo: {
    title: "The Artlogic Specialist | Kurt Stubbings | Designer & Developer for Art Galleries",
    description: "Artlogic website specialist helping galleries design, customise, and grow their sites. Over 10 years' experience, including 3 years inside Artlogic's design studio.",
    image: "https://www.artlogicspecialist.com/og-image.png",
  },
  jsonld: {
    organization: {
      name: "The Artlogic Specialist",
      logo: "https://www.artlogicspecialist.com/logo.png",
      sameAs: [
        "https://www.linkedin.com/in/kurtstubbings",
        "https://kurtstubbings.com",
      ],
    },
  },
};
