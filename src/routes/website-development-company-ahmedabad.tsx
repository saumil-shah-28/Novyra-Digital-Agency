import { createFileRoute } from "@tanstack/react-router";
import { LocalLanding, localHead } from "@/components/local-landing";

const P = "/website-development-company-ahmedabad";
export const Route = createFileRoute("/website-development-company-ahmedabad")({
  head: () =>
    localHead(
      P,
      "Website Development Company in Ahmedabad | Novyra Digital",
      "Custom website design and development for Ahmedabad businesses — mobile-first, SEO-ready sites with clear pricing and direct communication.",
    ),
  component: () => (
    <LocalLanding
      c={{
        eyebrow: "Website development · Ahmedabad",
        h1: "Website Development Company in Ahmedabad",
        intro:
          "We design and build custom websites for Ahmedabad businesses — clinics, consultants, manufacturers, retailers and service providers — focused on turning local searches into real enquiries.",
        serviceSlug: "website-development",
        why: [
          {
            t: "Meet in person",
            d: "Being in Ahmedabad means workshops and reviews can happen face to face when that helps.",
          },
          {
            t: "Written scope, clear pricing",
            d: "You know exactly what you're getting before any work starts.",
          },
          {
            t: "Built for local search",
            d: "Location-aware content structure, metadata and Google Business Profile guidance.",
          },
        ],
        localNotes: [
          {
            t: "Bilingual audiences",
            d: "Many Ahmedabad customers browse in English and Gujarati. We can plan for Gujarati content where it helps your customers.",
          },
          {
            t: "WhatsApp-first enquiries",
            d: "Local customers often prefer WhatsApp to forms. We add clear WhatsApp contact options alongside your enquiry form.",
          },
          {
            t: "Mobile data realities",
            d: "Pages are kept light so they load quickly on mobile networks across the city.",
          },
        ],
        includes: [
          "Custom design for mobile and desktop",
          "Up to the pages your business needs",
          "Enquiry form and WhatsApp button",
          "On-page SEO and sitemap",
          "Google Search Console setup",
          "Handover and training",
        ],
        faqs: [
          {
            q: "Do you only work with Ahmedabad businesses?",
            a: "No — Ahmedabad is our home market, but we work remotely with businesses across India.",
          },
          {
            q: "Can you redesign my existing website?",
            a: "Yes. We review your current site, keep what works and preserve your search rankings with proper redirects.",
          },
          {
            q: "Will you help with Google Business Profile?",
            a: "We can guide you through setting up or improving your profile, which must be verified by the business owner.",
          },
        ],
      }}
    />
  ),
});
