/**
 * Site-wide availability mode.
 *
 * Driven by a single boolean in the CMS (Site Settings → Availability → "Not
 * accepting new work"). When it is off, every helper here is a no-op and the
 * site renders exactly as it does in business-as-usual mode — that is what
 * makes rollback a one-click change rather than a code revert.
 */

import { getEntry } from "astro:content";

export type Availability = {
  closed: boolean;
  bannerText: string;
  reviewDate?: string;
  ctaLabel: string;
  ctaHref: string;
  heading: string;
  body: string;
  formNotice: string;
  submitLabel: string;
};

/** Used when the flag is on but a copy field was left blank in the CMS. */
const FALLBACKS = {
  bannerText: "I'm not taking on new gallery projects at the moment.",
  ctaLabel: "Join the waitlist",
  ctaHref: "/contact",
  heading: "Not currently taking on new work",
  body: "<p>I'm fully booked and not accepting new gallery projects for the foreseeable future. I'm still happy to hear from you — if you'd like to know when I reopen, or you have a quick question, use the form or email <a href=\"mailto:kurt@artlogicspecialist.com\">kurt@artlogicspecialist.com</a>. Please don't expect a project start date.</p>",
  formNotice:
    "Waitlist and general enquiries only — I'm not quoting new projects right now.",
  submitLabel: "Join the waitlist",
} as const;

export async function getAvailability(): Promise<Availability> {
  const settings = (await getEntry("siteSettings", "site"))?.data.availability;

  return {
    closed: settings?.closed ?? false,
    reviewDate: settings?.reviewDate,
    bannerText: settings?.bannerText || FALLBACKS.bannerText,
    ctaLabel: settings?.ctaLabel || FALLBACKS.ctaLabel,
    ctaHref: settings?.ctaHref || FALLBACKS.ctaHref,
    heading: settings?.heading || FALLBACKS.heading,
    body: settings?.body || FALLBACKS.body,
    formNotice: settings?.formNotice || FALLBACKS.formNotice,
    submitLabel: settings?.submitLabel || FALLBACKS.submitLabel,
  };
}

/** Links that start a new-business conversation, and so need softening. */
const isEnquiryHref = (href: string) =>
  href.startsWith("/contact") || href.startsWith("mailto:");

export type Cta = { label?: string; href?: string };

/**
 * Swap an enquiry CTA for the waitlist equivalent while closed. Returns the
 * CTA untouched otherwise, and for links that aren't enquiry surfaces
 * ("Learn more", case studies, service pages).
 */
export function resolveCta(availability: Availability, cta: Cta): Cta {
  if (!availability.closed || !cta.href) return cta;
  if (!isEnquiryHref(cta.href)) return cta;

  return { label: availability.ctaLabel, href: availability.ctaHref };
}
