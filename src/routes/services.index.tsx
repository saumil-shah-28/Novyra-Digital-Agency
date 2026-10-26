import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import { PageIntro, FinalCTA } from "@/components/blocks";
import { Reveal } from "@/components/motion";

const T = "Digital Services in Ahmedabad — Websites, Apps & Software | Novyra Digital";
const D =
  "Website development, e-commerce, Flutter apps, custom software, APIs, admin panels, digital marketing, technical SEO and maintenance from Novyra Digital.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Services built around your business goals."
        text="Choose a single service or combine them — most projects mix design, development and ongoing support."
      />
      <section className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.06}>
            <Link
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
            >
              <s.icon className="h-8 w-8 text-accent-foreground" />
              <h2 className="mt-6 font-display text-xl font-extrabold">{s.name}</h2>
              <p className="mt-2 flex-1 text-muted-foreground">{s.short}</p>
              <ul className="mt-5 space-y-1 text-sm text-muted-foreground">
                {s.scope.slice(0, 3).map((x) => (
                  <li key={x}>— {x}</li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-1 font-semibold text-accent-foreground">
                Explore{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </section>
      <FinalCTA />
    </>
  );
}
