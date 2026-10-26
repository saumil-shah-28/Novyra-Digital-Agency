import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "@/components/blocks";

const T = "Privacy Policy | Novyra Digital";
const D =
  "How Novyra Digital collects, uses and protects personal information submitted through this website.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: () => (
    <section className="container-page py-20">
      <h1 className="text-h2">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Please have this policy reviewed by a qualified professional before relying on it.
      </p>
      <div className="mt-10">
        <Markdown>{`## What we collect
When you submit the enquiry form we collect your name, optional business name, email, optional WhatsApp number, the service you're interested in, budget range, timeline and project description. We also store a one-way hashed version of your IP address to prevent spam.

## How we use it
We use these details only to respond to your enquiry and discuss your project. We do not sell your information.

## Storage and retention
Enquiries are stored in a secured database accessible only to authorised staff. We keep enquiries for as long as needed to handle your request and any resulting project, then delete them on request.

## Your rights
You can ask us to access, correct or delete your information at any time using the contact page.

## Cookies and analytics
This website stores your light/dark theme preference in your browser. If analytics are enabled, they are used to understand aggregate site usage.

## Changes
We may update this policy. The latest version is always on this page.`}</Markdown>
      </div>
    </section>
  ),
});
