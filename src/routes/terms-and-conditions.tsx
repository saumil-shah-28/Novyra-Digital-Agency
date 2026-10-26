import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "@/components/blocks";

const T = "Terms and Conditions | Novyra Digital";
const D = "Terms that govern the use of the Novyra Digital website.";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/terms-and-conditions" },
    ],
    links: [{ rel: "canonical", href: "/terms-and-conditions" }],
  }),
  component: () => (
    <section className="container-page py-20">
      <h1 className="text-h2">Terms and Conditions</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Please have these terms reviewed by a qualified professional before relying on them.
      </p>
      <div className="mt-10">
        <Markdown>{`## Use of this website
Content on this site is provided for general information. It is not a binding offer; every project is governed by its own written agreement.

## Intellectual property
The Novyra Digital name, logo, design and content of this website belong to Novyra Digital unless stated otherwise. Project screenshots are shown with the relevant owner's permission or are our own work.

## Enquiries
Submitting an enquiry does not create a contract. Scope, pricing, timelines and ownership are agreed in writing before any work begins.

## Third-party links
Links to other websites are provided for convenience. We are not responsible for their content.

## Liability
We work to keep this website accurate and available but do not guarantee it is error-free or uninterrupted.

## Governing law
These terms are governed by the laws of India, with courts in Ahmedabad, Gujarat having jurisdiction.`}</Markdown>
      </div>
    </section>
  ),
});
