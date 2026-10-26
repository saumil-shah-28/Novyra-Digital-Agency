import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, FinalCTA } from "@/components/blocks";
import { Reveal } from "@/components/motion";
import { SITE, TECHNOLOGIES } from "@/lib/site";

const T = "About Novyra Digital — Independent Digital Agency in Ahmedabad";
const D =
  "Novyra Digital is an independent digital agency in Ahmedabad building websites, Flutter apps, custom software and digital marketing for growing businesses.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const VALUES = [
  {
    t: "Clarity over jargon",
    d: "We explain options in plain language so you can make good decisions.",
  },
  {
    t: "Honest scope",
    d: "We say what a project includes, what it doesn't, and what it will realistically achieve.",
  },
  {
    t: "Craft that lasts",
    d: "Clean design and maintainable code that keep working after launch.",
  },
];

function About() {
  return (
    <>
      <PageIntro
        eyebrow="About"
        title={
          <>
            Ideas Into <span className="text-gradient-brand">Impact.</span>
          </>
        }
        text={SITE.description}
      />
      <section className="container-page grid gap-12 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-h2">An independent agency, starting in Ahmedabad.</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Novyra Digital is a focused, independent studio. We work closely with small and
              medium-sized businesses, startups and local service providers who want a digital
              presence that genuinely helps them grow.
            </p>
            <p>
              Our work spans websites, e-commerce, Flutter mobile apps, custom software, backend
              APIs and admin dashboards — so a project can grow from a simple site into a full
              product without changing partners.
            </p>
            <p>
              We start with Ahmedabad because local relationships matter: meeting in person,
              understanding the market, and being reachable when you need us.
            </p>
          </div>
        </Reveal>
      </section>
      <section className="container-page mt-24 grid gap-5 md:grid-cols-3">
        {VALUES.map((v, i) => (
          <Reveal key={v.t} delay={i * 0.07}>
            <div className="h-full rounded-3xl border border-border bg-card p-8">
              <p className="font-display text-4xl font-extrabold text-accent-foreground">
                0{i + 1}
              </p>
              <h3 className="mt-4 font-display text-xl font-bold">{v.t}</h3>
              <p className="mt-2 text-muted-foreground">{v.d}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="container-page mt-24">
        <h2 className="font-display text-2xl font-extrabold">Technologies we work with</h2>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {TECHNOLOGIES.map((t) => (
            <li
              key={t}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>
      <FinalCTA />
    </>
  );
}
