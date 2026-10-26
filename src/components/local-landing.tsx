import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { PageIntro, FinalCTA, FAQ } from "./blocks";
import { Reveal } from "./motion";
import { btn } from "./brand";

export type LocalContent = {
  eyebrow: string;
  h1: string;
  intro: string;
  why: { t: string; d: string }[];
  includes: string[];
  localNotes: { t: string; d: string }[];
  faqs: { q: string; a: string }[];
  serviceSlug: string;
};

export function LocalLanding({ c }: { c: LocalContent }) {
  return (
    <>
      <PageIntro eyebrow={c.eyebrow} title={c.h1} text={c.intro}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/contact" className={btn({ size: "lg" })}>
            Get a Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/services/$slug"
            params={{ slug: c.serviceSlug }}
            className={btn({ variant: "outline", size: "lg" })}
          >
            Service details
          </Link>
        </div>
      </PageIntro>
      <section className="container-page grid gap-5 md:grid-cols-3">
        {c.why.map((w, i) => (
          <Reveal key={w.t} delay={i * 0.06}>
            <div className="h-full rounded-3xl border border-border bg-card p-7">
              <h2 className="font-display text-lg font-bold">{w.t}</h2>
              <p className="mt-2 text-muted-foreground">{w.d}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="container-page mt-24 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-h2">For businesses in Ahmedabad</h2>
          <div className="mt-8 space-y-6">
            {c.localNotes.map((n) => (
              <div key={n.t}>
                <h3 className="font-display font-bold">{n.t}</h3>
                <p className="mt-1 text-muted-foreground">{n.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-accent p-8">
          <h2 className="font-display text-2xl font-extrabold">What's included</h2>
          <ul className="mt-6 space-y-3">
            {c.includes.map((x) => (
              <li key={x} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="container-page mt-24 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-h2">Questions we hear often</h2>
        <FAQ items={c.faqs} />
      </section>
      <FinalCTA />
    </>
  );
}

export function localHead(path: string, title: string, desc: string) {
  return {
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:url", content: path },
    ],
    links: [{ rel: "canonical", href: path }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Novyra Digital",
          areaServed: { "@type": "City", name: "Ahmedabad" },
          description: desc,
        }),
      },
    ],
  };
}
