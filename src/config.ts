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
      url: string;
      logo: string;
      sameAs: string[];
    };
    localBusiness: {
      name: string;
      address: {
        streetAddress: string;
        addressLocality: string;
        postalCode: string;
        addressCountry: string;
      };
      telephone: string;
    };
  };
};

export const SITE: Site = {
  website: "https://www.artlogicspecialist.com",
  author: "Kurt Stubbings",
  seo: {
    title: "The Artlogic Specialist | Kurt Stubbings | Website Designer",
    description: "Artlogic website specialist helping galleries design, customise, and grow their sites. Over 10 years' experience, including 3 years at Artlogic. Get the website your gallery deserves.",
    image: "https://www.artlogicspecialist.com/og-image.png",
  },
  jsonld: {
    organization: {
      name: "The Artlogic Specialist",
      url: "https://www.artlogicspecialist.com",
      logo: "https://www.artlogicspecialist.com/logo.png",
      sameAs: [
        "https://www.linkedin.com/in/kurtstubbings",
        "https://kurtstubbings.com",
      ],
    },
    localBusiness: {
      name: "The Artlogic Specialist",
      address: {
        streetAddress: "",
        addressLocality: "",
        postalCode: "",
        addressCountry: "GB",
      },
      telephone: "",
    },
  },
};
