import { createFileRoute } from "@tanstack/react-router";
import { LocalLanding, localHead } from "@/components/local-landing";

const P = "/ecommerce-website-development-ahmedabad";
export const Route = createFileRoute("/ecommerce-website-development-ahmedabad")({
  head: () =>
    localHead(
      P,
      "E-commerce Website Development in Ahmedabad | Novyra Digital",
      "E-commerce website development in Ahmedabad for fashion, textile and retail brands: product catalogues, UPI payments and order management.",
    ),
  component: () => (
    <LocalLanding
      c={{
        eyebrow: "E-commerce · Ahmedabad",
        h1: "E-commerce Website Development in Ahmedabad",
        intro:
          "Ahmedabad has a long tradition in textiles, fashion and trade. We help local brands and retailers sell online with stores built for mobile shoppers and Indian payment methods.",
        serviceSlug: "ecommerce-development",
        why: [
          {
            t: "Catalogue-first design",
            d: "Variants, sizes, fabrics and colours presented clearly.",
          },
          {
            t: "Indian checkout",
            d: "UPI, cards, wallets and cash-on-delivery flows where supported.",
          },
          { t: "Manage it yourself", d: "Simple admin for products, stock and orders." },
        ],
        localNotes: [
          {
            t: "Retail and wholesale",
            d: "Many Ahmedabad businesses sell both B2C and B2B. Stores can support separate pricing or enquiry-based wholesale ordering.",
          },
          {
            t: "Shipping across India",
            d: "Delivery zones, charges and courier tracking can be configured for your logistics partner.",
          },
          {
            t: "GST-ready invoices",
            d: "Order and invoice details can include the tax fields your accountant needs.",
          },
        ],
        includes: [
          "Store design and catalogue setup",
          "Cart and checkout",
          "Payment gateway integration",
          "Order and stock management",
          "Order emails",
          "Store SEO foundation",
        ],
        faqs: [
          {
            q: "Can I start with a small catalogue?",
            a: "Yes. Many stores launch with a focused range and add products over time.",
          },
          {
            q: "Can you connect my store to Instagram?",
            a: "Product links and catalogue integrations are possible depending on the platform and Meta's requirements.",
          },
          {
            q: "Do you handle product photography?",
            a: "Not in-house, but we can advise on image sizes and consistency for your photographer.",
          },
        ],
      }}
    />
  ),
});
