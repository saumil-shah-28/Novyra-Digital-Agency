import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageIntro } from "@/components/blocks";
import { btn } from "@/components/brand";

const T = "Contact Novyra Digital — Start Your Project in Ahmedabad";
const D =
  "Tell us about your website, app or software project. Novyra Digital replies to every enquiry from businesses in Ahmedabad and across India.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const root = getRouteApi("__root__");

function Contact() {
  const s = root.useLoaderData();
  const wa = s?.whatsapp_number?.replace(/[^\d]/g, "");
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Let's discuss your project."
        text="Share a few details and we'll reply with next steps. No obligation."
      />
      <section className="container-page grid gap-10 lg:grid-cols-[1fr_340px]">
        <ContactForm />
        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Other ways to reach us</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent-foreground" />{" "}
                {s?.service_area ?? "Ahmedabad, Gujarat, India"}
              </li>
              {s?.contact_email && (
                <li>
                  <a
                    className="flex items-center gap-3 hover:text-accent-foreground"
                    href={`mailto:${s.contact_email}`}
                  >
                    <Mail className="h-4 w-4 text-accent-foreground" /> {s.contact_email}
                  </a>
                </li>
              )}
              {s?.contact_phone && (
                <li>
                  <a
                    className="flex items-center gap-3 hover:text-accent-foreground"
                    href={`tel:${s.contact_phone}`}
                  >
                    <Phone className="h-4 w-4 text-accent-foreground" /> {s.contact_phone}
                  </a>
                </li>
              )}
            </ul>
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className={btn({ variant: "soft", className: "mt-6 w-full" })}
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            )}
          </div>
          <div className="rounded-3xl bg-accent p-6 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">What happens next?</p>
            <ol className="mt-3 list-decimal space-y-1.5 pl-4">
              <li>We read your enquiry carefully.</li>
              <li>We reply by email with questions or a call time.</li>
              <li>After a short call, you get a written scope and estimate.</li>
            </ol>
          </div>
        </aside>
      </section>
    </>
  );
}
